def test_predict_risk_missing_model(client):
    payload = {
        "district": "Cyber City",
        "crime_type": "Cyber Fraud / Financial",
        "month": "November",
        "hour": 22,
        "is_weekend": True,
    }
    resp = client.post("/api/risk/predict", json=payload)
    # Should be 503 because model not trained in test env
    assert resp.status_code == 503
    assert "not trained" in resp.json()["detail"].lower()