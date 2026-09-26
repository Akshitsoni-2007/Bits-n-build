import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, get_db
from app.models.incident import Incident
from app.models.enums import (
    District,
    CrimeType,
    IncidentStatus,
    IncidentPriority,
)
from datetime import date


# Use SQLite in-memory for tests
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session(create_test_db):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def seed_incidents(db_session):
    incidents = [
        Incident(
            fir_id="FIR-TEST-001",
            date=date(2024, 11, 14),
            district=District.CYBER_CITY,
            crime_type=CrimeType.CYBER_FRAUD_FINANCIAL,
            hour=23,
            day_of_week="Thursday",
            is_weekend=False,
            latitude=28.4912,
            longitude=77.0894,
            description="Test cyber fraud incident",
            location_name="Test Location",
            status=IncidentStatus.UNDER_INVESTIGATION,
            priority=IncidentPriority.HIGH,
        ),
        Incident(
            fir_id="FIR-TEST-002",
            date=date(2024, 11, 15),
            district=District.NORTH,
            crime_type=CrimeType.ROBBERY_SNATCHING,
            hour=22,
            day_of_week="Saturday",
            is_weekend=True,
            latitude=28.6920,
            longitude=77.2130,
            description="Test robbery snatching incident",
            location_name="Test Location 2",
            status=IncidentStatus.CLOSED,
            priority=IncidentPriority.MEDIUM,
        ),
    ]
    db_session.add_all(incidents)
    db_session.commit()
    for inc in incidents:
        db_session.refresh(inc)
    return incidents