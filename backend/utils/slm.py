import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["TQDM_DISABLE"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

import re
import warnings
import torch
import transformers

# Maximize CPU multithreading for fast local generation
num_cores = os.cpu_count() or 4
torch.set_num_threads(num_cores)

transformers.utils.logging.disable_progress_bar()
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

import threading
_model = None
_tokenizer = None
_load_lock = threading.Lock()

def load_model():
    global _model, _tokenizer
    with _load_lock:
        if _model is not None:
            return _model, _tokenizer

        model_name = os.getenv('MODEL_NAME', 'Qwen/Qwen3-1.7B')

    print(f"Loading SLM: {model_name}...", flush=True)
    hf_token = os.getenv('HF_TOKEN', None)

    # Dynamic Device Selection (CUDA if available, else CPU)
    target_device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Targeting device: {target_device}", flush=True)

    try:
        _tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
        
        # Try loading on target device (CUDA preferred if available)
        try:
            if target_device == "cuda":
                print("Configuring 4-bit quantization to fit in GPU VRAM...", flush=True)
                quantization_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4"
                )
                
                _model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    quantization_config=quantization_config,
                    low_cpu_mem_usage=True,
                    device_map={"":"cuda:0"},
                    token=hf_token
                )
            else:
                _model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    dtype=torch.bfloat16,
                    low_cpu_mem_usage=True,
                    token=hf_token
                ).to("cpu")
                
            print(f"SLM loaded successfully on {target_device.upper()}.", flush=True)
        except Exception as gpu_err:
            print(f"Failed to load model on {target_device.upper()}: {gpu_err}", flush=True)
            raise gpu_err

        # Diagnostic memory check
        if hasattr(_model, "device") and _model.device.type == "cuda":
            vram_mb = torch.cuda.memory_allocated() / (1024 ** 2)
            print(f"GPU VRAM in use: {vram_mb:.2f} MB", flush=True)

    except Exception as e:
        print(f"Error loading model: {e}", flush=True)

    return _model, _tokenizer


def _preload_model():
    print("Pre-loading AI model in the background...", flush=True)
    load_model()

import threading
threading.Thread(target=_preload_model, daemon=True).start()


def _strip_thinking(text):
    """Remove Qwen3 <think>...</think> blocks if any slip through."""
    return re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()


def _clean_output(text):
    """
    Strip any non-ASCII (Tamil/Sinhala) characters that might have been
    echoed from context into the model's output. Keeps only printable ASCII.
    """
    # Remove any character outside printable ASCII range (32-126) except
    # common safe Unicode: newlines, tabs stay; exotic scripts are removed.
    cleaned = re.sub(r'[^\x00-\x7F]+', ' ', text)
    # Collapse multiple spaces
    cleaned = re.sub(r'  +', ' ', cleaned)
    return cleaned.strip()


def generate_answer(question, context_chunks):
    model, tokenizer = load_model()
    if not model or not tokenizer:
        return "AI model is currently unavailable."

    # Join context chunks with clear separators
    context = "\n---\n".join(context_chunks)

    # Qwen3 instruction-tuned prompt — context embedded in user turn
    messages = [
        {
            "role": "system",
            "content": (
                "You are a knowledgeable Sri Lanka Scout Association Assistant. "
                "Answer the user's question clearly, accurately, and concisely using standard formatting. "
                "Use structured bullet points, clear headings, and compact sentences. "
                "Avoid unnecessary blank lines, huge spacing, or repetitive filler sentences. "
                "If context is provided, synthesize a clean, direct answer for the Scout."
            )
        },
        {
            "role": "user",
            "content": (
                f"=== SYLLABUS CONTEXT ===\n{context}\n=== END CONTEXT ===\n\n"
                f"Question: {question}\n\n"
                "Answer fully and completely:"
            )
        }
    ]

    try:
        # enable_thinking=False disables Qwen3's chain-of-thought reasoning
        # for faster, cleaner responses (no <think> blocks in output)
        prompt = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False
        )
    except TypeError:
        # Fallback: older tokenizer versions may not support enable_thinking
        prompt = tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
    except Exception:
        # Last-resort plaintext fallback
        prompt = (
            "You are a helpful Sri Lanka Scout Assistant. "
            "Answer ONLY using the syllabus context below.\n\n"
            f"=== SYLLABUS CONTEXT ===\n{context}\n=== END CONTEXT ===\n\n"
            f"Question: {question}\n\nAnswer concisely:"
        )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,    # Increased token count for complete answers
            do_sample=True,
            temperature=0.6,       # Qwen3 recommended: 0.6
            top_p=0.9,             # Qwen3 recommended: 0.9
            top_k=20,              # Qwen3 recommended: 20
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id
        )

    # Decode only the newly generated tokens (not the prompt)
    new_tokens = outputs[0][inputs['input_ids'].shape[1]:]
    response = tokenizer.decode(new_tokens, skip_special_tokens=True)

    # Strip any residual thinking blocks and non-ASCII garble as a safety net
    response = _strip_thinking(response)
    response = _clean_output(response)
    return response
