def test_predict_risk(client):
    payload = {
        "state": "Maharashtra",
        "city": "Mumbai",
        "crime_type": "Cyber Fraud / Financial",
        "month": "November",
        "hour": 22,
        "is_weekend": True,
    }
    resp = client.post("/api/risk/predict", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "risk_score" in data
    assert "classification" in data
    assert "contributing_factors" in data
    assert isinstance(data["contributing_factors"], list)