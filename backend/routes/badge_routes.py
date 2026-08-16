from flask import Blueprint
from controllers.badge_controller import list_badges, get_badge
from middleware.auth_middleware import token_required

badge_bp = Blueprint('badge_bp', __name__)

badge_bp.route('/', methods=['GET'])(token_required(list_badges))
badge_bp.route('/<int:badge_id>', methods=['GET'])(token_required(get_badge))
