from flask import Blueprint
from controllers.evidence_controller import upload_evidence, get_evidence
from middleware.auth_middleware import token_required

evidence_bp = Blueprint('evidence_bp', __name__)

evidence_bp.route('/upload', methods=['POST'])(token_required(upload_evidence))
evidence_bp.route('/<int:progress_id>', methods=['GET'])(token_required(get_evidence))
