# SmartScouts SL Backend Application
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.badge_routes import badge_bp
from routes.progress_routes import progress_bp
from routes.evidence_routes import evidence_bp
from routes.notification_routes import notification_bp
from routes.ai_routes import ai_bp
from routes.proficiency_routes import proficiency_bp
from routes.admin_routes import admin_bp
from routes.leader_routes import leader_bp
from routes.patrol_routes import patrol_bp
from utils.db import get_db_connection

# Load environment variables.
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(badge_bp, url_prefix='/api/badges')
app.register_blueprint(progress_bp, url_prefix='/api/progress')
app.register_blueprint(evidence_bp, url_prefix='/api/evidence')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(proficiency_bp, url_prefix='/api/proficiency-badges')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(leader_bp, url_prefix='/api/leader')
app.register_blueprint(patrol_bp, url_prefix='/api/patrols')

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
    # threaded=True: each request runs in its own thread so slow AI calls
    # don't block login, dashboard, or any other endpoint.
    # reloader_type='stat' avoids WinError 10038 on Windows.
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=True, reloader_type='stat', threaded=True)
