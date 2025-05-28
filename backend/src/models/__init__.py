from sqlalchemy import engine_from_config
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

def get_engine(settings):
    return engine_from_config({'sqlalchemy.url': settings['sqlalchemy.url']}, prefix='sqlalchemy.')

def get_session_factory(engine):
    return sessionmaker(bind=engine)

def includeme(config):
    settings = config.get_settings()
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    config.registry['db_session_factory'] = session_factory
    config.add_request_method(lambda r: session_factory(), name='db', reify=True)