def test_dna_matcher_missing_vectorizer(client):
    payload = {"narrative": "motorcycle snatching at night"}
    resp = client.post("/api/dna-matcher/search", json=payload)
    assert resp.status_code == 503
    assert "not fitted" in resp.json()["detail"].lower()