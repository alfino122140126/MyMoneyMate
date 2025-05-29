from pyramid.config import Configurator
from pyramid.authentication import BasicAuthPolicy
from pyramid.security import remember, forget, authenticated_userid, Everyone, Authenticated
from dotenv import load_dotenv
import os
from sqlalchemy import engine_from_url
from .models import Base, User # Import User model

load_dotenv()

def main(global_config, **settings):
    # Inject env ke settings
    settings['sqlalchemy.url'] = os.environ['DATABASE_URL']
    settings['jwt.secret']    = os.environ['JWT_SECRET']

    config = Configurator(settings=settings)
    
    # Setup Authentication
    authn_policy = BasicAuthPolicy(check=authenticate_user) # Use BasicAuthPolicy
    config.set_authentication_policy(authn_policy)
    config.set_default_permission('view') # Default permission
    
    # Setup Authorization (optional but good practice with authentication)
    config.set_authorization_policy(ACLAuthorizationPolicy()) # Assuming you'll use ACLs
    config.set_root_factory(RootFactory) # Assuming you'll define a RootFactory
    


    # Sertakan subpaket di folder src
    config.include('src.models')
    
    # Setup SQLAlchemy
    engine = engine_from_url(settings['sqlalchemy.url'], pool_recycle=3600)
    config.include('pyramid_tm')
    config.include('zope.sqlalchemy')
    config.add_sqlalchemy_session_factory(engine)
    
    config.include('src.routes')
    # Autodiscover views
    config.scan('src.views')
    return config.make_wsgi_app()

def authenticate_user(username, password, request):
    # This is the authentication callback
    # Find the user in the database
    user = request.dbsession.query(User).filter_by(username=username).first()
    
    # Verify the password
    if user and user.check_password(password):
        return [Authenticated, username] # Return the user's principal(s)
    
    return None # Authentication failed
