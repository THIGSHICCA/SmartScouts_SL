from flask import Blueprint
from controllers.ai_controller import (
    ask_ai, upload_syllabus, list_documents, view_document,
    delete_document, update_document, list_categories, create_category, delete_category
)
from middleware.auth_middleware import token_required

ai_bp = Blueprint('ai_bp', __name__)

ai_bp.route('/ask', methods=['POST'])(token_required(ask_ai))
ai_bp.route('/syllabus/upload', methods=['POST'])(token_required(upload_syllabus))
ai_bp.route('/documents', methods=['GET'])(token_required(list_documents))
ai_bp.route('/documents/<int:doc_id>/view', methods=['GET'])(token_required(view_document))
ai_bp.route('/documents/<int:doc_id>', methods=['DELETE'])(token_required(delete_document))
ai_bp.route('/documents/<int:doc_id>', methods=['PUT'])(token_required(update_document))
ai_bp.route('/categories', methods=['GET'])(token_required(list_categories))
ai_bp.route('/categories', methods=['POST'])(token_required(create_category))
ai_bp.route('/categories/<int:cat_id>', methods=['DELETE'])(token_required(delete_category))
