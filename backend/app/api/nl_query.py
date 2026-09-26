from fastapi import APIRouter, Depends
from app.services.data_service import get_data_service
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
    parser: NLParserService = Depends(get_parser_service),
):
    try:
        parsed = parser.parse(payload.query)
    except Exception:
        parsed = parser.empty_filters()

    service = get_data_service()
    
    # Filter incidents using DataService
    incidents, total = service.get_incidents(
        state=parsed.state,
        city=parsed.city,
        district=parsed.district,
        crime_type=parsed.crime_type,
        page=1,
        page_size=15,
    )

    # Apply secondary filters if present
    if parsed.day_type == "weekend":
        incidents = [i for i in incidents if i["is_weekend"]]
    elif parsed.day_type == "weekday":
        incidents = [i for i in incidents if not i["is_weekend"]]

    if parsed.time_of_day == "night":
        incidents = [i for i in incidents if i["hour"] >= 21 or i["hour"] <= 5]
    elif parsed.hour_min is not None and parsed.hour_max is not None:
        incidents = [i for i in incidents if parsed.hour_min <= i["hour"] <= parsed.hour_max]

    return NLQueryResponse(
        parsed_filters=parsed,
        results=incidents,
        interpretation_summary=f"Structured translation extracted active parametric constraints against CSV dataset.",
        matched_count=len(incidents),
    )