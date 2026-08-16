from flask import jsonify
from models.badge_model import get_all_badges, get_badge_requirements

def list_badges():
    badges = get_all_badges()
    return jsonify(badges), 200

def get_badge(badge_id):
    reqs = get_badge_requirements(badge_id)
    return jsonify(reqs), 200
