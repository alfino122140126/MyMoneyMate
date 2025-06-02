# backend/src/models/__init__.py
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

# Impor Base dari base.py
from .base import Base

# Impor semua model dari file masing-masing
# Ini penting agar Alembic (melalui Base.metadata) mengenali semua tabel
# dan agar kita bisa mengimpornya dari src.models di tempat lain (misalnya di views.py)
from .user import User
from .account import Account
from .category import Category
from .debt import Debt
from .transaction import Transaction

# Sisa kode yang sudah ada di models/__init__.py Anda untuk setup engine dan session
# (Ini diambil dari file yang Anda unggah sebelumnya)
def get_engine(settings):
    # settings['sqlalchemy.url'] injected in main() dari src/__init__.py aplikasi
    return engine_from_config({'sqlalchemy.url': settings['sqlalchemy.url']}, prefix='sqlalchemy.')

def get_session_factory(engine):
    return sessionmaker(bind=engine)

def includeme(config):
    # configure DB session factory
    settings = config.get_settings()
    # sqlalchemy.url harus ada di settings aplikasi, yang diambil dari .env oleh src/__init__.py utama
    if 'sqlalchemy.url' not in settings:
        raise RuntimeError("sqlalchemy.url not found in application settings. Check your .env and src/__init__.py.")
        
    engine = get_engine(settings)
    
    session_factory = get_session_factory(engine)
    config.registry['db_session_factory'] = session_factory
    config.add_request_method(lambda request: session_factory(), name='db', reify=True)