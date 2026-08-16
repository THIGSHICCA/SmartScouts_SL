from flask import Blueprint
from controllers.leader_controller import create_patrol, get_scouts, add_scout_to_troop, search_unassigned_scouts, get_troops_list, get_troop_scouts, get_troop_patrols, get_patrol_details, edit_patrol, update_scout, remove_scout
from middleware.auth_middleware import require_auth, require_role

leader_bp = Blueprint('leader', __name__)

LEADER_ROLES = ['leader', 'commissioner', 'scout_leader']

leader_bp.route('/troops', methods=['GET'])(require_auth(require_role(LEADER_ROLES)(get_troops_list)))
leader_bp.route('/patrols', methods=['POST'])(require_auth(require_role(LEADER_ROLES)(create_patrol)))
leader_bp.route('/scouts', methods=['GET'])(require_auth(require_role(LEADER_ROLES)(get_scouts)))
leader_bp.route('/scouts/add', methods=['POST'])(require_auth(require_role(LEADER_ROLES)(add_scout_to_troop)))
leader_bp.route('/scouts/search', methods=['GET'])(require_auth(require_role(LEADER_ROLES)(search_unassigned_scouts)))
leader_bp.route('/troop/scouts', methods=['GET'])(require_auth(require_role(LEADER_ROLES)(get_troop_scouts)))
leader_bp.route('/troop/patrols', methods=['GET'])(require_auth(require_role(LEADER_ROLES)(get_troop_patrols)))
leader_bp.route('/patrols/<int:patrol_id>', methods=['GET'])(require_auth(require_role(LEADER_ROLES)(get_patrol_details)))
leader_bp.route('/patrols/<int:patrol_id>', methods=['PUT'])(require_auth(require_role(LEADER_ROLES)(edit_patrol)))
leader_bp.route('/scouts/<int:scout_id>', methods=['PUT'])(require_auth(require_role(LEADER_ROLES)(update_scout)))
leader_bp.route('/scouts/<int:scout_id>', methods=['DELETE'])(require_auth(require_role(LEADER_ROLES)(remove_scout)))
