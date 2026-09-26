from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
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
    payload: dict,  # {district?, crime_type?}
    db: Session = Depends(get_db),
    engine: DecisionEngine = Depends(get_engine),
):
    district = payload.get("district")
    crime_type = payload.get("crime_type")

    try:
        response = engine.analyze(db, district, crime_type)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decision support analysis failed")