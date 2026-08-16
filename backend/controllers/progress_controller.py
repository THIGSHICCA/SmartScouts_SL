from flask import jsonify, request, g
from models.progress_model import (
    upsert_progress, get_pending_pl_tasks, get_pending_leader_tasks,
    pl_approve_task, leader_verify_task, reject_progress_task,
    get_scout_progress_full
)
from models.user_model import get_user_by_id

# ─────────────────────────────────────────────
# SCOUT — view own progress
# ─────────────────────────────────────────────

def get_my_progress():
    """Return the logged-in scout's full progress across all badges."""
    from models.badge_model import get_user_progress
    progress = get_user_progress(g.user_id)
    return jsonify(progress), 200


def get_scout_record_book():
    """Return a structured record book for the logged-in scout or a requested scout if user is a leader/commissioner."""
    scout_id_arg = request.args.get('scout_id')
    user = get_user_by_id(g.user_id)
    
    if scout_id_arg:
        try:
            target_scout_id = int(scout_id_arg)
        except ValueError:
            return jsonify({"message": "Invalid scout_id"}), 400
            
        # Permission check
        if g.user_role not in ('leader', 'commissioner', 'scout_leader'):
            # Scouts can only view their own
            if target_scout_id != g.user_id:
                return jsonify({"message": "Unauthorized"}), 403
                
        # Leader check: if leader, must be in the same troop (unless commissioner/admin)
        if g.user_role in ('leader', 'scout_leader'):
            target_scout = get_user_by_id(target_scout_id)
            if not target_scout or target_scout['troop_id'] != user['troop_id']:
                return jsonify({"message": "Scout not found in your troop"}), 404
                
        data = get_scout_progress_full(target_scout_id)
    else:
        data = get_scout_progress_full(g.user_id)
        
    return jsonify(data), 200


# ─────────────────────────────────────────────
# SCOUT — submit a task (with evidence)
# ─────────────────────────────────────────────

def submit_task():
    """
    Scout submits a completed requirement for Patrol Leader review.
    Evidence URL is required.
    """
    if g.user_role not in ('scout', 'patrol_leader'):
        return jsonify({"message": "Only scouts can submit tasks"}), 403

    data = request.get_json()
    req_id = data.get('requirement_id')
    evidence_url = data.get('evidence_url', '').strip()

    if not req_id:
        return jsonify({"message": "Requirement ID is required"}), 400

    progress_id = upsert_progress(g.user_id, req_id, 'pending_pl', evidence_url=evidence_url if evidence_url else None)
    if progress_id:
        return jsonify({"message": "Task submitted to Patrol Leader", "progress_id": progress_id}), 200
    return jsonify({"message": "Failed to submit task"}), 500


# ─────────────────────────────────────────────
# PATROL LEADER — signature gate 1
# ─────────────────────────────────────────────

def list_pending_pl_tasks():
    """Return tasks awaiting Patrol Leader signature (status = pending_pl)."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] != 'patrol_leader':
        return jsonify({"message": "Patrol Leaders only"}), 403
    tasks = get_pending_pl_tasks(user['troop_id'])
    return jsonify(tasks), 200


def pl_approve(task_id):
    """Patrol Leader approves (signs) a task — moves to pending_leader."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] != 'patrol_leader':
        return jsonify({"message": "Patrol Leaders only"}), 403

    data = request.get_json() or {}
    notes = data.get('notes', '')
    success = pl_approve_task(task_id, g.user_id, notes)
    if success:
        return jsonify({"message": "Task signed by Patrol Leader — awaiting Scout Leader verification"}), 200
    return jsonify({"message": "Failed to approve task"}), 500


def pl_reject(task_id):
    """Patrol Leader rejects a task — moves back to rejected."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] != 'patrol_leader':
        return jsonify({"message": "Patrol Leaders only"}), 403

    data = request.get_json() or {}
    notes = data.get('notes', '')
    success = reject_progress_task(task_id, notes)
    if success:
        return jsonify({"message": "Task rejected by Patrol Leader"}), 200
    return jsonify({"message": "Failed to reject task"}), 500


# ─────────────────────────────────────────────
# SCOUT LEADER — signature gate 2
# ─────────────────────────────────────────────

LEADER_ROLES = {'leader', 'commissioner', 'scout_leader'}

def list_pending_leader_tasks():
    """Return tasks awaiting Scout Leader signature (status = pl_approved)."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in LEADER_ROLES:
        return jsonify({"message": "Scout Leaders only"}), 403
    tasks = get_pending_leader_tasks(user['troop_id'])
    return jsonify(tasks), 200


def leader_verify(task_id):
    """Scout Leader verifies (signs) a task — fully verified."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in LEADER_ROLES:
        return jsonify({"message": "Scout Leaders only"}), 403

    data = request.get_json() or {}
    notes = data.get('notes', '')
    success = leader_verify_task(task_id, g.user_id, notes)
    if success:
        return jsonify({"message": "Task fully verified by Scout Leader"}), 200
    return jsonify({"message": "Failed to verify task"}), 500


def leader_reject(task_id):
    """Scout Leader rejects a task."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in LEADER_ROLES:
        return jsonify({"message": "Scout Leaders only"}), 403

    data = request.get_json() or {}
    notes = data.get('notes', '')
    success = reject_progress_task(task_id, notes)
    if success:
        return jsonify({"message": "Task rejected by Scout Leader"}), 200
    return jsonify({"message": "Failed to reject task"}), 500


# ─────────────────────────────────────────────
# BADGE APPLICATIONS (badge-level, not task-level)
# ─────────────────────────────────────────────

def submit_badge():
    """Scout submits a complete badge for PLC review."""
    if g.user_role not in ('scout', 'patrol_leader'):
        return jsonify({"message": "Only scouts can submit badges"}), 403

    data = request.get_json()
    badge_id = data.get('badge_id')
    if not badge_id:
        return jsonify({"message": "Badge ID is required"}), 400

    from models.badge_model import create_badge_application
    app_id = create_badge_application(g.user_id, badge_id)
    if app_id:
        return jsonify({"message": "Badge submitted for review", "application_id": app_id}), 200
    return jsonify({"message": "Failed to submit badge"}), 500


def list_pending_badges():
    """Scout Leader: list badge applications pending review."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in LEADER_ROLES:
        return jsonify({"message": "Unauthorized"}), 403

    from models.badge_model import get_pending_badge_applications
    badges = get_pending_badge_applications(user['troop_id'])
    return jsonify(badges), 200


def review_badge(application_id):
    """Scout Leader approves or rejects a badge application (investiture)."""
    user = get_user_by_id(g.user_id)
    if not user or user['role'] not in LEADER_ROLES:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    status = data.get('status')
    notes = data.get('notes', '')

    if status not in ('approved', 'rejected'):
        return jsonify({"message": "Invalid status"}), 400

    from models.badge_model import review_badge_application
    success = review_badge_application(application_id, g.user_id, status, notes)
    if success:
        return jsonify({"message": f"Badge application {status}"}), 200
    return jsonify({"message": "Failed to review badge application"}), 500


# ─────────────────────────────────────────────
# BADGE PLAN GENERATOR
# ─────────────────────────────────────────────

def generate_badge_plan():
    """Generates an estimated badge plan timeline based on SLSA rules."""
    from datetime import datetime
    from dateutil.relativedelta import relativedelta
    
    data = request.get_json()
    dob_str = data.get('dob')
    join_str = data.get('joiningDate')
    
    if not dob_str or not join_str:
        return jsonify({"message": "Date of birth and joining date are required"}), 400
        
    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d')
        join_date = datetime.strptime(join_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({"message": "Dates must be in YYYY-MM-DD format"}), 400

    timeline = []
    
    # 1. Membership Badge
    # Start age = 10y 2m. Minimum service = 3 months.
    min_start = dob + relativedelta(years=10, months=2)
    start_date = max(join_date, min_start)
    end_date = start_date + relativedelta(months=3)
    
    timeline.append({
        "id": "membership",
        "title": "Membership Badge",
        "startDate": start_date.strftime('%Y-%m-%d'),
        "endDate": end_date.strftime('%Y-%m-%d'),
        "duration": "3 Months",
        "description": "Basic requirements and investiture.",
        "icon": "Users"
    })
    
    # 2. Scout Award
    # Minimum training = 6 months after Membership Badge
    start_date = end_date
    end_date = start_date + relativedelta(months=6)
    
    timeline.append({
        "id": "scout_award",
        "title": "Scout Award",
        "startDate": start_date.strftime('%Y-%m-%d'),
        "endDate": end_date.strftime('%Y-%m-%d'),
        "duration": "6 Months",
        "description": "Complete 23 requirements and 3 proficiency badges.",
        "icon": "Award"
    })
    
    # 3. Chief Commissioner's Award
    # Minimum training = 9 months after Scout Award
    start_date = end_date
    end_date = start_date + relativedelta(months=9)
    
    timeline.append({
        "id": "cc_award",
        "title": "Chief Commissioner's Award",
        "startDate": start_date.strftime('%Y-%m-%d'),
        "endDate": end_date.strftime('%Y-%m-%d'),
        "duration": "9 Months",
        "description": "Complete 24 requirements and 3 more proficiency badges.",
        "icon": "Star"
    })
    
    # 4. Prime Minister's Scout Award
    # Minimum training = 9 months after CC Award
    start_date = end_date
    end_date = start_date + relativedelta(months=9)
    
    timeline.append({
        "id": "pm_award",
        "title": "Prime Minister's Scout Award",
        "startDate": start_date.strftime('%Y-%m-%d'),
        "endDate": end_date.strftime('%Y-%m-%d'),
        "duration": "9 Months",
        "description": "Complete 22 requirements, 4 camping nights and 5 badges.",
        "icon": "Shield"
    })
    
    # 5. President's Scout Award
    # Minimum training = 9 months after PM Award
    start_date = end_date
    end_date = start_date + relativedelta(months=9)
    
    timeline.append({
        "id": "president_award",
        "title": "President's Scout Award",
        "startDate": start_date.strftime('%Y-%m-%d'),
        "endDate": end_date.strftime('%Y-%m-%d'),
        "duration": "9 Months",
        "description": "Highest youth award in SLSA. Complete 13 requirements.",
        "icon": "Crown"
    })
    
    return jsonify({"plan": timeline}), 200
