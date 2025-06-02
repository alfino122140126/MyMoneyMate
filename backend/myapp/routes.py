def includeme(config):
    # Add CORS support
    config.add_directive('add_cors_preflight_handler', add_cors_preflight_handler)
    config.add_directive('set_cors_options', set_cors_options)
    
    # Auth
    config.add_route('login', '/auth/login', request_method='POST')
    config.add_route('register', '/auth/register', request_method='POST')
    
    # Transactions
    config.add_route('get_transactions', '/transactions', request_method='GET')
    config.add_route('add_transaction', '/transactions', request_method='POST')
    config.add_route('get_transaction', '/transactions/{id}', request_method='GET')
    config.add_route('update_transaction', '/transactions/{id}', request_method='PUT')
    config.add_route('delete_transaction', '/transactions/{id}', request_method='DELETE')
    
    # Budgets
    config.add_route('get_budgets', '/budgets', request_method='GET')
    config.add_route('add_budget', '/budgets', request_method='POST')
    config.add_route('get_budget', '/budgets/{id}', request_method='GET')
    config.add_route('update_budget', '/budgets/{id}', request_method='PUT')
    config.add_route('delete_budget', '/budgets/{id}', request_method='DELETE')
    
    # Categories
    config.add_route('get_categories', '/categories', request_method='GET')
    config.add_route('add_category', '/categories', request_method='POST')
    config.add_route('get_category', '/categories/{id}', request_method='GET')
    config.add_route('update_category', '/categories/{id}', request_method='PUT')
    config.add_route('delete_category', '/categories/{id}', request_method='DELETE')

def add_cors_preflight_handler(config):
    config.add_route('cors_route', '/{cors_route:.*}', request_method='OPTIONS')
    config.add_view(cors_options_view, route_name='cors_route')

def cors_options_view(request):
    from pyramid.response import Response
    response = Response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Max-Age'] = '86400'
    return response

def set_cors_options(config, allow_origins=None, allow_methods=None, allow_headers=None, max_age=None):
    if allow_origins is not None:
        config.registry.settings['cors.allow_origins'] = allow_origins
    if allow_methods is not None:
        config.registry.settings['cors.allow_methods'] = allow_methods
    if allow_headers is not None:
        config.registry.settings['cors.allow_headers'] = allow_headers
    if max_age is not None:
        config.registry.settings['cors.max_age'] = max_age