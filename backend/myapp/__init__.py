from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import Allow, Everyone, Authenticated
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, configure_mappers
import zope.sqlalchemy

from .models import get_engine, get_session_factory, get_tm_session
from .models.meta import Base

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.include('.security')
    
    # Configure CORS
    config.add_renderer('json', 'pyramid.renderers.JSON')
    config.add_cors_preflight_handler()
    config.set_cors_options(
        allow_origins=settings.get('cors.origins', '*').split(','),
        allow_methods='GET,POST,PUT,DELETE,OPTIONS',
        allow_headers='Content-Type,Authorization',
        max_age=86400
    )
    
    # Configure database
    config.scan()
    return config.make_wsgi_app()

def add_cors_preflight_handler(config):
    """Add a preflight handler for CORS requests."""
    config.add_route('cors_route', '/{cors_route:.*}', request_method='OPTIONS')
    config.add_view(cors_options_view, route_name='cors_route')

def cors_options_view(request):
    """Handle OPTIONS requests for CORS."""
    from pyramid.response import Response
    response = Response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Max-Age'] = '86400'
    return response

def set_cors_options(config, allow_origins=None, allow_methods=None, allow_headers=None, max_age=None):
    """Set CORS options."""
    Configurator.add_cors_preflight_handler = add_cors_preflight_handler
    config.add_cors_preflight_handler()