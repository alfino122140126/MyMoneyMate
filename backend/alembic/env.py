# backend/alembic/env.py

import os
import sys
from dotenv import load_dotenv
from alembic import context
from sqlalchemy import create_engine, pool

# Add project root to Python path so src package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load environment variables from .env (if present)
load_dotenv()

# Alembic configuration
config = context.config

# Override SQLAlchemy URL from environment variable
# Expecting: postgresql://finance:finance@db:5432/finance_db
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in the environment")
config.set_main_option('sqlalchemy.url', DATABASE_URL)

# Import all models so that metadata is populated
from src.models.base import Base  # noqa: E402
import src.models.user            # noqa: E402
import src.models.account         # noqa: E402
import src.models.transaction     # noqa: E402
import src.models.debt            # noqa: E402
import src.models.category        # noqa: E402

target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode without a DB connection."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode with a DB connection."""
    engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()

# Choose migration mode based on context
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
