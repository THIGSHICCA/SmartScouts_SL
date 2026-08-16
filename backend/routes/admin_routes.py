from flask import Blueprint
from controllers.admin_controller import create_troop, get_troops, update_troop, delete_troop, get_registered_scouts, get_dashboard_stats, get_scout_profile_admin
from middleware.auth_middleware import require_auth, require_role

admin_bp = Blueprint('admin', __name__)

admin_bp.route('/dashboard-stats', methods=['GET'], endpoint='get_dashboard_stats')(require_auth(require_role('commissioner')(get_dashboard_stats)))
admin_bp.route('/troops', methods=['POST'], endpoint='create_troop')(require_auth(require_role('commissioner')(create_troop)))
admin_bp.route('/troops', methods=['GET'], endpoint='get_troops')(require_auth(require_role('commissioner')(get_troops)))
admin_bp.route('/troops/<int:troop_id>', methods=['PUT'], endpoint='update_troop')(require_auth(require_role('commissioner')(update_troop)))
admin_bp.route('/troops/<int:troop_id>', methods=['DELETE'], endpoint='delete_troop')(require_auth(require_role('commissioner')(delete_troop)))
admin_bp.route('/scouts', methods=['GET'], endpoint='get_registered_scouts')(require_auth(require_role('commissioner')(get_registered_scouts)))
admin_bp.route('/scouts/<int:scout_id>', methods=['GET'], endpoint='get_scout_profile_admin')(require_auth(require_role('commissioner')(get_scout_profile_admin)))
