from fastapi import APIRouter, HTTPException
from app.schemas.simulator import SimulatorRequest, SimulatorResponse

router = APIRouter(prefix="/api/simulator", tags=["simulator"])


@router.post("/run", response_model=SimulatorResponse)
def run_simulator(payload: SimulatorRequest):
    # Heuristic simulation matching frontend logic
    units = payload.current_allocation or 10
    scenario = (payload.scenario or "").lower()

    delta = 0.0
    response_delta = -1.2

    if any(k in scenario for k in ("hotspot", "transit", "night", "move")):
        delta = round(12.5 + min(units * 0.8, 18.0), 1)
        response_delta = -3.4
    elif any(k in scenario for k in ("perimeter", "checkpoint")):
        delta = round(8.2 + min(units * 0.5, 12.0), 1)
        response_delta = -2.1
    else:
        delta = round(4.5 + min(units * 0.4, 8.5), 1)
        response_delta = -1.5

    hotspot_ratio = round(min(0.94, 0.52 + (units / 40) + (delta / 100)), 2)

    return SimulatorResponse(
        estimated_coverage_change_pct=delta,
        estimated_response_time_delta_min=response_delta,
        hotspot_coverage_ratio=hotspot_ratio,
        operational_impact_notes=[
            f"Estimated response latency reduction by {abs(response_delta)} minutes in primary hotspot zones.",
            f"Spatial coverage index improved by +{delta}% over static baseline deployment.",
            "Zero adverse impact projected for secondary commercial zones during day cycles.",
        ],
    )