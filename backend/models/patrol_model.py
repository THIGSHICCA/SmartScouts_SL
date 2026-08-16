from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor

def get_patrol_by_leader_id(leader_id):
    conn = get_db_connection()
    if not conn: return None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Fetch patrol where the user is the patrol_leader_id
        cur.execute("SELECT * FROM patrols WHERE patrol_leader_id = %s", (leader_id,))
        return cur.fetchone()
    finally:
        conn.close()

def update_patrol_details(patrol_id, data):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("""
            UPDATE patrols 
            SET color = COALESCE(%s, color),
                motto = COALESCE(%s, motto)
            WHERE id = %s
        """, (data.get('color'), data.get('motto'), patrol_id))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating patrol details: {e}")
        return False
    finally:
        conn.close()

def get_patrol_members(patrol_id):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Fetch scouts currently assigned to this patrol
        cur.execute("""
            SELECT id, first_name, last_name, email, role, scout_reg_no, dob
            FROM users 
            WHERE patrol_id = %s AND role IN ('scout', 'patrol_leader')
        """, (patrol_id,))
        return cur.fetchall()
    finally:
        conn.close()

def add_patrol_member(patrol_id, scout_id):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        # Ensure scout is not already in a patrol, or reassign them
        cur.execute("UPDATE users SET patrol_id = %s WHERE id = %s", (patrol_id, scout_id))
        
        # Add to patrol_members history
        cur.execute("""
            INSERT INTO patrol_members (patrol_id, scout_id) 
            VALUES (%s, %s)
        """, (patrol_id, scout_id))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error adding patrol member: {e}")
        return False
    finally:
        conn.close()

def remove_patrol_member(scout_id):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("UPDATE users SET patrol_id = NULL WHERE id = %s", (scout_id,))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error removing patrol member: {e}")
        return False
    finally:
        conn.close()
