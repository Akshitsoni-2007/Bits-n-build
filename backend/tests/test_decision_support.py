def test_decision_support_analyze(client):
    payload = {"state": "Maharashtra", "city": "Mumbai", "crime_type": "Vehicle Theft"}
    resp = client.post("/api/decision-support/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "pattern" in data
    assert "recommendation" in data
    assert "evidence" in data
    assert isinstance(data["evidence"], list)