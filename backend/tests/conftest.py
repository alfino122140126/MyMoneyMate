import os
import tempfile
import pytest
import transaction
from pyramid import testing
from pyramid.paster import get_appsettings
from webtest import TestApp

from myapp import main
from myapp.models import get_engine, get_session_factory, get_tm_session
from myapp.models.meta import Base
from myapp.models.user import User
from myapp.models.transaction import Transaction
from myapp.models.budget import Budget
from myapp.models.category import Category

@pytest.fixture(scope='session')
def settings():
    """Get app settings."""
    return {
        'sqlalchemy.url': 'sqlite:///:memory:',
        'jwt.secret': 'test_secret'
    }

@pytest.fixture
def app(settings):
    """Create a test app with in-memory database."""
    app = main({}, **settings)
    testapp = TestApp(app)
    
    # Set up database
    engine = get_engine(settings)
    Base.metadata.create_all(engine)
    
    yield testapp
    
    Base.metadata.drop_all(engine)

@pytest.fixture
def dbsession(settings):
    """Create a test database session."""
    engine = get_engine(settings)
    Base.metadata.create_all(engine)
    
    session_factory = get_session_factory(engine)
    session = get_tm_session(session_factory, transaction.manager)
    
    yield session
    
    transaction.abort()
    Base.metadata.drop_all(engine)

@pytest.fixture
def dummy_request(dbsession):
    """Create a dummy request with a dbsession."""
    request = testing.DummyRequest()
    request.dbsession = dbsession
    request.tm = transaction.manager
    request.registry.settings = {
        'jwt.secret': 'test_secret'
    }
    return request

@pytest.fixture
def test_user(dbsession):
    """Create a test user."""
    user = User(username='testuser')
    user.set_password('password')
    dbsession.add(user)
    dbsession.flush()
    return user

@pytest.fixture
def test_admin(dbsession):
    """Create a test admin user."""
    admin = User(username='admin')
    admin.set_password('admin')
    admin.is_admin = True
    dbsession.add(admin)
    dbsession.flush()
    return admin

@pytest.fixture
def test_category(dbsession, test_user):
    """Create a test category."""
    category = Category(name='Test Category', user_id=test_user.id)
    dbsession.add(category)
    dbsession.flush()
    return category

@pytest.fixture
def test_transaction(dbsession, test_user, test_category):
    """Create a test transaction."""
    transaction = Transaction(
        user_id=test_user.id,
        amount=100.0,
        description='Test Transaction',
        category_id=test_category.id
    )
    dbsession.add(transaction)
    dbsession.flush()
    return transaction

@pytest.fixture
def test_budget(dbsession, test_user):
    """Create a test budget."""
    from datetime import datetime, timedelta
    
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=30)
    
    budget = Budget(
        user_id=test_user.id,
        total=1000.0,
        start_date=start_date,
        end_date=end_date
    )
    dbsession.add(budget)
    dbsession.flush()
    return budget