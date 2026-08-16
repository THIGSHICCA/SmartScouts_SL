from flask import request, jsonify
from utils.db import get_db_connection
from utils.auth import hash_password, check_password, generate_token
from psycopg2.extras import RealDictCursor
import secrets
from datetime import datetime, timedelta


def register():
    data = request.get_json() or {}
    first_name = (data.get('first_name') or '').strip()
    last_name = (data.get('last_name') or '').strip()
    email = (data.get('email') or '').strip()
    password = (data.get('password') or '').strip()
    role = data.get('role', 'scout') # default to scout
    dob = data.get('dob') or None
    scout_reg_no = data.get('scout_reg_no') or None
    scout_district = data.get('scout_district') or None
    scout_district_reg_no = data.get('scout_district_reg_no') or None
    commissioner_reg_no = data.get('commissioner_reg_no') or None
    leader_id_ref = data.get('leader_id_ref') or None

    if not first_name or not last_name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor()
        
        # Validate roles
        troop_id = None
        if role == 'commissioner':
            if not commissioner_reg_no:
                return jsonify({"message": "Commissioner registration number is required"}), 400
        elif role == 'leader':
            if not leader_id_ref:
                return jsonify({"message": "Scout Leader ID is required for leader registration"}), 400
            
            # Verify the leader ID exists in pre_registered_leaders and matches
            cur.execute("SELECT id, troop_id, registered FROM pre_registered_leaders WHERE leader_registration_id = %s", (leader_id_ref,))
            pre_reg = cur.fetchone()
            if not pre_reg:
                return jsonify({"message": "Invalid Scout Leader ID. You must be added by a Commissioner first."}), 400
            if pre_reg[2]: # registered == True
                return jsonify({"message": "This Scout Leader ID has already been used for registration."}), 400
            
            # Automatically assign to troop based on pre-registration
            troop_id = pre_reg[1]

        # Check if user already exists
        cur.execute("SELECT id, role, password_hash, troop_id FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
        existing_user = cur.fetchone()
        
        if existing_user:
            existing_role = existing_user[1]
            existing_hash = existing_user[2]
            user_id = existing_user[0]
            
            # If it's a scout and they have the default pre-registered password 'scout123', let them claim it
            if role in ['scout', 'patrol_leader'] and existing_role in ['scout', 'patrol_leader'] and check_password('scout123', existing_hash):
                hashed_pw = hash_password(password)
                update_query = """
                    UPDATE users SET
                        first_name = COALESCE(%s, first_name),
                        last_name = COALESCE(%s, last_name),
                        password_hash = %s,
                        dob = COALESCE(%s, dob),
                        scout_reg_no = COALESCE(%s, scout_reg_no),
                        scout_district = COALESCE(%s, scout_district)
                    WHERE id = %s
                """
                cur.execute(update_query, (
                    first_name, last_name, hashed_pw, dob, scout_reg_no, scout_district, user_id
                ))
                conn.commit()
                cur.close()
                
                token = generate_token(user_id, existing_role)
                return jsonify({
                    "message": "Account claimed successfully",
                    "token": token,
                    "user": {"id": user_id, "first_name": first_name, "last_name": last_name, "email": email, "role": existing_role}
                }), 201
            else:
                return jsonify({"message": "An account with this email address already exists. Please sign in instead."}), 409

        # Hash password and insert
        hashed_pw = hash_password(password)
        
        insert_query = """
            INSERT INTO users (
                first_name, last_name, email, password_hash, role, dob, 
                scout_reg_no, scout_district, scout_district_reg_no, 
                commissioner_reg_no, leader_registration_id, is_email_verified, troop_id, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        """
        cur.execute(insert_query, (
            first_name, last_name, email, hashed_pw, role, dob,
            scout_reg_no, scout_district, scout_district_reg_no,
            commissioner_reg_no, leader_id_ref, True, troop_id, 'active'  # Auto-verify email for simulated flow
        ))
        user_id = cur.fetchone()[0]

        # Insert into troop_members if assigned
        if troop_id:
            cur.execute(
                "INSERT INTO troop_members (troop_id, user_id, status) VALUES (%s, %s, %s)",
                (troop_id, user_id, 'active')
            )

        # Update pre_registered_leaders if Leader
        if role == 'leader' and leader_id_ref:
            cur.execute(
                "UPDATE pre_registered_leaders SET registered = TRUE, registered_user_id = %s WHERE leader_registration_id = %s",
                (user_id, leader_id_ref)
            )

        conn.commit()
        cur.close()
        
        token = generate_token(user_id, role)
        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {"id": user_id, "first_name": first_name, "last_name": last_name, "email": email, "role": role}
        }), 201

    except Exception as e:
        print(f"Registration error: {e}")
        if conn:
            conn.rollback()
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()
    scout_reg_no = (data.get('scout_reg_no') or '').strip()

    if not email or not password:
        print(f"[LOGIN FAIL] Missing email or password. Email provided: '{email}'")
        return jsonify({"message": "Email and password required"}), 400

    conn = get_db_connection()
    if not conn:
        print("[LOGIN FAIL] Database connection failed")
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT id, first_name, last_name, email, password_hash, role, is_email_verified, 
                   scout_reg_no, scout_district_reg_no, commissioner_reg_no, leader_registration_id 
            FROM users 
            WHERE LOWER(email) = %s
        """, (email,))
        user = cur.fetchone()
        
        cur.close()
        conn.close()

        if not user:
            print(f"[LOGIN FAIL] User not found with email: '{email}'")
            return jsonify({"message": "Invalid email or password"}), 401

        if not check_password(password, user['password_hash']):
            print(f"[LOGIN FAIL] Password incorrect for email: '{email}'")
            return jsonify({"message": "Invalid email or password"}), 401

        # If the user provided a reg no, verify it matches any of their role reg numbers if configured
        if scout_reg_no:
            user_reg_nos = [
                (user.get('scout_reg_no') or '').strip().lower(),
                (user.get('scout_district_reg_no') or '').strip().lower(),
                (user.get('commissioner_reg_no') or '').strip().lower(),
                (user.get('leader_registration_id') or '').strip().lower()
            ]
            valid_reg_nos = [r for r in user_reg_nos if r]
            if valid_reg_nos and scout_reg_no.lower() not in valid_reg_nos:
                print(f"[LOGIN FAIL] Reg No mismatch for '{email}'. Provided: '{scout_reg_no}', Valid: {valid_reg_nos}")
                return jsonify({"message": "Registration Number does not match our records."}), 401

        token = generate_token(user['id'], user['role'])
        print(f"[LOGIN SUCCESS] User '{email}' ({user['role']}) logged in successfully.")
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user['id'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "email": user['email'],
                "role": user['role'],
                "is_email_verified": user['is_email_verified']
            }
        }), 200

    except Exception as e:
        print(f"[LOGIN ERROR] Exception during login: {e}")
        return jsonify({"message": "Internal server error"}), 500

def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip()

    if not email:
        return jsonify({"message": "Email address is required."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Find user by email (case-insensitive)
        cur.execute("SELECT id, first_name, last_name, email FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
        user = cur.fetchone()

        if not user:
            print(f"[FORGOT PASSWORD FAIL] No user found with email: '{email}'")
            cur.close()
            conn.close()
            return jsonify({"message": "No account found with this email address."}), 404

        user_id = user['id']

        # Invalidate existing unused tokens for this user
        cur.execute("UPDATE password_resets SET used = TRUE WHERE user_id = %s AND used = FALSE", (user_id,))

        # Generate a secure 32-character random hex token
        token = secrets.token_hex(16)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        # Insert reset token into password_resets
        cur.execute(
            """
            INSERT INTO password_resets (user_id, token, expires_at, used)
            VALUES (%s, %s, %s, FALSE)
            """,
            (user_id, token, expires_at)
        )
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "message": "Password reset token generated successfully.",
            "reset_token": token,
            "email": user['email'],
            "expires_in_minutes": 60
        }), 200

    except Exception as e:
        print(f"Forgot password error: {e}")
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

def verify_reset_token():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    token = data.get('token', '').strip()

    if not email or not token:
        return jsonify({"message": "Email and reset token are required."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT pr.id, pr.expires_at, pr.used
            FROM password_resets pr
            JOIN users u ON u.id = pr.user_id
            WHERE LOWER(u.email) = LOWER(%s) AND pr.token = %s
            ORDER BY pr.created_at DESC
            LIMIT 1
            """,
            (email, token)
        )
        reset_entry = cur.fetchone()

        cur.close()
        conn.close()

        if not reset_entry:
            return jsonify({"valid": False, "message": "Invalid password reset token."}), 400

        if reset_entry['used']:
            return jsonify({"valid": False, "message": "This password reset token has already been used."}), 400

        if reset_entry['expires_at'] < datetime.utcnow():
            return jsonify({"valid": False, "message": "Password reset token has expired. Please request a new one."}), 400

        return jsonify({"valid": True, "message": "Token is valid."}), 200

    except Exception as e:
        print(f"Verify reset token error: {e}")
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

def reset_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    token = data.get('token', '').strip()
    new_password = data.get('new_password', '').strip()

    if not email or not token or not new_password:
        return jsonify({"message": "Email, reset token, and new password are required."}), 400

    if len(new_password) < 6:
        return jsonify({"message": "New password must be at least 6 characters long."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT pr.id, pr.user_id, pr.expires_at, pr.used
            FROM password_resets pr
            JOIN users u ON u.id = pr.user_id
            WHERE LOWER(u.email) = LOWER(%s) AND pr.token = %s
            ORDER BY pr.created_at DESC
            LIMIT 1
            """,
            (email, token)
        )
        reset_entry = cur.fetchone()

        if not reset_entry:
            cur.close()
            conn.close()
            return jsonify({"message": "Invalid password reset token."}), 400

        if reset_entry['used']:
            cur.close()
            conn.close()
            return jsonify({"message": "This password reset token has already been used."}), 400

        if reset_entry['expires_at'] < datetime.utcnow():
            cur.close()
            conn.close()
            return jsonify({"message": "Password reset token has expired. Please request a new one."}), 400

        user_id = reset_entry['user_id']
        reset_id = reset_entry['id']

        # Update user password
        new_password_hash = hash_password(new_password)
        cur.execute(
            "UPDATE users SET password_hash = %s, updated_at = NOW() WHERE id = %s",
            (new_password_hash, user_id)
        )

        # Mark token as used
        cur.execute(
            "UPDATE password_resets SET used = TRUE WHERE id = %s",
            (reset_id,)
        )

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Password has been reset successfully. You can now log in with your new password."
        }), 200

    except Exception as e:
        print(f"Reset password error: {e}")
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

