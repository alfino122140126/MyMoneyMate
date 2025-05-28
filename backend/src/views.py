from pyramid.view import view_config
from pyramid.request import Request
import jwt, os

JWT_SECRET = os.getenv('JWT_SECRET')

@view_config(route_name='health', renderer='json', request_method='GET')
def health_view(request: Request):
    return {'status': 'ok'}

@view_config(route_name='auth_register', renderer='json', request_method='POST')
def register(request: Request):
    data = request.json_body
    return {'message': 'registered', 'data': data}

@view_config(route_name='auth_login', renderer='json', request_method='POST')
def login(request: Request):
    data = request.json_body
    token = jwt.encode({'email': data.get('email')}, JWT_SECRET, algorithm='HS256')
    return {'access_token': token}