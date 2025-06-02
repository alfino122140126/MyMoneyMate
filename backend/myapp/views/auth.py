from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized, HTTPCreated
import jwt

from ..models.user import User

@view_config(route_name='register', renderer='json')
def register(request):
    data = request.json_body
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        raise HTTPBadRequest(json={'error': 'Username and password are required'})
    
    # Check if user already exists
    db_session = request.dbsession
    existing_user = db_session.query(User).filter_by(username=username).first()
    if existing_user:
        raise HTTPBadRequest(json={'error': 'Username already exists'})
    
    # Create new user
    new_user = User(username=username)
    new_user.set_password(password)
    db_session.add(new_user)
    db_session.flush()
    
    # Generate JWT token
    settings = request.registry.settings
    secret = settings.get('jwt.secret', 'RAHASIA_SUPER_SECRET')
    token = jwt.encode({'user_id': new_user.id}, secret, algorithm='HS256')
    
    return HTTPCreated(json={
        'id': new_user.id,
        'username': new_user.username,
        'token': token
    })

@view_config(route_name='login', renderer='json')
def login(request):
    data = request.json_body
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        raise HTTPBadRequest(json={'error': 'Username and password are required'})
    
    # Verify credentials
    db_session = request.dbsession
    user = db_session.query(User).filter_by(username=username).first()
    
    if not user or not user.verify_password(password):
        raise HTTPUnauthorized(json={'error': 'Invalid credentials'})
    
    # Generate JWT token
    settings = request.registry.settings
    secret = settings.get('jwt.secret', 'RAHASIA_SUPER_SECRET')
    token = jwt.encode({'user_id': user.id}, secret, algorithm='HS256')
    
    return {
        'id': user.id,
        'username': user.username,
        'token': token
    }