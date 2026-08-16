import os
import re
import uuid
from utils.chroma_client import get_syllabus_collection
from sentence_transformers import SentenceTransformer

# Load embedding model once
_embedder = None

def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedder


# ── Text Cleaning ─────────────────────────────────────────────────────────────

# Bamini-encoded Tamil uses specific ASCII patterns that look like random
# keyboard characters. This regex detects them:
# Typical Bamini patterns: sequences of f, g, j, k, n, r, s, t, u, l, etc.
# with semicolons, single-quotes, vowel markers
_BAMINI_PATTERN = re.compile(
    r'[a-z];[a-z]|[A-Z][a-z]{2,}[;]|[fnrjkglstuvwxyz]{3,}[;]'
    r'|[fgrkjlmnstpz];|[A-Z];|[fgkljnrstzuv]{4,}'
)

# Detect lines that are >30% non-ASCII printable chars (Tamil/Sinhala Unicode)
def _has_unicode_script(text):
    """Returns True if text contains significant Tamil/Sinhala Unicode characters."""
    non_ascii = sum(1 for c in text if ord(c) > 127)
    total = len(text)
    if total == 0:
        return False
    return (non_ascii / total) > 0.15


def _is_english_dominant(text, threshold=0.75):
    """
    Returns True if the text is clearly English-dominant.
    Counts only alphabetic characters and checks what fraction are ASCII.
    """
    alpha_chars = [c for c in text if c.isalpha()]
    if not alpha_chars:
        return False
    ascii_alpha = [c for c in alpha_chars if ord(c) < 128]
    return (len(ascii_alpha) / len(alpha_chars)) >= threshold


def _clean_line(line):
    """Strip whitespace and common PDF artifacts from a single line."""
    line = line.strip()
    # Remove lines that are only dots, dashes, underscores, or whitespace (form fields)
    if re.match(r'^[\.\-\_\s…:]+$', line):
        return ''
    # Remove standalone page numbers
    if re.match(r'^\d{1,3}$', line):
        return ''
    # Remove form-field placeholder lines (all dots or blanks)
    if re.match(r'^[\.\s]+$', line):
        return ''
    return line


# Bamini Tamil font uses semicolons as vowel-killer marks and specific letter
# combinations that never appear in English. These patterns reliably identify
# Bamini-encoded Tamil text:
#  - letter + semicolon (e.g. "f;" = ka, "r;" = cha, "j;" = tha)
#  - consonant clusters like "rhuzu", "fk;", "Ngld;", "jpfjp"
_BAMINI_INDICATORS = re.compile(
    r'\b[a-z]{1,4};[a-z]'       # consonant+semicolon+letter (e.g. "f;F", "j;jp")
    r'|[a-z];[ ,.]'             # consonant+semicolon at word boundary
    r'|\b[fnrjkgltspz]{2,};'    # 2+ lowercase consonants followed by semicolon
    r'|[A-Z][a-z]{1,3};'        # uppercase + lowercase + semicolon (e.g. "Nfh;")
    r'|\brhuzu\b'               # literal Bamini word for "scout"
    r'|\bNjh\b|\bNfh\b|\bNgh\b' # Bamini vowel-o combinations
)


def _is_valid_english_line(line):
    """
    Returns True if this line should be kept for indexing.
    Rejects:
    - Lines with >15% non-ASCII (Tamil/Sinhala Unicode)
    - Lines matching Bamini Tamil font encoding patterns
    - Lines where <75% of alpha chars are ASCII
    - Very short lines (< 10 chars)
    - Lines that are purely numeric or punctuation
    """
    if len(line) < 10:
        return False

    # Reject Unicode Tamil/Sinhala script
    if _has_unicode_script(line):
        return False

    # Reject Bamini-encoded Tamil (ASCII-based Tamil font)
    if _BAMINI_INDICATORS.search(line):
        return False

    # Must be ASCII-dominant
    if not _is_english_dominant(line, threshold=0.75):
        return False

    # Must have at least some real English words (2+ consecutive alpha chars)
    if not re.search(r'[A-Za-z]{2,}', line):
        return False

    return True


def _extract_english_blocks(text, window=10, step=5):
    """
    Extracts clean English-dominant requirement blocks from the syllabus.

    Strategy:
    - Read line-by-line; keep only lines that pass the English validity check.
    - Group consecutive kept lines into sliding windows for overlapping coverage.
    - Discard chunks below 100 characters.
    """
    lines = text.splitlines()
    kept = []
    for line in lines:
        cleaned = _clean_line(line)
        if not cleaned:
            continue
        if _is_valid_english_line(cleaned):
            kept.append(cleaned)

    if not kept:
        return []

    # Sliding window chunking for overlap and better semantic coverage
    chunks = []
    i = 0
    while i < len(kept):
        window_lines = kept[i:i + window]
        block = '\n'.join(window_lines).strip()
        if len(block) >= 100:
            chunks.append(block)
        i += step

    return chunks


def _clean_pdf_text(text):
    """Same cleaning pipeline for uploaded PDF text."""
    return _extract_english_blocks(text)


# ── Index Builder ─────────────────────────────────────────────────────────────

def build_syllabus_index(text_path):
    """
    Reads the syllabus text file, extracts clean English-only blocks,
    embeds them, and upserts into ChromaDB.
    """
    if not os.path.exists(text_path):
        print(f"File not found: {text_path}")
        return False

    # Try UTF-8 first, fall back to latin-1 which handles most encodings
    text = None
    for enc in ('utf-8', 'utf-8-sig', 'latin-1'):
        try:
            with open(text_path, 'r', encoding=enc) as f:
                text = f.read()
            break
        except UnicodeDecodeError:
            continue

    if text is None:
        print("Could not decode syllabus file with any supported encoding.")
        return False

    chunks = _extract_english_blocks(text)
    if not chunks:
        print("No usable English chunks found in syllabus file.")
        return False

    print(f"Indexing {len(chunks)} clean English chunks from syllabus...")

    embedder = get_embedder()
    embeddings = embedder.encode(chunks, show_progress_bar=False)

    collection = get_syllabus_collection()

    ids = [f"chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": "syllabus"} for _ in chunks]

    collection.upsert(
        documents=chunks,
        embeddings=embeddings.tolist(),
        ids=ids,
        metadatas=metadatas,
    )

    print(f"Successfully indexed {len(chunks)} chunks.")
    return True


# ── Query ─────────────────────────────────────────────────────────────────────

def query_syllabus(question, n_results=5):
    """Query ChromaDB for the most relevant syllabus chunks."""
    embedder = get_embedder()
    query_embedding = embedder.encode([question])[0].tolist()

    collection = get_syllabus_collection()

    if collection.count() == 0:
        return []

    # Clamp n_results to available count
    available = collection.count()
    n_results = min(n_results, available)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
    )

    if results and results['documents'] and results['documents'][0]:
        return results['documents'][0]
    return []


# ── Upload & Index Document ───────────────────────────────────────────────────

import fitz  # PyMuPDF

def process_and_index_document(file_stream, filename, file_type, doc_id=None):
    """
    Extracts text from an uploaded PDF or TXT file, cleans it,
    chunks it into English-dominant blocks, and indexes into ChromaDB.
    """
    text = ""

    try:
        if file_type == 'application/pdf' or filename.lower().endswith('.pdf'):
            doc = fitz.open(stream=file_stream.read(), filetype="pdf")
            for page in doc:
                page_text = page.get_text()
                if page_text:
                    text += page_text + "\n\n"
        else:
            raw = file_stream.read()
            for enc in ('utf-8', 'utf-8-sig', 'latin-1'):
                try:
                    text = raw.decode(enc)
                    break
                except UnicodeDecodeError:
                    continue

        if not text.strip():
            return False

        chunks = _clean_pdf_text(text)

        if not chunks:
            # Fallback: paragraph split with strict English filter
            raw_chunks = re.split(r'\n\s*\n', text)
            chunks = [
                c.strip() for c in raw_chunks
                if len(c.strip()) > 80 and _is_valid_english_line(c.strip())
            ]

        if not chunks:
            print(f"No usable English content found in {filename}")
            return False

        print(f"Indexing {len(chunks)} chunks from '{filename}'...")

        embedder = get_embedder()
        embeddings = embedder.encode(chunks, show_progress_bar=False)

        collection = get_syllabus_collection()

        if not doc_id:
            doc_id = str(uuid.uuid4())[:8]
        ids = [f"chunk_{doc_id}_{i}" for i in range(len(chunks))]
        metadatas = [{"source": filename} for _ in chunks]

        collection.upsert(
            documents=chunks,
            embeddings=embeddings.tolist(),
            metadatas=metadatas,
            ids=ids,
        )
        return True

    except Exception as e:
        print(f"Error processing document '{filename}': {e}")
        return False
