from flask import jsonify, request
from utils.rag import query_syllabus
from utils.slm import generate_answer

def ask_ai():
    data = request.get_json()
    question = data.get('question') or data.get('message')
    client_context = data.get('context')
    
    if not question:
        return jsonify({"message": "Question is required"}), 400
        
    print(f"\n💬 [USER] {question}", flush=True)
    
    # 1. Retrieve relevant syllabus chunks
    query_str = question
    if client_context:
        query_str = f"{client_context}\nQuestion: {question}"
        
    context_chunks = query_syllabus(query_str, n_results=8)
    
    # Combine client context and database context chunks
    all_chunks = []
    if client_context:
        all_chunks.append(client_context)
    all_chunks.extend(context_chunks)
    
    if not all_chunks:
        print(f"❌ [AI] No context found for question.", flush=True)
        return jsonify({"answer": "I don't have enough syllabus context to answer this."}), 200
        
    # 2. Generate answer with local SLM
    print(f"🤖 [AI] Generating response...", flush=True)
    answer = generate_answer(question, all_chunks)
    print(f"✅ [AI] Response generated successfully!", flush=True)
    
    return jsonify({
        "answer": answer,
        "context_used": len(all_chunks)
    }), 200

def upload_syllabus():
    from flask import g
    import os
    from werkzeug.utils import secure_filename
    from utils.db import get_db_connection
    import uuid
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
        
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        upload_dir = os.getenv('UPLOAD_FOLDER', './uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, filename)
        
        # Save to disk
        file.save(file_path)
        
        # Insert metadata into PostgreSQL
        conn = get_db_connection()
        if not conn:
            return jsonify({"message": "Database connection error"}), 500
            
        doc_id = str(uuid.uuid4())[:8]
        chunk_prefix = f"chunk_{doc_id}"
        category = request.form.get('category', 'General Reference')
        description = request.form.get('description', '')
        
        try:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO documents (filename, file_path, chunk_ids_prefix, category, description) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (filename) DO UPDATE SET file_path = EXCLUDED.file_path, chunk_ids_prefix = EXCLUDED.chunk_ids_prefix, category = EXCLUDED.category, description = EXCLUDED.description RETURNING id;",
                (filename, file_path, chunk_prefix, category, description)
            )
            inserted_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            if conn:
                conn.close()
            print(f"Error saving document to DB: {e}")
            return jsonify({"message": f"Database error: {str(e)}"}), 500

        # Process and index
        from utils.rag import process_and_index_document
        try:
            with open(file_path, 'rb') as f:
                success = process_and_index_document(f, filename, file.content_type, doc_id=doc_id)
        except Exception as e:
            success = False
            print(f"Error reading/processing file: {e}")
            
        if success:
            return jsonify({
                "message": f"Successfully processed and indexed {filename}",
                "document": {
                    "id": inserted_id,
                    "filename": filename,
                    "file_path": file_path,
                    "chunk_ids_prefix": chunk_prefix
                }
            }), 200
        else:
            # Cleanup DB if indexing failed
            conn = get_db_connection()
            if conn:
                cur = conn.cursor()
                cur.execute("DELETE FROM documents WHERE id = %s;", (inserted_id,))
                conn.commit()
                cur.close()
                conn.close()
            # Cleanup file
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({"message": "Failed to process and index document"}), 500
    
    return jsonify({"message": "Invalid request"}), 400

def list_documents():
    from flask import g
    from utils.db import get_db_connection
    from psycopg2.extras import RealDictCursor
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
        
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, filename, file_path, uploaded_at, chunk_ids_prefix, category, description FROM documents ORDER BY uploaded_at DESC;")
        docs = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(docs), 200
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({"message": f"Database error: {str(e)}"}), 500

def view_document(doc_id):
    from flask import g, send_file, make_response
    from utils.db import get_db_connection
    import os
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
        
    try:
        cur = conn.cursor()
        cur.execute("SELECT file_path, filename FROM documents WHERE id = %s;", (doc_id,))
        doc = cur.fetchone()
        cur.close()
        conn.close()
        
        if not doc:
            return jsonify({"message": "Document not found"}), 404
            
        file_path, filename = doc
        if not os.path.exists(file_path):
            return jsonify({"message": f"File not found on server at {file_path}"}), 404

        # Determine MIME type for inline display
        mime_type = None
        lower = filename.lower()
        if lower.endswith('.pdf'):
            mime_type = 'application/pdf'
        elif lower.endswith('.txt'):
            mime_type = 'text/plain'

        response = make_response(
            send_file(file_path, download_name=filename, as_attachment=False,
                      mimetype=mime_type)
        )
        # Disable caching so browser always gets a fresh 200 (not cached 304)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        # Remove ETag so Flask doesn't generate conditional responses
        response.headers.pop('ETag', None)
        response.headers.pop('Last-Modified', None)
        return response

    except Exception as e:
        if conn:
            conn.close()
        return jsonify({"message": f"Error retrieving document: {str(e)}"}), 500

def delete_document(doc_id):
    from flask import g
    from utils.db import get_db_connection
    from utils.chroma_client import get_syllabus_collection
    import os
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
        
    try:
        cur = conn.cursor()
        cur.execute("SELECT filename, file_path FROM documents WHERE id = %s;", (doc_id,))
        doc = cur.fetchone()
        
        if not doc:
            cur.close()
            conn.close()
            return jsonify({"message": "Document not found"}), 404
            
        filename, file_path = doc
        
        # 1. Delete from PostgreSQL
        cur.execute("DELETE FROM documents WHERE id = %s;", (doc_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        # 2. Delete from disk
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as fe:
                print(f"Error deleting file from disk: {fe}")
                
        # 3. Delete chunks from ChromaDB using metadata filter
        try:
            collection = get_syllabus_collection()
            collection.delete(where={"source": filename})
            print(f"Deleted ChromaDB chunks for source: {filename}")
        except Exception as ce:
            print(f"Error deleting ChromaDB chunks: {ce}")
            
        return jsonify({"message": f"Successfully deleted document {filename}"}), 200
        
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({"message": f"Database error: {str(e)}"}), 500

def update_document(doc_id):
    from flask import g
    from utils.db import get_db_connection
    from psycopg2.extras import RealDictCursor
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400
    
    category = data.get('category')
    description = data.get('description')
    
    if not category:
        return jsonify({"message": "Category is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            "UPDATE documents SET category = %s, description = %s WHERE id = %s RETURNING id, filename, category, description, uploaded_at;",
            (category, description, doc_id)
        )
        updated = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not updated:
            return jsonify({"message": "Document not found"}), 404
        
        return jsonify({"message": "Document updated successfully", "document": updated}), 200
        
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({"message": f"Database error: {str(e)}"}), 500

def list_categories():
    from flask import g
    from utils.db import get_db_connection
    from psycopg2.extras import RealDictCursor
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, name, is_default, created_at FROM document_categories ORDER BY is_default DESC, name ASC;")
        cats = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(cats), 200
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({"message": f"Database error: {str(e)}"}), 500

def create_category():
    from flask import g
    from utils.db import get_db_connection
    from psycopg2.extras import RealDictCursor
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
    
    data = request.get_json()
    name = (data.get('name') or '').strip()
    
    if not name:
        return jsonify({"message": "Category name is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            "INSERT INTO document_categories (name, is_default) VALUES (%s, FALSE) RETURNING id, name, is_default, created_at;",
            (name,)
        )
        cat = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": f"Category '{name}' created", "category": cat}), 201
    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        if 'unique' in str(e).lower() or 'duplicate' in str(e).lower():
            return jsonify({"message": f"Category '{name}' already exists"}), 409
        return jsonify({"message": f"Database error: {str(e)}"}), 500

def delete_category(cat_id):
    from flask import g
    from utils.db import get_db_connection
    
    if getattr(g, 'user_role', None) != 'commissioner':
        return jsonify({"message": "Unauthorized: Admin access required"}), 403
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error"}), 500
    
    try:
        cur = conn.cursor()
        cur.execute("SELECT name, is_default FROM document_categories WHERE id = %s;", (cat_id,))
        cat = cur.fetchone()
        
        if not cat:
            cur.close()
            conn.close()
            return jsonify({"message": "Category not found"}), 404
        
        name, is_default = cat
        if is_default:
            cur.close()
            conn.close()
            return jsonify({"message": "Cannot delete a default category"}), 400
        
        # Move documents using this category to 'General Reference'
        cur.execute("UPDATE documents SET category = 'General Reference' WHERE category = %s;", (name,))
        cur.execute("DELETE FROM document_categories WHERE id = %s;", (cat_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": f"Category '{name}' deleted. Documents reassigned to 'General Reference'."}), 200
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({"message": f"Database error: {str(e)}"}), 500
