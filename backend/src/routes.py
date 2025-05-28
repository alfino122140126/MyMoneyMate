from pyramid.config import Configurator

def includeme(config: Configurator):
    config.add_route('health', '/health')
    config.add_view('backend.src.views.health_view', route_name='health', renderer='json')
    config.add_route('auth_register', '/api/auth/register')
    config.add_route('auth_login', '/api/auth/login')
    config.scan('backend.src.views')