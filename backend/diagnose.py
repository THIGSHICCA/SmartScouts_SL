import os, sys, time
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv()

print("=" * 55)
print("   SmartScouts AI Pipeline Diagnostic Report")
print("=" * 55)

# ── 1. System Resources ──────────────────────────────────
print("\n[1] System Resources")
try:
    import psutil
    ram = psutil.virtual_memory()
    print(f"  Total RAM      : {ram.total / (1024**3):.1f} GB")
    print(f"  Available RAM  : {ram.available / (1024**3):.1f} GB")
    print(f"  Used RAM       : {ram.percent}%")
    cpu_count = psutil.cpu_count(logical=False)
    print(f"  CPU cores      : {cpu_count} physical")
except ImportError:
    print("  psutil not installed - run: pip install psutil")

# ── 2. GPU / CUDA ────────────────────────────────────────
print("\n[2] GPU / CUDA")
try:
    import torch
    if torch.cuda.is_available():
        name = torch.cuda.get_device_name(0)
        vram = torch.cuda.get_device_properties(0).total_memory / (1024**3)
        print(f"  GPU            : {name}")
        print(f"  VRAM           : {vram:.1f} GB")
    else:
        print("  GPU            : NOT DETECTED  <-- running on CPU only")
        print("  IMPACT         : Gemma 3 4B will take 5-15 min per response")
except Exception as e:
    print(f"  Error: {e}")

# ── 3. Model Cache ───────────────────────────────────────
print("\n[3] Model Cache")
model_name = os.getenv('MODEL_NAME', 'google/gemma-3-4b-it')
print(f"  Configured model: {model_name}")
cache_dir = os.path.join(os.path.expanduser('~'), '.cache', 'huggingface', 'hub')
safe_name = 'models--' + model_name.replace('/', '--')
model_path = os.path.join(cache_dir, safe_name)
if os.path.exists(model_path):
    import pathlib
    size = sum(f.stat().st_size for f in pathlib.Path(model_path).rglob('*') if f.is_file())
    print(f"  Cached          : YES ({size/(1024**3):.1f} GB on disk)")
else:
    print("  Cached          : NO  <-- will download ~8 GB on first AI request")

# ── 4. ChromaDB Index ────────────────────────────────────
print("\n[4] ChromaDB Syllabus Index")
try:
    from utils.chroma_client import get_syllabus_collection
    col = get_syllabus_collection()
    count = col.count()
    print(f"  Chunks indexed  : {count}")
    if count == 0:
        print("  STATUS          : EMPTY  <-- RAG has NO context to return!")
        print("  FIX             : Upload a syllabus PDF via the admin panel")
    else:
        sample = col.peek(1)
        docs = sample.get('documents', [['']])
        preview = docs[0][:150] if docs else 'n/a'
        print(f"  Sample chunk    : {preview}...")
        print("  STATUS          : OK")
except Exception as e:
    print(f"  ChromaDB Error  : {e}")

# ── 5. Syllabus PDF ──────────────────────────────────────
print("\n[5] Syllabus PDF Path")
pdf_path = os.getenv('SYLLABUS_PDF_PATH', '../pdf_text.txt')
abs_path = os.path.abspath(pdf_path)
exists = os.path.exists(abs_path)
print(f"  Path            : {abs_path}")
exists_str = "YES" if exists else "NO  <-- file missing"
print(f"  Exists          : {exists_str}")
if exists:
    size = os.path.getsize(abs_path) / 1024
    print(f"  Size            : {size:.1f} KB")

# ── 6. Inference Speed Estimate ──────────────────────────
print("\n[6] Inference Speed Estimate (CPU)")
model_sizes = {
    'google/gemma-3-4b-it'        : (4.0,  '~3-10 min/response  [CURRENT - TOO SLOW]'),
    'google/gemma-3-1b-it'        : (1.0,  '~20-40s/response    [Faster local option]'),
    'HuggingFaceTB/SmolLM2-1.7B-Instruct': (1.7, '~25-50s/response    [Faster local option]'),
    'microsoft/Phi-3-mini-4k-instruct': (3.8, '~2-5 min/response   [TOO SLOW on CPU]'),
    'Groq API (cloud)'            : (0,    '< 1s/response       [RECOMMENDED]'),
}
current = os.getenv('MODEL_NAME', 'google/gemma-3-4b-it')
for mname, (params, estimate) in model_sizes.items():
    marker = ' <-- CURRENT' if mname == current else ''
    print(f"  {mname:<45} {estimate}{marker}")

print("\n[7] Root Cause Summary")
print("-" * 55)
print("  The model runs on CPU without a GPU. Gemma 3 4B")
print("  generates ~1-3 tokens/second on CPU, meaning a")
print("  short answer (100 tokens) takes 30s-5 min.")
print("  The frontend request likely times out before")
print("  the model finishes generating.")
print()
print("  Recommended Fix: Switch to Groq API (free, <1s)")
print("  Or: Switch to gemma-3-1b-it in .env for local use")
print("=" * 55)
