from typing import List, Optional, Literal
from pydantic import BaseModel

class DecisionSupportRequest(BaseModel):
    state: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None # Fallback compatibility
    crime_type: Optional[str] = None


class EvidenceItem(BaseModel):
    label: str
    value: str
    benchmark: Optional[str] = None
    trend: Optional[Literal["up", "down", "neutral"]] = None


class DecisionSupportResponse(BaseModel):
    pattern: str
    recommendation: str
    evidence: List[EvidenceItem]
    temporal_hotspot: Optional[str] = None
    spatial_focus: Optional[str] = None
    resource_gap: Optional[str] = None