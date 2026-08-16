import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

DB_USER = "postgres"
DB_PASS = "VBTignesh"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "SmartScoutsSL"

def create_database():
    try:
        # Connect to default 'postgres' database to create the new one
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cur.fetchone()
        if not exists:
            print(f"Creating database {DB_NAME}...")
            cur.execute(f'CREATE DATABASE "{DB_NAME}"')
        else:
            print(f"Database {DB_NAME} already exists.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

def run_sql_file(filename, conn):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            sql = f.read()
        cur = conn.cursor()
        print(f"Executing {filename}...")
        cur.execute(sql)
        conn.commit()
        cur.close()
        print(f"Successfully executed {filename}")
    except Exception as e:
        print(f"Error executing {filename}: {e}")
        conn.rollback()

def sync_sequences(conn):
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        """)
        tables = [row[0] for row in cur.fetchall()]
        print("Synchronizing primary key sequences...")
        for table in tables:
            try:
                cur.execute(f"SELECT pg_get_serial_sequence('{table}', 'id');")
                seq = cur.fetchone()[0]
                if seq:
                    cur.execute(f"SELECT COALESCE(MAX(id), 0) FROM \"{table}\";")
                    max_id = cur.fetchone()[0]
                    new_seq = max(max_id, 1)
                    cur.execute(f"SELECT setval('{seq}', {new_seq});")
                    conn.commit()
            except Exception:
                conn.rollback()
        cur.close()
        print("Sequence synchronization complete.")
    except Exception as e:
        print(f"Error syncing sequences: {e}")

def init_db():
    print("Starting database initialization...")
    create_database()
    
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        print(f"Connected to {DB_NAME} database.")
        
        # Execute schema
        run_sql_file('schema.sql', conn)
        
        # Execute seed data
        run_sql_file('seed.sql', conn)
        
        # Synchronize all sequence counters
        sync_sequences(conn)

        conn.close()
        print("Database initialization complete!")
    except Exception as e:
        print(f"Error connecting to database {DB_NAME}: {e}")

if __name__ == "__main__":
    # Change working directory to the directory of this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    init_db()
