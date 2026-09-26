from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import Optional, List
from app.database import get_db
from app.models.incident import Incident
from app.schemas.incident import SummaryData, IncidentsResponse, Incident
from datetime import date

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("/summary", response_model=SummaryData)
def get_summary(
    district: Optional[str] = Query(None),
    crime_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Incident)

    if district:
        query = query.filter(Incident.district == district)
    if crime_type:
        query = query.filter(Incident.crime_type == crime_type)

    incidents = query.all()
    total = len(incidents)

    # Aggregations
    district_counts = {}
    crime_type_counts = {}
    hour_counts = {h: 0 for h in range(24)}
    month_counts = {m: 0 for m in range(1, 13)}
    weekend_cnt = 0
    night_cnt = 0

    for inc in incidents:
        district_counts[inc.district.value] = district_counts.get(inc.district.value, 0) + 1
        crime_type_counts[inc.crime_type.value] = crime_type_counts.get(inc.crime_type.value, 0) + 1
        hour_counts[inc.hour] = hour_counts.get(inc.hour, 0) + 1
        month = inc.date.month
        month_counts[month] = month_counts.get(month, 0) + 1
        if inc.is_weekend:
            weekend_cnt += 1
        if inc.hour >= 20 or inc.hour <= 5:
            night_cnt += 1

    by_district = [{"district": d, "count": c} for d, c in district_counts.items()]
    by_crime_type = [{"crime_type": ct, "count": c} for ct, c in crime_type_counts.items()]
    by_hour = [{"hour": h, "count": hour_counts[h]} for h in range(24)]
    month_names = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ]
    by_month = [{"month": month_names[m-1], "count": month_counts[m]} for m in range(1,13)]

    return SummaryData(
        total_incidents=total,
        by_district=by_district,
        by_crime_type=by_crime_type,
        by_hour=by_hour,
        by_month=by_month,
        weekend_pct=round((weekend_cnt / total) * 100) if total else 0,
        night_pct=round((night_cnt / total) * 100) if total else 0,
    )


@router.get("", response_model=IncidentsResponse)
def list_incidents(
    district: Optional[str] = Query(None),
    crime_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Incident)

    if district:
        query = query.filter(Incident.district == district)
    if crime_type:
        query = query.filter(Incident.crime_type == crime_type)

    total = query.count()
    results = query.order_by(Incident.date.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return IncidentsResponse(
        results=results,
        total=total,
        page=page,
        page_size=page_size,
    )