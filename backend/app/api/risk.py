from fastapi import APIRouter, Depends, HTTPException
from app.schemas.risk import PredictRiskRequest, PredictRiskResponse
from app.services.risk_model import RiskModelService

router = APIRouter(prefix="/api/risk", tags=["risk"])

_risk_service = None


def get_risk_service() -> RiskModelService:
    global _risk_service
    if _risk_service is None:
        _risk_service = RiskModelService()
    return _risk_service


@router.post("/predict", response_model=PredictRiskResponse)
def predict_risk(
    payload: PredictRiskRequest,
    risk_service: RiskModelService = Depends(get_risk_service),
):
    try:
        response = risk_service.predict(payload)
        return response
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="Risk model not trained. Run training script first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk prediction failed: {e}")