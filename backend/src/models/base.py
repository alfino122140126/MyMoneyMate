# backend/src/models/base.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

# load .env
load_dotenv()

# URL koneksi PostgreSQL dari env
DATABASE_URL = os.environ['DATABASE_URL']

# engine & session factory
engine = create_engine(
    DATABASE_URL,
    echo=True,                # bisa dimatikan (False) setelah OK
    future=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

# Scoped session untuk thread‐safety
DBSession = scoped_session(SessionLocal)

# Base class untuk model
Base = declarative_base()
