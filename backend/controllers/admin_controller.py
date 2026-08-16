from flask import request, jsonify
from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor
import uuid

def get_dashboard_stats():
    from flask import g
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Count all troops
        cur.execute("SELECT COUNT(*) AS c FROM troops")
        troop_count = cur.fetchone()['c'] or 0

        # Count all scouts (active troop members with scout/patrol_leader role)
        cur.execute("""
            SELECT COUNT(DISTINCT u.id) AS c
            FROM users u
            WHERE u.role IN ('scout', 'patrol_leader')
        """)
        scout_count = cur.fetchone()['c'] or 0

        # Count all leaders: registered leaders + all pre-registered (whether or not they signed up)
        cur.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'leader'")
        registered_leaders = cur.fetchone()['c'] or 0

        cur.execute("SELECT COUNT(*) AS c FROM pre_registered_leaders WHERE registered = FALSE")
        pending_leaders = cur.fetchone()['c'] or 0

        leader_count = registered_leaders + pending_leaders

        # Get commissioner's district name for title
        cur.execute("SELECT scout_district FROM users WHERE id = %s", (g.user_id,))
        user = cur.fetchone()
        district = user.get('scout_district') if user else None

        return jsonify({
            "district": district or 'Unassigned',
            "troops": troop_count,
            "scouts": scout_count,
            "leaders": leader_count
        }), 200
    except Exception as e:
        print(f"Error fetching stats: {e}")
        import traceback; traceback.print_exc()
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()


def get_registered_scouts():
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT u.id, u.first_name, u.last_name, u.email, u.scout_reg_no, u.scout_district, u.created_at, u.troop_id, t.name as troop_name, t.troop_id as troop_code
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
            WHERE u.role IN ('scout', 'patrol_leader')
            ORDER BY u.created_at DESC
        """
        cur.execute(query)
        scouts = cur.fetchall()
        return jsonify(scouts), 200
    except Exception as e:
        print(f"Error fetching registered scouts: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()


def get_scout_profile_admin(scout_id):
    """Admin: fetch full profile of any scout by ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT u.id, u.first_name, u.last_name, u.email, u.scout_reg_no,
                   u.scout_district, u.dob, u.role, u.troop_id,
                   t.name AS troop_name, t.troop_id AS troop_code,
                   p.name AS patrol_name,
                   b.name AS recent_badge
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
            LEFT JOIN patrols p ON u.patrol_id = p.id
            LEFT JOIN badges b ON u.recent_badge_id = b.id
            WHERE u.id = %s AND u.role IN ('scout', 'patrol_leader')
        """, (scout_id,))
        scout = cur.fetchone()
        if not scout:
            return jsonify({"message": "Scout not found"}), 404
        return jsonify(scout), 200
    except Exception as e:
        print(f"Error fetching scout profile: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()

def create_troop():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    address = (data.get('address') or '').strip()
    phone_number = (data.get('phone_number') or '').strip()
    email = (data.get('email') or '').strip()
    scout_leaders = data.get('scout_leaders', []) # list of dicts: name, scout_reg_no, email

    if not name:
        return jsonify({"message": "Troop name is required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor()
        
        # Insert Troop
        # Generate a troop ID, e.g., TRP-xyz
        troop_id_str = f"TRP-{uuid.uuid4().hex[:6].upper()}"
        cur.execute(
            "INSERT INTO troops (troop_id, name, address, phone_number, email) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (troop_id_str, name, address if address else None, phone_number if phone_number else None, email if email else None)
        )
        troop_db_id = cur.fetchone()[0]

        generated_leaders = []
        # Pre-register Scout Leaders
        for i, leader in enumerate(scout_leaders):
            l_first = (leader.get('first_name') or '').strip()
            l_last = (leader.get('last_name') or '').strip()
            l_name = (leader.get('name') or '').strip()
            l_reg_no = (leader.get('scout_reg_no') or '').strip()
            l_email = (leader.get('email') or '').strip()

            # Skip completely empty leader entries
            if not l_name and not l_first and not l_last and not l_reg_no and not l_email:
                continue

            if not l_name and (l_first or l_last):
                l_name = f"{l_first} {l_last}".strip()
            if not l_name:
                l_name = l_email.split('@')[0] if l_email else f"Leader {i+1}"
            
            gen_leader_id = f"{troop_id_str}/L-{i+1}"
            
            cur.execute(
                "INSERT INTO pre_registered_leaders (troop_id, leader_registration_id, name, first_name, last_name, scout_registration_no, email) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (troop_db_id, gen_leader_id, l_name, l_first if l_first else None, l_last if l_last else None, l_reg_no if l_reg_no else None, l_email if l_email else None)
            )
            generated_leaders.append({
                "name": l_name,
                "first_name": l_first,
                "last_name": l_last,
                "generated_leader_id": gen_leader_id
            })

        conn.commit()
        cur.close()

        return jsonify({
            "message": "Troop created successfully",
            "troop_id": troop_id_str,
            "scout_leaders": generated_leaders
        }), 201

    except Exception as e:
        print(f"Error creating troop: {e}")
        if conn:
            conn.rollback()
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

def get_troops():
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT t.*, 
                   COALESCE(json_agg(json_build_object(
                       'name', prl.name,
                       'first_name', prl.first_name,
                       'last_name', prl.last_name,
                       'leader_registration_id', prl.leader_registration_id,
                       'email', prl.email,
                       'scout_reg_no', prl.scout_registration_no,
                       'registered', prl.registered
                   )) FILTER (WHERE prl.id IS NOT NULL), '[]') as leaders
            FROM troops t
            LEFT JOIN pre_registered_leaders prl ON t.id = prl.troop_id
            GROUP BY t.id
            ORDER BY t.created_at DESC
        """)
        troops = cur.fetchall()
        cur.close()
        return jsonify(troops), 200
    except Exception as e:
        print(f"Error fetching troops: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()

def update_troop(troop_id):
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    address = (data.get('address') or '').strip()
    phone_number = (data.get('phone_number') or '').strip()
    email = (data.get('email') or '').strip()
    scout_leaders = data.get('scout_leaders', None)  # list of dicts or None

    if not name:
        return jsonify({"message": "Troop name is required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Update troop details
        cur.execute(
            "UPDATE troops SET name=%s, address=%s, phone_number=%s, email=%s WHERE id=%s RETURNING troop_id",
            (name, address if address else None, phone_number if phone_number else None, email if email else None, troop_id)
        )
        row = cur.fetchone()
        if not row:
            return jsonify({"message": "Troop not found"}), 404

        troop_id_str = row['troop_id']

        # If scout_leaders list provided, replace all leaders for this troop
        if scout_leaders is not None:
            # Delete existing pre-registered leaders (not yet registered as real users)
            cur.execute(
                "DELETE FROM pre_registered_leaders WHERE troop_id=%s AND registered=FALSE",
                (troop_id,)
            )
            for i, leader in enumerate(scout_leaders):
                l_first = (leader.get('first_name') or '').strip()
                l_last = (leader.get('last_name') or '').strip()
                l_name = (leader.get('name') or '').strip()
                l_reg_no = (leader.get('scout_reg_no') or '').strip()
                l_email = (leader.get('email') or '').strip()

                if not l_name and not l_first and not l_last and not l_reg_no and not l_email:
                    continue

                if not l_name and (l_first or l_last):
                    l_name = f"{l_first} {l_last}".strip()
                if not l_name:
                    l_name = l_email.split('@')[0] if l_email else f"Leader {i+1}"

                # Keep existing leader_registration_id if provided, else generate new
                existing_lid = leader.get('leader_registration_id')
                gen_leader_id = existing_lid if existing_lid else f"{troop_id_str}/L-{uuid.uuid4().hex[:4].upper()}"

                cur.execute(
                    """INSERT INTO pre_registered_leaders (troop_id, leader_registration_id, name, first_name, last_name, scout_registration_no, email)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)
                       ON CONFLICT (leader_registration_id) DO UPDATE
                       SET name=EXCLUDED.name, first_name=EXCLUDED.first_name, last_name=EXCLUDED.last_name, email=EXCLUDED.email, scout_registration_no=EXCLUDED.scout_registration_no""",
                    (troop_id, gen_leader_id, l_name, l_first if l_first else None, l_last if l_last else None, l_reg_no if l_reg_no else None, l_email if l_email else None)
                )

        conn.commit()
        cur.close()
        return jsonify({"message": "Troop updated successfully"}), 200

    except Exception as e:
        print(f"Error updating troop: {e}")
        if conn:
            conn.rollback()
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

def delete_troop(troop_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM troops WHERE id=%s RETURNING id", (troop_id,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return jsonify({"message": "Troop not found"}), 404
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Troop deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting troop: {e}")
        if conn:
            conn.rollback()
            conn.close()
        return jsonify({"message": "Internal server error"}), 500
