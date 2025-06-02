import argparse
import sys
import transaction

from pyramid.paster import bootstrap, setup_logging
from pyramid.scripts.common import parse_vars

from ..models.meta import Base
from ..models import get_engine
from ..models.user import User

def setup_models(dbsession):
    """
    Add or update models / fixtures in the database.
    """
    # Create admin user
    admin = User(username='admin')
    admin.set_password('admin')
    admin.is_admin = True
    dbsession.add(admin)
    
    # Create regular user
    user = User(username='user')
    user.set_password('user')
    dbsession.add(user)

def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    parser.add_argument(
        '--reset-db',
        action='store_true',
        help='Drop and recreate the database',
    )
    return parser.parse_args(argv[1:])

def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            engine = get_engine(env['registry'].settings)
            if args.reset_db:
                Base.metadata.drop_all(engine)
            Base.metadata.create_all(engine)
            setup_models(env['request'].dbsession)
    except Exception:
        print('Initialization failed.')
        raise
    print('Database initialized successfully')

if __name__ == '__main__':
    main()