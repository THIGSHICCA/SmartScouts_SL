from flask import jsonify, g, request
from models.user_model import get_user_by_id, get_scouts_by_troop, update_user

def get_profile():
    user = get_user_by_id(g.user_id)
    if not user: return jsonify({"message": "User not found"}), 404
    return jsonify(user), 200

def update_profile():
    data = request.get_json()
    success = update_user(g.user_id, data)
    if success:
        return jsonify({"message": "Profile updated successfully"}), 200
    return jsonify({"message": "Failed to update profile"}), 400

def get_scouts():
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in ('leader', 'patrol_leader'):
        return jsonify({"message": "Unauthorized"}), 403
        
    scouts = get_scouts_by_troop(user['troop_id'])
    return jsonify(scouts), 200

def patrol_leader_login():
    """Verify patrol name and patrol ID, and upgrade scout session to patrol_leader."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in ('scout', 'patrol_leader'):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    patrol_name = data.get('patrol_name')
    patrol_id_str = data.get('patrol_id')

    if not patrol_name or not patrol_id_str:
        return jsonify({"message": "Patrol Name and Patrol ID are required"}), 400

    from utils.db import get_db_connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor()
        # Verify the patrol exists with matching name and ID, and the user is the leader of it
        cur.execute(
            "SELECT id FROM patrols WHERE patrol_id = %s AND name = %s AND patrol_leader_id = %s",
            (patrol_id_str, patrol_name, g.user_id)
        )
        patrol = cur.fetchone()

        if not patrol:
            # If not the leader, check if the patrol exists at all to give better error messages
            cur.execute("SELECT id FROM patrols WHERE patrol_id = %s AND name = %s", (patrol_id_str, patrol_name))
            if not cur.fetchone():
                return jsonify({"message": "Invalid Patrol Name or Patrol ID."}), 401
            return jsonify({"message": "You are not registered as the Patrol Leader for this patrol."}), 403

        # Upgrade role to patrol_leader in DB if not already
        if user['role'] != 'patrol_leader':
            cur.execute("UPDATE users SET role = 'patrol_leader' WHERE id = %s", (g.user_id,))
            conn.commit()

        from utils.auth import generate_token
        # Generate new token with patrol_leader role
        new_token = generate_token(g.user_id, 'patrol_leader')
        
        # update user object role for response
        user['role'] = 'patrol_leader'

        return jsonify({
            "message": "Patrol Leader access granted",
            "token": new_token,
            "user": user
        }), 200

    except Exception as e:
        print(f"Patrol Leader Login Error: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        conn.close()

def get_scout_profile(scout_id):
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in ('leader', 'patrol_leader'):
        return jsonify({"message": "Unauthorized"}), 403
        
    scout = get_user_by_id(scout_id)
    if not scout or scout['troop_id'] != user['troop_id']:
        return jsonify({"message": "Scout not found in your troop"}), 404
        
    return jsonify(scout), 200
