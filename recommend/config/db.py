import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

def get_db() :

    load_dotenv()
    DB_USER=os.getenv("DB_USER")
    DB_PASS=os.getenv("DB_PASS")
    DB_HOST=os.getenv("DB_HOST")
    DB_PORT=os.getenv("DB_PORT")
    DB_NAME=os.getenv("DB_NAME")

    dsn = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(dsn, pool_size=20, max_overflow=0, echo=True, future=True)

    return engine