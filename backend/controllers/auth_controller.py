from flask import request, jsonify
from utils.db import get_db_connection
from utils.auth import hash_password, check_password, generate_token
from psycopg2.extras import RealDictCursor

def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'scout') # default to scout

    if not name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor()
        
        # Check if user already exists
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"message": "User already exists"}), 409

        # Hash password and insert
        hashed_pw = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, email, hashed_pw, role)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        token = generate_token(user_id, role)
        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {"id": user_id, "name": name, "email": email, "role": role}
        }), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"message": "Internal server error"}), 500

def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, name, email, password_hash, role FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        cur.close()
        conn.close()

        if user and check_password(password, user['password_hash']):
            token = generate_token(user['id'], user['role'])
            return jsonify({
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "role": user['role']
                }
            }), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"message": "Internal server error"}), 500
