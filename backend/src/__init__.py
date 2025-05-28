from pyramid.config import Configurator
from dotenv import load_dotenv
import os

load_dotenv()

def main(global_config, **settings):
    # Inject env ke settings
    settings['sqlalchemy.url'] = os.environ['DATABASE_URL']
    settings['jwt.secret']    = os.environ['JWT_SECRET']

    config = Configurator(settings=settings)
    # Sertakan subpaket di folder src
    config.include('src.models')
    config.include('src.routes')
    # Autodiscover views
    config.scan('src.views')
    return config.make_wsgi_app()
