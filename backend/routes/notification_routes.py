from flask import Blueprint
from controllers.notification_controller import list_notifications, read_notification
from middleware.auth_middleware import token_required

notification_bp = Blueprint('notification_bp', __name__)

notification_bp.route('/', methods=['GET'])(token_required(list_notifications))
notification_bp.route('/<int:notif_id>/read', methods=['POST'])(token_required(read_notification))
