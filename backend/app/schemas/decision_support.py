from typing import List, Optional
from pydantic import BaseModel


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