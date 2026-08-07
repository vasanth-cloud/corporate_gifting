from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool

from app.core.config import settings
from app.core.database import engine
from app.models.base import Base

from app.models.user import User
from app.models.company import Company
from app.models.employee import Employee
from app.models.gift_category import GiftCategory
from app.models.gift import Gift
from app.models.vendor import Vendor
from app.models.campaign import Campaign
from app.models.order import Order
from app.models.order_item import OrderItem

# Alembic Config
config = context.config

# Escape % characters (e.g. %40 in password)
database_url = settings.DATABASE_URL.replace("%", "%%")
config.set_main_option("sqlalchemy.url", database_url)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    with engine.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()