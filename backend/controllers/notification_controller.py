from flask import jsonify, g
from models.notification_model import get_notifications, mark_read

def list_notifications():
    notifs = get_notifications(g.user_id)
    return jsonify(notifs), 200

def read_notification(notif_id):
    success = mark_read(notif_id, g.user_id)
    if success:
        return jsonify({"message": "Marked as read"}), 200
    return jsonify({"message": "Failed to mark as read"}), 400
