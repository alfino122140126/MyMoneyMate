from pyramid.authentication import BasicAuthAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import Allow, Deny, Everyone, Authenticated
import jwt

class RootFactory:
    __acl__ = [(Allow, Authenticated, 'view'), (Allow, 'group:admin', 'admin')]

    def __init__(self, request):
        pass

def check_credentials(username, password, request):
    from .models.user import User
    user = request.dbsession.query(User).filter_by(username=username).first()
    if user and user.verify_password(password):
        return ['group:admin'] if user.is_admin else ['group:user']
    return None

def get_user_from_token(request):
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header[7:]  # Remove 'Bearer ' prefix
        try:
            settings = request.registry.settings
            secret = settings.get('jwt.secret', 'RAHASIA_SUPER_SECRET')
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            user_id = payload.get('user_id')
            if user_id:
                from .models.user import User
                user = request.dbsession.query(User).filter_by(id=user_id).first()
                if user:
                    return user.id
        except (jwt.exceptions.InvalidTokenError, KeyError):
            pass
    return None

def includeme(config):
    authn_policy = BasicAuthAuthenticationPolicy(check_credentials)
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)
    config.set_root_factory(RootFactory)
    
    # Add request methods for JWT authentication
    config.add_request_method(get_user_from_token, 'authenticated_userid', reify=True)