from sqlalchemy import engine_from_config
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

def get_engine(settings):
    # settings['sqlalchemy.url'] injected in main()
    return engine_from_config({'sqlalchemy.url': settings['sqlalchemy.url']}, prefix='sqlalchemy.')

def get_session_factory(engine):
    return sessionmaker(bind=engine)

def includeme(config):
    # configure DB session factory
    settings = config.get_settings()
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    # store factory in registry & add request.db
    config.registry['db_session_factory'] = session_factory
    config.add_request_method(lambda request: session_factory(), name='db', reify=True)