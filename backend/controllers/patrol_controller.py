from flask import request, jsonify, g
from models.patrol_model import (
    get_patrol_by_leader_id,
    update_patrol_details,
    get_patrol_members,
    add_patrol_member,
    remove_patrol_member
)
from models.user_model import get_user_by_id, get_scouts_by_troop

def get_my_patrol():
    """Retrieve the patrol details and its members for the logged-in Patrol Leader."""
    patrol = get_patrol_by_leader_id(g.user_id)
    if not patrol:
        return jsonify({"message": "You do not lead any patrol."}), 404
        
    members = get_patrol_members(patrol['id'])
    
    # Also fetch all scouts in the troop who are NOT currently in a patrol,
    # so the Patrol Leader can add them.
    user = get_user_by_id(g.user_id)
    troop_scouts = get_scouts_by_troop(user['troop_id']) if user else []
    
    # Filter for scouts who do not have a patrol_id assigned
    unassigned_scouts = [s for s in troop_scouts if s.get('patrol_id') is None]

    return jsonify({
        "patrol": patrol,
        "members": members,
        "unassigned_scouts": unassigned_scouts
    }), 200

def update_my_patrol():
    """Update patrol details (color, motto)."""
    patrol = get_patrol_by_leader_id(g.user_id)
    if not patrol:
        return jsonify({"message": "You do not lead any patrol."}), 404

    data = request.get_json()
    success = update_patrol_details(patrol['id'], data)
    if success:
        return jsonify({"message": "Patrol details updated successfully."}), 200
    return jsonify({"message": "Failed to update patrol details."}), 400

def add_member_to_patrol():
    """Add a scout from the troop to the patrol."""
    patrol = get_patrol_by_leader_id(g.user_id)
    if not patrol:
        return jsonify({"message": "You do not lead any patrol."}), 404

    data = request.get_json()
    scout_id = data.get('scout_id')
    if not scout_id:
        return jsonify({"message": "Scout ID is required."}), 400

    # Verify the scout belongs to the same troop
    user = get_user_by_id(g.user_id)
    scout = get_user_by_id(scout_id)
    
    if not scout or scout['troop_id'] != user['troop_id']:
        return jsonify({"message": "Scout does not belong to your troop."}), 403

    success = add_patrol_member(patrol['id'], scout_id)
    if success:
        return jsonify({"message": "Member added to patrol successfully."}), 200
    return jsonify({"message": "Failed to add member to patrol."}), 400

def remove_member_from_patrol(scout_id):
    """Remove a scout from the patrol."""
    patrol = get_patrol_by_leader_id(g.user_id)
    if not patrol:
        return jsonify({"message": "You do not lead any patrol."}), 404

    # Verify the scout is actually in this patrol
    scout = get_user_by_id(scout_id)
    if not scout or scout['patrol_id'] != patrol['id']:
        return jsonify({"message": "Scout is not in your patrol."}), 400

    success = remove_patrol_member(scout_id)
    if success:
        return jsonify({"message": "Member removed from patrol successfully."}), 200
    return jsonify({"message": "Failed to remove member from patrol."}), 400
