import os
from pathlib import Path
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


# Load the single project-level environment file for every module.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")

# Legacy single PostgreSQL engine binding commented out below for reference:
# DATABASE_URL = URL.create(
#     drivername="postgresql+psycopg2",
#     username=os.getenv("DB_USER", "postgres"),
#     password=os.getenv("DB_PASSWORD"),
#     host=os.getenv("DB_HOST", "localhost"),
#     port=int(os.getenv("DB_PORT", "5432")),
#     database=os.getenv("DB_NAME", "project_management"),
# )
# engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def create_db_engine():
    try:
        pg_url = URL.create(
            drivername="postgresql+psycopg2",
            username=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "0381"),
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "5432")),
            database=os.getenv("DB_NAME", "project_management"),
        )
        engine_instance = create_engine(pg_url, pool_pre_ping=True, connect_args={"connect_timeout": 2})
        with engine_instance.connect() as conn:
            pass
        return engine_instance
    except Exception as e:
        db_file = PROJECT_ROOT / "pm_sys.db"
        sqlite_url = f"sqlite:///{db_file.as_posix()}"
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = create_db_engine()

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    """Provide one database session and always close it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

