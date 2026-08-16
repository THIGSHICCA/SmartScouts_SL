"""
Re-index the syllabus from scratch with the cleaned RAG pipeline.
Run this once after fixing rag.py:
    python reindex.py
"""
import os, sys
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv()

from utils.chroma_client import get_syllabus_collection
from utils.rag import build_syllabus_index, _extract_english_blocks

print("=" * 55)
print("  SmartScouts — Syllabus Re-indexer")
print("=" * 55)

# Step 1: Wipe old garbled chunks
print("\n[1] Clearing existing ChromaDB collection...")
col = get_syllabus_collection()
old_count = col.count()
print(f"    Found {old_count} existing chunks.")
if old_count > 0:
    all_ids = col.get()['ids']
    if all_ids:
        col.delete(ids=all_ids)
    print(f"    Deleted {len(all_ids)} old chunks.")
else:
    print("    Collection already empty.")

# Step 2: Re-index from syllabus file
text_path = os.getenv('SYLLABUS_PDF_PATH', '../pdf_text.txt')
abs_path = os.path.abspath(text_path)
print(f"\n[2] Re-indexing from: {abs_path}")

if not os.path.exists(abs_path):
    print(f"    ERROR: File not found at {abs_path}")
    sys.exit(1)

success = build_syllabus_index(abs_path)

# Step 3: Verify
print("\n[3] Verification")
new_count = col.count()
print(f"    New chunk count: {new_count}")

if new_count > 0:
    sample = col.peek(3)
    docs = sample.get('documents', [])
    print("\n    Sample chunks:")
    for i, doc in enumerate(docs):
        print(f"\n    [{i+1}] {doc[:250]}...")
    print(f"\n    SUCCESS: ChromaDB re-indexed with {new_count} clean English chunks.")
else:
    print("    WARNING: No chunks were indexed. Check the syllabus file.")

print("=" * 55)
