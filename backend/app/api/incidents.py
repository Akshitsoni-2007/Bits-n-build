from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict
from app.services.data_service import get_data_service
from app.schemas.incident import SummaryData, IncidentsResponse

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("/summary", response_model=SummaryData)
def get_summary(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    district: Optional[str] = Query(None), # Fallback parameter
    crime_type: Optional[str] = Query(None),
):
    service = get_data_service()
    summary = service.get_summary(
        state=state,
        city=city,
        crime_type=crime_type,
        district=district,
    )
    return summary


@router.get("", response_model=IncidentsResponse)
def list_incidents(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    district: Optional[str] = Query(None), # Fallback parameter
    crime_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    service = get_data_service()
    results, total = service.get_incidents(
        state=state,
        city=city,
        crime_type=crime_type,
        district=district,
        page=page,
        page_size=page_size,
    )
    return IncidentsResponse(
        results=results,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/locations")
def get_locations() -> Dict[str, List[str]]:
    service = get_data_service()
    return service.get_states_and_cities()