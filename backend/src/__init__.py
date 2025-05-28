from pyramid.config import Configurator
from dotenv import load_dotenv
import os

# Load .env ke os.environ
load_dotenv()

def main(global_config, **settings):
    # Override nilai-nilai sensitif dengan environment variables
    settings['sqlalchemy.url'] = os.environ.get('DATABASE_URL')
    settings['jwt.secret']    = os.environ.get('JWT_SECRET')

    config = Configurator(settings=settings)
    config.include('backend.src.models')
    config.include('backend.src.routes')
    return config.make_wsgi_app()
