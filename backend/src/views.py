# backend/src/views.py

import os
from pyramid.view import view_config
from passlib.hash import bcrypt
import jwt

from src.models.base import DBSession
from src.models.user import User  # ensure this model exists

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'changeme')
JWT_ALGORITHM = 'HS256'


def health_view(request):
    """GET /health — simple liveness probe."""
    return {'status': 'ok'}


@view_config(route_name='auth_register', renderer='json', request_method='POST')
def register_view(request):
    """
    POST /api/auth/register
    Body: { "username": "...", "password": "..." }
    """
    # parse & validate JSON
    try:
        data = request.json_body
    except ValueError:
        request.response.status = 400
        return {'error': 'Invalid JSON'}

    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        request.response.status = 400
        return {'error': 'username and password required'}

    session = DBSession()
    if session.query(User).filter_by(username=username).first():
        request.response.status = 409
        return {'error': 'username already taken'}

    hashed = bcrypt.hash(password)
    user = User(username=username, password=hashed)
    session.add(user)
    session.commit()

    return {'message': 'user registered', 'user': {'id': user.id, 'username': user.username}}


@view_config(route_name='auth_login', renderer='json', request_method='POST')
def login_view(request):
    """
    POST /api/auth/login
    Body: { "username": "...", "password": "..." }
    """
    try:
        data = request.json_body
    except ValueError:
        request.response.status = 400
        return {'error': 'Invalid JSON'}

    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        request.response.status = 400
        return {'error': 'username and password required'}

    session = DBSession()
    user = session.query(User).filter_by(username=username).first()
    if not user or not bcrypt.verify(password, user.password):
        request.response.status = 401
        return {'error': 'invalid credentials'}

    payload = {'user_id': user.id, 'username': user.username}
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {'access_token': token}
