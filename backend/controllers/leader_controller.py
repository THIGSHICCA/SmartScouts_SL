from flask import request, jsonify
from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor
import uuid

def get_troops_list():
    """Return a simple list of all troops — accessible to leaders."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, troop_id, name, district FROM troops ORDER BY name")
        troops = cur.fetchall()
        return jsonify(troops), 200
    except Exception as e:
        print(f"Error fetching troops: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()

def create_patrol():
    data = request.get_json()
    name = data.get('name')
    patrol_leader_id = data.get('patrol_leader_id')
    scout_ids = data.get('scout_ids', []) # list of user ids

    if not name:
        return jsonify({"message": "Patrol name is required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        from flask import g
        # Assuming leader is logged in, we get their troop_id
        # For simplicity in this implementation, we expect troop_id to be passed or derived
        troop_id = data.get('troop_id') # In real scenario, extract from JWT user details
        leader_id = getattr(g, 'user_id', None)
        
        if not troop_id:
            return jsonify({"message": "Troop ID is required"}), 400

        cur = conn.cursor()
        
        patrol_id_str = f"PAT-{uuid.uuid4().hex[:6].upper()}"
        
        cur.execute(
            "INSERT INTO patrols (patrol_id, name, troop_id, leader_id, patrol_leader_id) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (patrol_id_str, name, troop_id, leader_id, patrol_leader_id)
        )
        patrol_db_id = cur.fetchone()[0]

        # Update the patrol leader's role to 'patrol_leader' and set their patrol_id
        if patrol_leader_id:
            cur.execute("UPDATE users SET role = 'patrol_leader', patrol_id = %s WHERE id = %s", (patrol_db_id, patrol_leader_id))
            cur.execute("INSERT INTO patrol_members (patrol_id, scout_id) VALUES (%s, %s)", (patrol_db_id, patrol_leader_id))

        # Update other scouts
        for s_id in scout_ids:
            if s_id != patrol_leader_id:
                cur.execute("UPDATE users SET patrol_id = %s WHERE id = %s", (patrol_db_id, s_id))
                cur.execute("INSERT INTO patrol_members (patrol_id, scout_id) VALUES (%s, %s)", (patrol_db_id, s_id))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Patrol created successfully",
            "patrol_id": patrol_id_str
        }), 201

    except Exception as e:
        print(f"Error creating patrol: {e}")
        return jsonify({"message": "Internal server error"}), 500

def get_scouts():
    # Helper to get unassigned scouts for the troop
    troop_id = request.args.get('troop_id')
    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, first_name, last_name, scout_reg_no, email, created_at, troop_id FROM users WHERE troop_id = %s AND patrol_id IS NULL AND role = 'scout'", (troop_id,))
        scouts = cur.fetchall()
        return jsonify(scouts), 200
    finally:
        conn.close()

def add_scout_to_troop():
    data = request.get_json()
    troop_id = data.get('troop_id')
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    scout_reg_no = data.get('scout_reg_no')
    dob = data.get('dob')
    email = data.get('email')
    patrol_id = data.get('patrol_id')
    recent_badge_id = data.get('recent_badge_id')

    if not troop_id:
        return jsonify({"message": "Troop ID is required"}), 400

    if not first_name or not last_name or not email:
        return jsonify({"message": "First name, last name, and email are required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor()

        # 0. Fetch the troop's district to auto-assign to the scout
        cur.execute("SELECT district FROM troops WHERE id = %s", (troop_id,))
        troop_row = cur.fetchone()
        troop_district = troop_row[0] if troop_row else None
        
        # 1. Check if user already exists by email
        cur.execute("SELECT id, troop_id, role FROM users WHERE email = %s", (email,))
        existing_user = cur.fetchone()
        
        if existing_user:
            user_id = existing_user[0]
            existing_troop_id = existing_user[1]
            existing_role = existing_user[2]
            
            if existing_role != 'scout':
                return jsonify({"message": f"User with email {email} exists but has role '{existing_role}'. Cannot add as scout."}), 400
                
            if existing_troop_id is not None:
                return jsonify({"message": f"Scout with email {email} is already assigned to a troop."}), 400
                
            # If they are a scout and have no troop, update their details + auto-set district from troop
            cur.execute("""
                UPDATE users 
                SET troop_id = %s,
                    patrol_id = COALESCE(%s, patrol_id),
                    first_name = %s,
                    last_name = %s,
                    scout_reg_no = COALESCE(%s, scout_reg_no),
                    dob = %s,
                    scout_district = COALESCE(%s, scout_district),
                    status = 'active'
                WHERE id = %s
            """, (troop_id, patrol_id, first_name, last_name, scout_reg_no if scout_reg_no else None, dob if dob else None, troop_district, user_id))
            
            # If patrol_id was updated/provided, also record in patrol_members
            if patrol_id:
                cur.execute("SELECT 1 FROM patrol_members WHERE patrol_id = %s AND scout_id = %s", (patrol_id, user_id))
                if not cur.fetchone():
                    cur.execute("INSERT INTO patrol_members (patrol_id, scout_id) VALUES (%s, %s)", (patrol_id, user_id))

            if recent_badge_id:
                cur.execute("INSERT INTO milestones (scout_id, badge_id) VALUES (%s, %s) ON CONFLICT (scout_id, badge_id) DO NOTHING", (user_id, recent_badge_id))

            
        else:
            # 2. Check if reg no is already taken by someone else
            if scout_reg_no:
                cur.execute("SELECT id FROM users WHERE scout_reg_no = %s", (scout_reg_no,))
                if cur.fetchone():
                    return jsonify({"message": "A scout with this registration number already exists."}), 400
            
            # 3. Create a brand new scout
            from utils.auth import hash_password
            default_pw_hash = hash_password('scout123')
            
            cur.execute("""
                INSERT INTO users (first_name, last_name, email, password_hash, dob, scout_reg_no, role, status, troop_id, patrol_id, scout_district, is_email_verified)
                VALUES (%s, %s, %s, %s, %s, %s, 'scout', 'active', %s, %s, %s, TRUE)
                RETURNING id
            """, (first_name, last_name, email, default_pw_hash, dob if dob else None, scout_reg_no if scout_reg_no else None, troop_id, patrol_id, troop_district))
            user_id = cur.fetchone()[0]
            
            if patrol_id:
                cur.execute("INSERT INTO patrol_members (patrol_id, scout_id) VALUES (%s, %s)", (patrol_id, user_id))

            if recent_badge_id:
                cur.execute("INSERT INTO milestones (scout_id, badge_id) VALUES (%s, %s) ON CONFLICT (scout_id, badge_id) DO NOTHING", (user_id, recent_badge_id))

        # 4. Insert into troop_members
        cur.execute("SELECT 1 FROM troop_members WHERE troop_id = %s AND user_id = %s", (troop_id, user_id))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO troop_members (troop_id, user_id, status) VALUES (%s, %s, 'active')",
                (troop_id, user_id)
            )
            
        conn.commit()
        return jsonify({"message": "Scout added to troop successfully", "scout_id": user_id}), 200
    except Exception as e:
        print(f"Error adding scout to troop: {e}")
        if conn:
            conn.rollback()
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
    finally:
        cur.close()
        conn.close()

def search_unassigned_scouts():
    email = request.args.get('email')
    scout_reg_no = request.args.get('scout_reg_no')
    
    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        if email:
            cur.execute("SELECT id, first_name, last_name, email, scout_reg_no, scout_district FROM users WHERE email = %s AND troop_id IS NULL AND role = 'scout'", (email,))
        elif scout_reg_no:
            cur.execute("SELECT id, first_name, last_name, email, scout_reg_no, scout_district FROM users WHERE scout_reg_no = %s AND troop_id IS NULL AND role = 'scout'", (scout_reg_no,))
        else:
            return jsonify([]), 200
            
        scouts = cur.fetchall()
        return jsonify(scouts), 200
    finally:
        conn.close()

def get_troop_scouts():
    troop_id = request.args.get('troop_id')
    if not troop_id:
        return jsonify({"message": "Troop ID is required"}), 400
        
    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT u.id, u.first_name, u.last_name, u.scout_reg_no, u.email, u.dob, u.patrol_id, p.name as patrol_name,
                   (SELECT b.name FROM milestones m JOIN badges b ON m.badge_id = b.id WHERE m.scout_id = u.id ORDER BY b.level_order DESC LIMIT 1) as recent_badge
            FROM users u 
            LEFT JOIN patrols p ON u.patrol_id = p.id 
            WHERE u.troop_id = %s AND u.role IN ('scout', 'patrol_leader')
            ORDER BY u.first_name, u.last_name
        """, (troop_id,))
        scouts = cur.fetchall()
        return jsonify(scouts), 200
    finally:
        conn.close()

def get_troop_patrols():
    troop_id = request.args.get('troop_id')
    if not troop_id:
        return jsonify({"message": "Troop ID is required"}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT p.id, p.patrol_id, p.name, 
                   u.first_name as pl_first_name, u.last_name as pl_last_name,
                   (SELECT COUNT(*) FROM users u2 WHERE u2.patrol_id = p.id) as member_count
            FROM patrols p
            LEFT JOIN users u ON p.patrol_leader_id = u.id
            WHERE p.troop_id = %s
            ORDER BY p.name
        """, (troop_id,))
        patrols = cur.fetchall()
        return jsonify(patrols), 200
    finally:
        conn.close()

def get_patrol_details(patrol_id):
    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Get patrol
        cur.execute("SELECT * FROM patrols WHERE id = %s", (patrol_id,))
        patrol = cur.fetchone()
        if not patrol:
            return jsonify({"message": "Patrol not found"}), 404

        # Get members
        cur.execute("""
            SELECT id, first_name, last_name, scout_reg_no, email, role 
            FROM users 
            WHERE patrol_id = %s 
            ORDER BY role DESC, first_name
        """, (patrol_id,))
        members = cur.fetchall()
        
        return jsonify({
            "patrol": patrol,
            "members": members
        }), 200
    finally:
        conn.close()

def edit_patrol(patrol_id):
    data = request.get_json()
    name = data.get('name')
    patrol_leader_id = data.get('patrol_leader_id')
    scout_ids = data.get('scout_ids', []) # list of user ids

    if not name:
        return jsonify({"message": "Patrol name is required"}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    
    try:
        cur = conn.cursor()
        
        # Get current patrol leader to demote if changed
        cur.execute("SELECT patrol_leader_id FROM patrols WHERE id = %s", (patrol_id,))
        old_pl_result = cur.fetchone()
        old_pl_id = old_pl_result[0] if old_pl_result else None

        # Update patrol record
        cur.execute(
            "UPDATE patrols SET name = %s, patrol_leader_id = %s WHERE id = %s",
            (name, patrol_leader_id, patrol_id)
        )

        # Handle Patrol Leader change
        if old_pl_id and str(old_pl_id) != str(patrol_leader_id):
            cur.execute("UPDATE users SET role = 'scout' WHERE id = %s AND role = 'patrol_leader'", (old_pl_id,))
        
        if patrol_leader_id:
            cur.execute("UPDATE users SET role = 'patrol_leader', patrol_id = %s WHERE id = %s", (patrol_id, patrol_leader_id))

        # Update members
        # First remove all current members from this patrol in users table
        cur.execute("UPDATE users SET patrol_id = NULL WHERE patrol_id = %s", (patrol_id,))
        
        # Set new members
        for s_id in scout_ids:
            cur.execute("UPDATE users SET patrol_id = %s WHERE id = %s", (patrol_id, s_id))

        # We are ignoring the patrol_members history table for now, or just inserting new ones.
        # It's better to manage current state in users.patrol_id to avoid complexity.

        conn.commit()
        return jsonify({"message": "Patrol updated successfully"}), 200

    except Exception as e:
        print(f"Error updating patrol: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()

def update_scout(scout_id):
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    scout_reg_no = data.get('scout_reg_no')
    dob = data.get('dob')
    email = data.get('email')
    patrol_id = data.get('patrol_id')
    recent_badge_id = data.get('recent_badge_id')

    if not first_name or not last_name or not email:
        return jsonify({"message": "First name, last name, and email are required"}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    
    try:
        cur = conn.cursor()
        
        # Check email uniqueness for other users
        cur.execute("SELECT id FROM users WHERE email = %s AND id != %s", (email, scout_id))
        if cur.fetchone():
            return jsonify({"message": "Email is already taken by another user."}), 400

        # Check reg no uniqueness
        if scout_reg_no:
            cur.execute("SELECT id FROM users WHERE scout_reg_no = %s AND id != %s", (scout_reg_no, scout_id))
            if cur.fetchone():
                return jsonify({"message": "Registration number is already taken."}), 400

        cur.execute("""
            UPDATE users 
            SET first_name = %s, last_name = %s, email = %s, dob = %s, scout_reg_no = %s, patrol_id = %s
            WHERE id = %s
        """, (first_name, last_name, email, dob if dob else None, scout_reg_no if scout_reg_no else None, patrol_id if patrol_id else None, scout_id))
        
        if patrol_id:
            cur.execute("SELECT 1 FROM patrol_members WHERE patrol_id = %s AND scout_id = %s", (patrol_id, scout_id))
            if not cur.fetchone():
                cur.execute("INSERT INTO patrol_members (patrol_id, scout_id) VALUES (%s, %s)", (patrol_id, scout_id))

        if recent_badge_id:
            cur.execute("INSERT INTO milestones (scout_id, badge_id) VALUES (%s, %s) ON CONFLICT (scout_id, badge_id) DO NOTHING", (scout_id, recent_badge_id))

        conn.commit()
        return jsonify({"message": "Scout updated successfully"}), 200
    except Exception as e:
        print(f"Error updating scout: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()

def remove_scout(scout_id):
    conn = get_db_connection()
    if not conn: return jsonify({"message": "DB Error"}), 500
    try:
        cur = conn.cursor()
        # Find their current troop
        cur.execute("SELECT troop_id FROM users WHERE id = %s", (scout_id,))
        res = cur.fetchone()
        
        # Unassign troop and patrol, but leave history alone.
        cur.execute("UPDATE users SET troop_id = NULL, patrol_id = NULL WHERE id = %s", (scout_id,))
        
        # Update troop_members history
        if res and res[0]:
            cur.execute("UPDATE troop_members SET status = 'left', left_date = NOW() WHERE user_id = %s AND troop_id = %s AND status = 'active'", (scout_id, res[0]))

        conn.commit()
        return jsonify({"message": "Scout removed from troop successfully"}), 200
    except Exception as e:
        print(f"Error removing scout: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()
