from pyramid.view import view_config
from pyramid.security import remember, forget
from pyramid.httpexceptions import HTTPForbidden, HTTPFound
from sqlalchemy import inspect
import json

from ..models import User
from .. import DBSession

@view_config(route_name='register', request_method='POST', renderer='json')
def register_view(request):
    """Handles user registration."""
    try:
        data = request.json_body
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            request.response.status = 400
            return {'message': 'Missing username, email, or password'}

        # Check if username or email already exists
        if DBSession.query(User).filter_by(username=username).first():
            request.response.status = 409
            return {'message': 'Username already exists'}
        if DBSession.query(User).filter_by(email=email).first():
            request.response.status = 409
            return {'message': 'Email already exists'}

        new_user = User(username=username, email=email)
        new_user.set_password(password)  # Hash the password

        DBSession.add(new_user)
        DBSession.flush() # Ensure the user is added to get an ID if needed

        request.response.status = 201
        return {'message': 'User registered successfully'}

    except Exception as e:
        request.response.status = 500
        return {'message': 'An error occurred during registration', 'error': str(e)}


@view_config(route_name='login', request_method='POST', renderer='json')
def login_view(request):
    """Handles user login and authentication."""
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            request.response.status = 400
            return {'message': 'Missing username or password'}

        user = DBSession.query(User).filter_by(username=username).first()

        if user and user.check_password(password):
            # Authentication successful
            headers = remember(request, user.id) # Use remember to set auth cookie/header
            request.response.headers.extend(headers)

            # Prepare user data for response (excluding password hash)
            user_data = {c.key: getattr(user, c.key)
                         for c in inspect(user).mapper.column_attrs if c.key != 'password'}

            request.response.status = 200
            return {'message': 'Login successful', 'user': user_data}
        else:
            request.response.status = 401
            return {'message': 'Invalid credentials'}

    except Exception as e:
        request.response.status = 500
        return {'message': 'An error occurred during login', 'error': str(e)}