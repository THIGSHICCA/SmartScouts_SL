from flask import Blueprint
from controllers.patrol_controller import (
    get_my_patrol,
    update_my_patrol,
    add_member_to_patrol,
    remove_member_from_patrol
)
from middleware.auth_middleware import token_required

patrol_bp = Blueprint('patrol_bp', __name__)

patrol_bp.route('/me', methods=['GET'], endpoint='get_my_patrol')(token_required(get_my_patrol))
patrol_bp.route('/me', methods=['PUT'], endpoint='update_my_patrol')(token_required(update_my_patrol))
patrol_bp.route('/me/members', methods=['POST'], endpoint='add_member_to_patrol')(token_required(add_member_to_patrol))
patrol_bp.route('/me/members/<int:scout_id>', methods=['DELETE'], endpoint='remove_member_from_patrol')(token_required(remove_member_from_patrol))
