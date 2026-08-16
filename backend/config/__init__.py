import os
from dotenv import load_dotenv

load_dotenv()

def get_config():
    return {
        'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'dev-secret'),
        'DATABASE_URL': os.getenv('DATABASE_URL', ''),
    }
