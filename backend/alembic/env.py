import os
import sys
# from dotenv import load_dotenv # Tidak kita perlukan lagi di sini jika mengandalkan alembic.ini
from alembic import context
from sqlalchemy import create_engine, pool # Pastikan create_engine diimpor

# Add project root to Python path so src package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# load_dotenv() # Komentari atau hapus baris ini

config = context.config

# Kita tidak lagi mengambil DATABASE_URL dari os.environ di sini untuk Alembic.
# config.set_main_option('sqlalchemy.url', DATABASE_URL) juga tidak diperlukan lagi di sini.

# Import all models so that metadata is populated
from src.models.base import Base  # noqa: E402
import src.models.user          # noqa: E402
import src.models.account       # noqa: E402
import src.models.transaction   # noqa: E402
import src.models.debt          # noqa: E402
import src.models.category      # noqa: E402

target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode without a DB connection."""
    # Ambil URL dari konfigurasi alembic.ini
    url = config.get_main_option("sqlalchemy.url")
    if not url:
        raise RuntimeError("sqlalchemy.url is not set in alembic.ini")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode with a DB connection."""
    # Ambil URL dari konfigurasi alembic.ini
    connectable_url = config.get_main_option("sqlalchemy.url")
    if not connectable_url:
        raise RuntimeError(
            "sqlalchemy.url is not set in alembic.ini or via -x option for alembic config"
        )
    
    # Tambahkan print untuk debugging URL yang digunakan
    print(f"DEBUG env.py: Menggunakan sqlalchemy.url dari alembic.ini: '{connectable_url}'")
    
    # Gunakan connectable_url untuk membuat engine
    engine = create_engine(connectable_url, poolclass=pool.NullPool)
    
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()