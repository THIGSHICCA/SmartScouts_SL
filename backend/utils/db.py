import psycopg2
import os
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Create and return a database connection."""
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None
