from typing import List, Optional
from pydantic import BaseModel

class SimulatorRequest(BaseModel):
    current_allocation: int
    scenario: str
    focus_state: Optional[str] = None
    focus_city: Optional[str] = None
    focus_district: Optional[str] = None # Fallback compatibility
    shift_focus: Optional[str] = None


class SimulatorResponse(BaseModel):
    estimated_coverage_change_pct: float
    estimated_response_time_delta_min: Optional[float] = None
    hotspot_coverage_ratio: Optional[float] = None
    operational_impact_notes: Optional[List[str]] = None