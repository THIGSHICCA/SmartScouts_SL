from flask import Blueprint
from controllers.user_controller import get_profile, update_profile, get_scouts, get_scout_profile, patrol_leader_login
from middleware.auth_middleware import token_required

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/me', methods=['GET'], endpoint='get_profile')(token_required(get_profile))
user_bp.route('/me', methods=['PUT'], endpoint='update_profile')(token_required(update_profile))
# Alias so frontend can use either /me or /profile
user_bp.route('/profile', methods=['GET'], endpoint='get_profile_alias')(token_required(get_profile))
user_bp.route('/profile', methods=['PUT'], endpoint='update_profile_alias')(token_required(update_profile))
user_bp.route('/scouts', methods=['GET'], endpoint='get_scouts')(token_required(get_scouts))
user_bp.route('/scouts/<int:scout_id>', methods=['GET'], endpoint='get_scout_profile')(token_required(get_scout_profile))
user_bp.route('/patrol-leader-login', methods=['POST'], endpoint='patrol_leader_login')(token_required(patrol_leader_login))
