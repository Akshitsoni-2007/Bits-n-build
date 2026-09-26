def test_dna_matcher_search(client):
    payload = {"narrative": "motorcycle snatching near metro exit at night"}
    resp = client.post("/api/dna-matcher/search", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "matches" in data
    assert isinstance(data["matches"], list)
    assert len(data["matches"]) > 0