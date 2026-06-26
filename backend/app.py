from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.auth_routes import auth_bp
from utils.db import get_db_connection

# Load environment variables.
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/api/db-test', methods=['GET'])
def db_test():
    conn = get_db_connection()
    if not conn:
        return jsonify({"status": "error", "message": "Could not connect to database"}), 500
    
    try:
        cur = conn.cursor()
        cur.execute('SELECT 1;')
        result = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({"status": "ok", "db_connection": True, "result": result[0]})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
