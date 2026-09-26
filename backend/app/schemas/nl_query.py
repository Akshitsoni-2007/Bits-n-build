from typing import List, Optional, Literal
from pydantic import BaseModel
from app.schemas.incident import Incident


class ParsedFilters(BaseModel):
    district: Optional[str] = None
    crime_type: Optional[str] = None
    day_type: Optional[Literal["weekend", "weekday"]] = None
    hour_min: Optional[int] = None
    hour_max: Optional[int] = None
    time_of_day: Optional[Literal["morning", "afternoon", "evening", "night"]] = None
    keyword: Optional[str] = None


class NLQueryRequest(BaseModel):
    query: str


class NLQueryResponse(BaseModel):
    parsed_filters: ParsedFilters
    results: List[Incident]
    interpretation_summary: Optional[str] = None
    matched_count: Optional[int] = None