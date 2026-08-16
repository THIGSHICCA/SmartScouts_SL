from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor

def create_notification(user_id, message, notif_type='info'):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO notifications (user_id, message, type)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (user_id, message, notif_type))
        conn.commit()
        return True
    finally:
        conn.close()

def get_notifications(user_id):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM notifications WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        return cur.fetchall()
    finally:
        conn.close()

def mark_read(notification_id, user_id):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("UPDATE notifications SET is_read = TRUE WHERE id = %s AND user_id = %s", (notification_id, user_id))
        conn.commit()
        return True
    finally:
        conn.close()
