import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.data_service import get_data_service

@pytest.fixture(scope="session")
def client():
    # Initialize DataService
    get_data_service()
    with TestClient(app) as c:
        yield c