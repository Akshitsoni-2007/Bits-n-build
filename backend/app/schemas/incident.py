from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.enums import District, CrimeType, IncidentStatus, IncidentPriority


class IncidentBase(BaseModel):
    fir_id: str
    date: date
    district: District
    crime_type: CrimeType
    hour: int = Field(ge=0, le=23)
    day_of_week: str
    is_weekend: bool
    latitude: float
    longitude: float
    description: str
    location_name: Optional[str] = None
    status: Optional[IncidentStatus] = None
    priority: Optional[IncidentPriority] = None


class Incident(IncidentBase):
    id: int

    class Config:
        from_attributes = True


class SummaryData(BaseModel):
    total_incidents: int
    by_district: List[dict]  # {district: str, count: int}
    by_crime_type: List[dict]  # {crime_type: str, count: int}
    by_hour: List[dict]  # {hour: int, count: int}
    by_month: List[dict]  # {month: str, count: int}
    weekend_pct: int
    night_pct: int


class IncidentsResponse(BaseModel):
    results: List[Incident]
    total: int
    page: int
    page_size: int