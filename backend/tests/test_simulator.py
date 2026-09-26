def test_simulator_run(client):
    payload = {"current_allocation": 10, "scenario": "move units to hotspot at night"}
    resp = client.post("/api/simulator/run", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "estimated_coverage_change_pct" in data
    assert "estimated_response_time_delta_min" in data
    assert "hotspot_coverage_ratio" in data
    assert "operational_impact_notes" in data
    assert isinstance(data["operational_impact_notes"], list)
    # values reasonable
    assert data["estimated_coverage_change_pct"] > 0
    assert data["estimated_response_time_delta_min"] < 0