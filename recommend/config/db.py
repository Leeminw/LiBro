import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Engine

def get_db() -> Engine:
    load_dotenv(override=True)
    
    DB_USER=os.getenv("DB_USER")
    DB_PASS=os.getenv("DB_PASS")
    DB_HOST=os.getenv("DB_HOST")
    DB_PORT=os.getenv("DB_PORT")
    DB_NAME=os.getenv("DB_NAME")

    db_url = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(db_url, pool_size=20, max_overflow=0, echo=True, future=True)

    return engine

def get_model_url() -> str :
    load_dotenv(override=True)
    return os.getenv("MODEL_URL")


def get_jwt_secret_key() -> str :
    load_dotenv(override=True)
    return os.getenv("JWT_SECRET")