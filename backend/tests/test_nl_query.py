def test_nl_query_valid(client, seed_incidents):
    payload = {"query": "show cyber fraud in cyber city"}
    resp = client.post("/api/nl-query", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "parsed_filters" in data
    assert "results" in data
    assert isinstance(data["results"], list)


def test_nl_query_invalid_json_fallback(client):
    # LLM not configured, should fallback to empty filters and return all incidents
    payload = {"query": "some random query"}
    resp = client.post("/api/nl-query", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "parsed_filters" in data
    # Should have results (since empty filters)
    assert "results" in data