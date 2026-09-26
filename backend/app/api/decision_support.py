from fastapi import APIRouter, Depends, HTTPException
from app.schemas.decision_support import DecisionSupportResponse
from app.services.decision_engine import DecisionEngine

router = APIRouter(prefix="/api/decision-support", tags=["decision-support"])

_engine = None

def get_engine() -> DecisionEngine:
    global _engine
    if _engine is None:
        _engine = DecisionEngine()
    return _engine


@router.post("/analyze", response_model=DecisionSupportResponse)
def analyze_decision_support(
    payload: dict,  # {state?, city?, district?, crime_type?}
    engine: DecisionEngine = Depends(get_engine),
):
    state = payload.get("state")
    city = payload.get("city")
    district = payload.get("district")
    crime_type = payload.get("crime_type")

    try:
        response = engine.analyze(state=state, city=city, district=district, crime_type=crime_type)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision support analysis failed: {e}")