from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.schemas.nl_query import NLQueryRequest, NLQueryResponse
from app.services.nl_parser import NLParserService

router = APIRouter(prefix="/api/nl-query", tags=["nl-query"])

_parser_service = None


def get_parser_service() -> NLParserService:
    global _parser_service
    if _parser_service is None:
        _parser_service = NLParserService()
    return _parser_service


@router.post("", response_model=NLQueryResponse)
def nl_query(
    payload: NLQueryRequest,
    db: Session = Depends(get_db),
    parser: NLParserService = Depends(get_parser_service),
):
    try:
        parsed = parser.parse(payload.query)
    except Exception:
        # fallback empty filters
        parsed = parser.empty_filters()

    # Build SQLAlchemy query from validated filters
    query = db.query(Incident)

    if parsed.district:
        query = query.filter(Incident.district == parsed.district)
    if parsed.crime_type:
        query = query.filter(Incident.crime_type == parsed.crime_type)
    if parsed.day_type == "weekend":
        query = query.filter(Incident.is_weekend == True)
    elif parsed.day_type == "weekday":
        query = query.filter(Incident.is_weekend == False)

    if parsed.time_of_day == "night":
        query = query.filter((Incident.hour >= 21) | (Incident.hour <= 5))
    elif parsed.hour_min is not None and parsed.hour_max is not None:
        query = query.filter(Incident.hour.between(parsed.hour_min, parsed.hour_max))

    results = query.limit(15).all()

    return NLQueryResponse(
        parsed_filters=parsed,
        results=results,
        interpretation_summary=f"Structured translation extracted {sum(1 for v in parsed.model_dump().values() if v)} active parametric constraints against historical dataset.",
        matched_count=len(results),
    )