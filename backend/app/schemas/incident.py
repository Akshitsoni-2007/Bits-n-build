from typing import List, Optional, Any
from pydantic import BaseModel, Field

class IncidentItem(BaseModel):
    fir_id: str
    date: str
    state: str
    city: str
    district: Optional[str] = None # Alias/compat field
    crime_type: str
    hour: int = Field(ge=0, le=23)
    day_of_week: str
    is_weekend: bool
    latitude: float
    longitude: float
    description: str
    location_name: Optional[str] = None
    status: Optional[str] = "UNDER INVESTIGATION"
    priority: Optional[str] = "MEDIUM"

# Alias for backward import compatibility
Incident = IncidentItem


class SummaryData(BaseModel):
    total_incidents: int
    by_state: List[dict] = [] # [{state: str, count: int}]
    by_city: List[dict] = []  # [{city: str, count: int}]
    by_district: List[dict] = [] # [{district: str, count: int}] (alias for frontend compat)
    by_crime_type: List[dict] = [] # [{crime_type: str, count: int}]
    by_hour: List[dict] = [] # [{hour: int, count: int}]
    by_month: List[dict] = [] # [{month: str, count: int}]
    weekend_pct: int
    night_pct: int


class IncidentsResponse(BaseModel):
    results: List[IncidentItem]
    total: int
    page: int
    page_size: int