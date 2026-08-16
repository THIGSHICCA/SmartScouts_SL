from flask import Blueprint, jsonify, g
from psycopg2.extras import RealDictCursor
from utils.db import get_db_connection
from middleware.auth_middleware import token_required

proficiency_bp = Blueprint('proficiency_bp', __name__)


@proficiency_bp.route('', methods=['GET'])
@proficiency_bp.route('/', methods=['GET'])
@token_required
def list_proficiency_badges():
    """Return all proficiency badges from the database."""
    conn = get_db_connection()
    if not conn:
        return jsonify([]), 200
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT id, code, name, name_ta, name_si, group_name, scout_level
            FROM proficiency_badges
            ORDER BY scout_level, group_name, code
        """)
        return jsonify([dict(r) for r in cur.fetchall()]), 200
    finally:
        conn.close()
