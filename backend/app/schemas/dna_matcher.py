from typing import List, Optional
from pydantic import BaseModel


class DNAMatch(BaseModel):
    fir_id: str
    similarity: float
    district: str
    crime_type: str
    time: str
    matched_characteristics: List[str]
    snippet: Optional[str] = None
    date: Optional[str] = None


class DNAMatcherResponse(BaseModel):
    matches: List[DNAMatch]