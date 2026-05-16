from functools import wraps
from flask import request, jsonify, g
from utils.auth import decode_token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Token is usually passed in the Authorization header as 'Bearer <token>'
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        data = decode_token(token)
        if 'error' in data:
            return jsonify({'message': data['error']}), 401
        
        # Attach user info to the global 'g' object
        g.user_id = data.get('user_id')
        g.user_role = data.get('role')
        
        return f(*args, **kwargs)
    
    return decorated
