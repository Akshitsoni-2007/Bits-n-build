#!/usr/bin/env python3
"""
Initialize database tables using SQLAlchemy metadata.
Run manually after MySQL is available:
    python scripts/init_db.py
"""
import sys
from app.database import engine, Base
from app.models import Incident  # noqa: F401 ensure model registered


def init_db() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully.")
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        sys.exit(1)


if __name__ == "__main__":
    init_db()