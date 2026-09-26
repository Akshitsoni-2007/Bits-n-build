import pytest

def test_summary_no_filters(client):
    resp = client.get("/api/incidents/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_incidents"] > 0
    assert "by_state" in data
    assert "by_city" in data
    assert "by_crime_type" in data
    assert "by_hour" in data
    assert len(data["by_hour"]) == 24


def test_summary_with_state_filter(client):
    resp = client.get("/api/incidents/summary?state=Maharashtra")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_incidents"] > 0
    for s in data["by_state"]:
        assert s["state"] == "Maharashtra"


def test_summary_with_state_and_city_filter(client):
    resp = client.get("/api/incidents/summary?state=Madhya%20Pradesh&city=Indore")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_incidents"] > 0


def test_list_incidents_pagination(client):
    resp = client.get("/api/incidents?page=1&page_size=2")
    assert resp.status_code == 200
    data = resp.json()
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert len(data["results"]) <= 2
    assert data["total"] > 0


def test_list_incidents_filter_crime_type(client):
    resp = client.get("/api/incidents?crime_type=Vehicle Theft")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] > 0
    for item in data["results"]:
        assert item["crime_type"] == "Vehicle Theft"