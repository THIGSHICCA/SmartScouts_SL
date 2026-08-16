from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor
import json

def get_user_by_id(user_id):
    conn = get_db_connection()
    if not conn: return None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.troop_id, u.patrol_id, 
                   u.is_email_verified, u.scout_district, u.scout_reg_no, u.dob, u.scout_district_reg_no, 
                   u.commissioner_reg_no, u.status, u.leader_registration_id, u.avatar, u.cover_image, 
                   u.roles, u.achievements, u.batch, u.join_date,
                   t.name as troop_name 
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
            WHERE u.id = %s
        """, (user_id,))
        user = cur.fetchone()
        if user:
            if user.get('roles') and isinstance(user['roles'], str):
                try: user['roles'] = json.loads(user['roles'])
                except Exception: pass
            if user.get('achievements') and isinstance(user['achievements'], str):
                try: user['achievements'] = json.loads(user['achievements'])
                except Exception: pass
        return user
    except Exception as e:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.troop_id, u.patrol_id, 
                   u.is_email_verified, u.scout_district, u.scout_reg_no, u.dob, u.scout_district_reg_no, 
                   u.commissioner_reg_no, u.status, u.leader_registration_id, t.name as troop_name 
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
            WHERE u.id = %s
        """, (user_id,))
        return cur.fetchone()
    finally:
        conn.close()

def get_scouts_by_troop(troop_id):
    conn = get_db_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, first_name, last_name, email, role, scout_reg_no, patrol_id, avatar, cover_image FROM users WHERE troop_id = %s AND role IN ('scout', 'patrol_leader')", (troop_id,))
        return cur.fetchall()
    except Exception:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, first_name, last_name, email, role, scout_reg_no, patrol_id FROM users WHERE troop_id = %s AND role IN ('scout', 'patrol_leader')", (troop_id,))
        return cur.fetchall()
    finally:
        conn.close()

def update_user(user_id, data):
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        
        # Ensure profile columns exist in Postgres
        try:
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;")
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_image TEXT;")
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS scout_district VARCHAR(100);")
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS roles TEXT;")
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS achievements TEXT;")
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS batch VARCHAR(100);")
            cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS join_date VARCHAR(100);")
            conn.commit()
        except Exception:
            conn.rollback()

        fields = []
        values = []
        allowed_keys = [
            'first_name', 'last_name', 'email', 'troop_id', 'patrol_id', 'dob', 
            'scout_reg_no', 'scout_district', 'scout_district_reg_no', 
            'commissioner_reg_no', 'leader_registration_id', 'avatar', 'cover_image',
            'roles', 'achievements', 'batch', 'join_date'
        ]
        for k, v in data.items():
            if k in allowed_keys:
                if isinstance(v, (list, dict)):
                    v = json.dumps(v)
                fields.append(f"{k} = %s")
                values.append(v)
        if not fields: return False
        
        values.append(user_id)
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
        cur.execute(query, tuple(values))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating user: {e}")
        return False
    finally:
        conn.close()
