import pytest
from fastapi.testclient import TestClient


def test_summary_no_filters(client, seed_incidents):
    resp = client.get("/api/incidents/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_incidents"] == 2
    assert "by_district" in data
    assert "by_crime_type" in data
    assert "by_hour" in data
    assert len(data["by_hour"]) == 24


def test_summary_with_district_filter(client, seed_incidents):
    resp = client.get("/api/incidents/summary?district=Cyber City")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_incidents"] == 1
    assert data["by_district"][0]["district"] == "Cyber City"


def test_list_incidents_pagination(client, seed_incidents):
    resp = client.get("/api/incidents?page=1&page_size=1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["page"] == 1
    assert data["page_size"] == 1
    assert len(data["results"]) == 1
    assert data["total"] == 2


def test_list_incidents_filter_crime_type(client, seed_incidents):
    resp = client.get("/api/incidents?crime_type=Robbery / Snatching")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["results"][0]["crime_type"] == "Robbery / Snatching"