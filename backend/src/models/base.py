# backend/src/models/base.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

load_dotenv() # Ini akan mencari .env relatif terhadap base.py atau di atasnya

DATABASE_URL = os.environ['DATABASE_URL'] # Ini akan error jika .env tidak ditemukan atau tidak ada DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
DBSession = scoped_session(SessionLocal)
Base = declarative_base()