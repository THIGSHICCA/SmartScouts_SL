from utils.db import get_db_connection
from psycopg2.extras import RealDictCursor
from datetime import datetime


# ──────────────────────────────────────────────────────────────
# UPSERT — creates or updates a progress row for a requirement
# ──────────────────────────────────────────────────────────────

def upsert_progress(scout_id, requirement_id, status, notes=None, evidence_url=None):
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO progress (scout_id, requirement_id, status, notes, evidence_url, completed_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (scout_id, requirement_id)
            DO UPDATE SET
                status       = EXCLUDED.status,
                notes        = EXCLUDED.notes,
                evidence_url = EXCLUDED.evidence_url,
                completed_at = EXCLUDED.completed_at
            RETURNING id
        """, (scout_id, requirement_id, status, notes, evidence_url,
               datetime.now() if status == 'pending_pl' else None))
        conn.commit()
        return cur.fetchone()[0]
    except Exception as e:
        print(f"Upsert progress error: {e}")
        return False
    finally:
        conn.close()


# ──────────────────────────────────────────────────────────────
# PATROL LEADER GATE — tasks awaiting PL signature
# ──────────────────────────────────────────────────────────────

def get_pending_pl_tasks(troop_id=None):
    """Return tasks with status = pending_pl for a troop."""
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT
                p.id, p.scout_id,
                u.first_name || ' ' || u.last_name AS scout_name,
                p.requirement_id,
                r.requirement_text,
                r.requirement_text_ta,
                r.requirement_text_si,
                b.name  AS badge_name,
                b.id    AS badge_id,
                p.status,
                p.completed_at,
                p.evidence_url,
                p.notes
            FROM progress p
            JOIN users u ON p.scout_id = u.id
            JOIN badge_requirements r ON p.requirement_id = r.id
            JOIN badges b ON r.badge_id = b.id
            WHERE p.status = 'pending_pl'
        """
        if troop_id:
            query += " AND u.troop_id = %s ORDER BY p.completed_at ASC"
            cur.execute(query, (troop_id,))
        else:
            cur.execute(query + " ORDER BY p.completed_at ASC")
        return [dict(row) for row in cur.fetchall()]
    finally:
        conn.close()


def pl_approve_task(progress_id, pl_user_id, notes=None):
    """Patrol Leader signs off — advance to pl_approved."""
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute("""
            UPDATE progress
            SET status         = 'pl_approved',
                pl_approved_by = %s,
                pl_approved_at = NOW(),
                notes          = %s
            WHERE id = %s AND status = 'pending_pl'
        """, (pl_user_id, notes, progress_id))
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        print(f"PL approve error: {e}")
        return False
    finally:
        conn.close()


# ──────────────────────────────────────────────────────────────
# SCOUT LEADER GATE — tasks awaiting Leader signature
# ──────────────────────────────────────────────────────────────

def get_pending_leader_tasks(troop_id=None):
    """Return tasks with status = pl_approved for a troop."""
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT
                p.id, p.scout_id,
                u.first_name || ' ' || u.last_name AS scout_name,
                p.requirement_id,
                r.requirement_text,
                r.requirement_text_ta,
                r.requirement_text_si,
                b.name  AS badge_name,
                b.id    AS badge_id,
                p.status,
                p.completed_at,
                p.pl_approved_at,
                pl_user.first_name || ' ' || pl_user.last_name AS pl_approver_name,
                p.evidence_url,
                p.notes
            FROM progress p
            JOIN users u ON p.scout_id = u.id
            JOIN badge_requirements r ON p.requirement_id = r.id
            JOIN badges b ON r.badge_id = b.id
            LEFT JOIN users pl_user ON p.pl_approved_by = pl_user.id
            WHERE p.status = 'pl_approved'
        """
        if troop_id:
            query += " AND u.troop_id = %s ORDER BY p.pl_approved_at ASC"
            cur.execute(query, (troop_id,))
        else:
            cur.execute(query + " ORDER BY p.pl_approved_at ASC")
        return [dict(row) for row in cur.fetchall()]
    finally:
        conn.close()


def leader_verify_task(progress_id, leader_id, notes=None):
    """Scout Leader signs off — fully verified."""
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute("""
            UPDATE progress
            SET status      = 'verified',
                verified_by = %s,
                verified_at = NOW(),
                notes       = %s
            WHERE id = %s AND status = 'pl_approved'
        """, (leader_id, notes, progress_id))
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        print(f"Leader verify error: {e}")
        return False
    finally:
        conn.close()


def reject_progress_task(progress_id, notes=None):
    """Reject a task at any stage — returns it to rejected."""
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute("""
            UPDATE progress
            SET status = 'rejected', notes = %s
            WHERE id = %s
        """, (notes, progress_id))
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        print(f"Reject task error: {e}")
        return False
    finally:
        conn.close()


# ──────────────────────────────────────────────────────────────
# SCOUT RECORD BOOK — full progress view for a scout
# ──────────────────────────────────────────────────────────────

def get_scout_progress_full(scout_id):
    """
    Returns a structured record book for a scout:
    [{badge_id, badge_name, level_order, requirements: [
        {req_id, text, text_ta, text_si, status, completed_at,
         pl_approver, pl_approved_at, leader_approver, verified_at,
         evidence_url, sub_tasks: [...]}
    ]}]
    """
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Load all badges
        cur.execute("SELECT id, name, description, level_order, min_training_months FROM badges ORDER BY level_order")
        badges = [dict(r) for r in cur.fetchall()]

        # Load all parent requirements with progress for this scout
        cur.execute("""
            SELECT
                r.id, r.badge_id, r.parent_id,
                r.requirement_text,
                r.requirement_text_ta,
                r.requirement_text_si,
                r.order_number, r.is_mandatory,
                p.id          AS progress_id,
                p.status,
                p.completed_at,
                p.evidence_url,
                p.pl_approved_at,
                pl_u.first_name || ' ' || pl_u.last_name AS pl_approver_name,
                p.verified_at,
                ldr.first_name || ' ' || ldr.last_name AS leader_name,
                p.notes
            FROM badge_requirements r
            LEFT JOIN progress p ON r.id = p.requirement_id AND p.scout_id = %s
            LEFT JOIN users pl_u ON p.pl_approved_by = pl_u.id
            LEFT JOIN users ldr  ON p.verified_by = ldr.id
            ORDER BY r.badge_id, r.order_number
        """, (scout_id,))
        all_reqs = [dict(r) for r in cur.fetchall()]

        # Organise into badge → requirements → sub-tasks
        badge_map = {b['id']: {**b, 'requirements': []} for b in badges}
        parent_map = {}  # req_id → req dict (for appending sub-tasks)

        for req in all_reqs:
            req['status'] = req['status'] or 'pending'
            req['sub_tasks'] = []

            if req['parent_id'] is None:
                badge_map[req['badge_id']]['requirements'].append(req)
                parent_map[req['id']] = req
            else:
                parent = parent_map.get(req['parent_id'])
                if parent:
                    parent['sub_tasks'].append(req)

        return list(badge_map.values())
    finally:
        conn.close()
