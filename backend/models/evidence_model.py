from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor

def add_evidence(progress_id, scout_id, file_url, file_type):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO evidence (progress_id, scout_id, file_url, file_type)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (progress_id, scout_id, file_url, file_type))
        evidence_id = cur.fetchone()[0]
        conn.commit()
        return evidence_id
    finally:
        conn.close()

def get_evidence_for_progress(progress_id):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM evidence WHERE progress_id = %s", (progress_id,))
        return cur.fetchall()
    finally:
        conn.close()
