from typing import List, Optional
from pydantic import BaseModel, Field

class PredictRiskRequest(BaseModel):
    state: Optional[str] = "Maharashtra"
    city: Optional[str] = "Mumbai"
    district: Optional[str] = None # Fallback compatibility
    crime_type: str
    month: str
    hour: int = Field(ge=0, le=23)
    is_weekend: bool


class ContributingFactor(BaseModel):
    factor: str
    pct_contribution: float
    direction: Optional[str] = None  # "positive" | "negative"
    description: Optional[str] = None


class PredictRiskResponse(BaseModel):
    risk_score: int = Field(ge=0, le=100)
    classification: str # "LOW" | "MODERATE" | "MODERATE-HIGH" | "HIGH"
    contributing_factors: List[ContributingFactor]
    confidence_interval: Optional[str] = None
    baseline_comparison: Optional[str] = None