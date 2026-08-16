from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor

def get_all_badges():
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM badges ORDER BY level_order ASC")
        return cur.fetchall()
    finally:
        conn.close()

def get_badge_requirements(badge_id):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT * FROM badge_requirements 
            WHERE badge_id = %s 
            ORDER BY parent_id NULLS FIRST, order_number ASC
        """, (badge_id,))
        return cur.fetchall()
    finally:
        conn.close()

def get_user_progress(scout_id, badge_id=None):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        if badge_id:
            cur.execute("""
                SELECT p.*, r.requirement_text 
                FROM progress p
                JOIN badge_requirements r ON p.requirement_id = r.id
                WHERE p.scout_id = %s AND r.badge_id = %s
            """, (scout_id, badge_id))
        else:
            cur.execute("""
                SELECT p.*, r.requirement_text, r.badge_id 
                FROM progress p
                JOIN badge_requirements r ON p.requirement_id = r.id
                WHERE p.scout_id = %s
            """, (scout_id,))
        return cur.fetchall()
    finally:
        conn.close()

def create_badge_application(scout_id, badge_id):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO badge_applications (scout_id, badge_id, status)
            VALUES (%s, %s, 'pending')
            ON CONFLICT (scout_id, badge_id, status) DO NOTHING
            RETURNING id
        """, (scout_id, badge_id))
        conn.commit()
        res = cur.fetchone()
        return res[0] if res else True
    except Exception as e:
        print(f"Error creating badge application: {e}")
        return False
    finally:
        conn.close()

def get_pending_badge_applications(troop_id=None):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT a.id, a.scout_id, (u.first_name || ' ' || u.last_name) as scout_name, a.badge_id, b.name as badge_name, a.submitted_at
            FROM badge_applications a
            JOIN users u ON a.scout_id = u.id
            JOIN badges b ON a.badge_id = b.id
            WHERE a.status = 'pending'
        """
        if troop_id:
            query += " AND u.troop_id = %s"
            cur.execute(query, (troop_id,))
        else:
            cur.execute(query)
        return cur.fetchall()
    finally:
        conn.close()

def review_badge_application(application_id, leader_id, status, notes=None):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Update the application
        cur.execute("""
            UPDATE badge_applications
            SET status = %s, reviewed_by = %s, reviewed_at = NOW(), notes = %s
            WHERE id = %s
            RETURNING scout_id, badge_id
        """, (status, leader_id, notes, application_id))
        
        updated = cur.fetchone()
        if not updated:
            conn.rollback()
            return False
            
        # If approved, add to milestones
        if status == 'approved':
            cur.execute("""
                INSERT INTO milestones (scout_id, badge_id)
                VALUES (%s, %s)
                ON CONFLICT (scout_id, badge_id) DO NOTHING
            """, (updated['scout_id'], updated['badge_id']))
            
        conn.commit()
        return True
    except Exception as e:
        print(f"Error reviewing badge application: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
