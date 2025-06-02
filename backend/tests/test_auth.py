import pytest
import jwt
from pyramid import testing
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized

from myapp.views.auth import register, login

class TestAuthViews:
    
    def test_register_success(self, dummy_request, dbsession):
        dummy_request.json_body = {
            'username': 'newuser',
            'password': 'password123'
        }
        
        response = register(dummy_request)
        
        assert response.status_code == 201
        assert 'id' in response.json
        assert response.json['username'] == 'newuser'
        assert 'token' in response.json
        
        # Verify user was created in database
        from myapp.models.user import User
        user = dbsession.query(User).filter_by(username='newuser').first()
        assert user is not None
        assert user.verify_password('password123')
    
    def test_register_missing_fields(self, dummy_request):
        dummy_request.json_body = {
            'username': 'newuser'
            # Missing password
        }
        
        with pytest.raises(HTTPBadRequest) as excinfo:
            register(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'required' in excinfo.value.json['error']
    
    def test_register_duplicate_username(self, dummy_request, test_user):
        dummy_request.json_body = {
            'username': 'testuser',  # Same as test_user
            'password': 'password123'
        }
        
        with pytest.raises(HTTPBadRequest) as excinfo:
            register(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'exists' in excinfo.value.json['error']
    
    def test_login_success(self, dummy_request, test_user):
        dummy_request.json_body = {
            'username': 'testuser',
            'password': 'password'
        }
        
        response = login(dummy_request)
        
        assert response['id'] == test_user.id
        assert response['username'] == 'testuser'
        assert 'token' in response
        
        # Verify token contains correct user_id
        token = response['token']
        payload = jwt.decode(token, 'test_secret', algorithms=['HS256'])
        assert payload['user_id'] == test_user.id
    
    def test_login_invalid_credentials(self, dummy_request, test_user):
        dummy_request.json_body = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        with pytest.raises(HTTPUnauthorized) as excinfo:
            login(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'Invalid credentials' in excinfo.value.json['error']
    
    def test_login_missing_fields(self, dummy_request):
        dummy_request.json_body = {
            'username': 'testuser'
            # Missing password
        }
        
        with pytest.raises(HTTPBadRequest) as excinfo:
            login(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'required' in excinfo.value.json['error']