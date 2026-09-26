from typing import List, Optional
from pydantic import BaseModel

class DNAMatch(BaseModel):
    fir_id: str
    similarity: float
    state: Optional[str] = None
    city: Optional[str] = None
    district: str # Keep for compatibility (e.g. "Mumbai, Maharashtra")
    crime_type: str
    time: str
    matched_characteristics: List[str]
    snippet: Optional[str] = None
    date: Optional[str] = None


class DNAMatcherResponse(BaseModel):
    matches: List[DNAMatch]