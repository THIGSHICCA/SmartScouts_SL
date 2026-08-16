from flask import Blueprint
from controllers.auth_controller import (
    register,
    login,
    forgot_password,
    verify_reset_token,
    reset_password
)

auth_bp = Blueprint('auth_bp', __name__)

auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/forgot-password', methods=['POST'])(forgot_password)
auth_bp.route('/verify-reset-token', methods=['POST'])(verify_reset_token)
auth_bp.route('/reset-password', methods=['POST'])(reset_password)

