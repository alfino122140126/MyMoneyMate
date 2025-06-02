# backend/src/routes.py

def includeme(config):
    """Register all routes and attach their view callables."""

    # Health-check
    config.add_route('health', '/health')
    from src.views import health_view
    config.add_view(health_view, route_name='health', renderer='json')

    # Auth: Register
    config.add_route('auth_register', '/api/auth/register')
    from src.views import register_view
    config.add_view(
        register_view,
        route_name='auth_register',
        renderer='json',
        request_method='POST'
    )

    # Auth: Login
    config.add_route('auth_login', '/api/auth/login')
    from src.views import login_view
    config.add_view(
        login_view,
        route_name='auth_login',
        renderer='json',
        request_method='POST'
    )

    # … you can add more routes here …
