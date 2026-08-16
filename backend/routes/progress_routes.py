from flask import Blueprint
from controllers.progress_controller import (
    get_my_progress,
    get_scout_record_book,
    submit_task,
    list_pending_pl_tasks,
    pl_approve,
    pl_reject,
    list_pending_leader_tasks,
    leader_verify,
    leader_reject,
    submit_badge,
    list_pending_badges,
    review_badge,
    generate_badge_plan,
)
from middleware.auth_middleware import token_required

progress_bp = Blueprint('progress_bp', __name__)

# ── Scout ────────────────────────────────────────────────────
progress_bp.route('/me',          methods=['GET'])(token_required(get_my_progress))
progress_bp.route('/record-book', methods=['GET'])(token_required(get_scout_record_book))
progress_bp.route('/submit-task', methods=['POST'])(token_required(submit_task))

# ── Patrol Leader gate ───────────────────────────────────────
progress_bp.route('/pending-pl',               methods=['GET'])(token_required(list_pending_pl_tasks))
progress_bp.route('/pl-approve/<int:task_id>', methods=['POST'])(token_required(pl_approve))
progress_bp.route('/pl-reject/<int:task_id>',  methods=['POST'])(token_required(pl_reject))

# ── Scout Leader gate ────────────────────────────────────────
progress_bp.route('/pending-leader',                methods=['GET'])(token_required(list_pending_leader_tasks))
progress_bp.route('/leader-verify/<int:task_id>',   methods=['POST'])(token_required(leader_verify))
progress_bp.route('/leader-reject/<int:task_id>',   methods=['POST'])(token_required(leader_reject))

# ── Badge-level applications ─────────────────────────────────
progress_bp.route('/badges/submit',                              methods=['POST'])(token_required(submit_badge))
progress_bp.route('/badges/pending',                             methods=['GET'])(token_required(list_pending_badges))
progress_bp.route('/badges/applications/<int:application_id>/review', methods=['POST'])(token_required(review_badge))
progress_bp.route('/badges/plan',                                methods=['POST'])(token_required(generate_badge_plan))
