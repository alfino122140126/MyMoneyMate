# backend/src/models/__init__.py
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from .base import Base
from .user import User
from .account import Account
from .category import Category
from .debt import Debt
from .transaction import Transaction

# ... (sisa kode untuk get_engine, get_session_factory, includeme yang sudah benar)
def get_engine(settings_dict):
    db_url = settings_dict.get('sqlalchemy.url')
    if not db_url:
        raise RuntimeError("sqlalchemy.url not found in application settings for get_engine.")
    return engine_from_config({'sqlalchemy.url': db_url}, prefix='sqlalchemy.')

def get_session_factory(engine):
    return sessionmaker(bind=engine)

def includeme(config):
    settings = config.get_settings()
    if 'sqlalchemy.url' not in settings:
        raise RuntimeError(
            "sqlalchemy.url not found in application settings when including src.models. "
            "Ensure DATABASE_URL is set in your .env file and loaded by the main application."
        )
    engine = get_engine(settings) 
    session_factory = get_session_factory(engine)
    config.registry['db_session_factory'] = session_factory
    config.add_request_method(lambda request: session_factory(), name='db', reify=True)