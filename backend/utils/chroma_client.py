import os
import chromadb
from chromadb.config import Settings

_client = None

def get_chroma_client():
    global _client
    if _client is None:
        persist_dir = os.getenv('CHROMA_PERSIST_DIR', './chroma_db')
        _client = chromadb.PersistentClient(path=persist_dir)
    return _client

def get_syllabus_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="scout_syllabus",
        metadata={"hnsw:space": "cosine"}
    )
