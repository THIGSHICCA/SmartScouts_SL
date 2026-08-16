from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor

def check_and_award_milestone(scout_id, badge_id):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Check if all mandatory requirements are completed or verified
        cur.execute("""
            SELECT r.id, p.status 
            FROM badge_requirements r
            LEFT JOIN progress p ON r.id = p.requirement_id AND p.scout_id = %s
            WHERE r.badge_id = %s AND r.is_mandatory = TRUE
        """, (scout_id, badge_id))
        reqs = cur.fetchall()
        
        all_completed = True
        for r in reqs:
            if not r['status'] or r['status'] not in ('completed', 'verified'):
                all_completed = False
                break
                
        if all_completed and len(reqs) > 0:
            cur.execute("""
                INSERT INTO milestones (scout_id, badge_id)
                VALUES (%s, %s)
                ON CONFLICT (scout_id, badge_id) DO NOTHING
                RETURNING id
            """, (scout_id, badge_id))
            res = cur.fetchone()
            conn.commit()
            if res: return True
        return False
    finally:
        conn.close()

def get_scout_milestones(scout_id):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT m.*, b.name as badge_name, b.level_order
            FROM milestones m
            JOIN badges b ON m.badge_id = b.id
            WHERE m.scout_id = %s
            ORDER BY m.achieved_at DESC
        """, (scout_id,))
        return cur.fetchall()
    finally:
        conn.close()
