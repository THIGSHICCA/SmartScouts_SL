from flask import jsonify, request, g
import os
import uuid
from werkzeug.utils import secure_filename
from models.evidence_model import add_evidence, get_evidence_for_progress

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'mp4'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_evidence():
    if g.user_role != 'scout':
        return jsonify({"message": "Only scouts can upload evidence"}), 403
        
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
        
    file = request.files['file']
    progress_id = request.form.get('progress_id')
    
    if file.filename == '' or not progress_id:
        return jsonify({"message": "No selected file or missing progress_id"}), 400
        
    if file and allowed_file(file.filename):
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
            
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        file_url = f"/uploads/{filename}"
        evidence_id = add_evidence(progress_id, g.user_id, file_url, ext)
        
        if evidence_id:
            return jsonify({"message": "File uploaded", "url": file_url}), 201
            
    return jsonify({"message": "File upload failed or invalid format"}), 400

def get_evidence(progress_id):
    evidence = get_evidence_for_progress(progress_id)
    return jsonify(evidence), 200
