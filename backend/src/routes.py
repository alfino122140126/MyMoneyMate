from pyramid.config import Configurator

def includeme(config: Configurator):
    config.add_route('health', '/health')
    config.add_view('src.views.health_view', route_name='health', renderer='json')
    
    # Auth routes
    config.add_route('auth_register', '/api/auth/register') # Route for registration
    config.add_route('auth_login', '/api/auth/login')       # Route for login
    
    # CRUD Viewset routes
    config.add_route('categories', '/api/categories', factory='pyramid_restful.routers.generate_restful_root')
    config.add_route('debts', '/api/debts', factory='pyramid_restful.routers.generate_restful_root')
    config.add_route('recurring_expenses', '/api/recurring-expenses', factory='pyramid_restful.routers.generate_restful_root')
    config.add_route('transactions', '/api/transactions', factory='pyramid_restful.routers.generate_restful_root')
    # tidak perlu scan lagi—sudah di main()
