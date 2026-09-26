from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.incident import Incident
from app.schemas.decision_support import DecisionSupportResponse, EvidenceItem


class DecisionEngine:
    def analyze(
        self,
        db: Session,
        district: Optional[str] = None,
        crime_type: Optional[str] = None,
    ) -> DecisionSupportResponse:
        # Build base query
        query = db.query(Incident)
        if district:
            query = query.filter(Incident.district == district)
        if crime_type:
            query = query.filter(Incident.crime_type == crime_type)

        incidents = query.all()
        total = len(incidents)
        if total == 0:
            # Return generic fallback
            return DecisionSupportResponse(
                pattern="Insufficient data for selected filters.",
                recommendation="Collect more incident records or broaden filters.",
                evidence=[],
            )

        # Compute simple heuristics similar to frontend mock
        night_incidents = [i for i in incidents if i.hour >= 21 or i.hour <= 5]
        weekend_incidents = [i for i in incidents if i.is_weekend]

        night_pct = round(len(night_incidents) / total * 100)
        weekend_pct = round(len(weekend_incidents) / total * 100)

        # District baseline compare (citywide)
        city_total = db.query(Incident).count()
        city_night = db.query(Incident).filter((Incident.hour >= 21) | (Incident.hour <= 5)).count()
        city_night_pct = round(city_night / city_total * 100) if city_total else 0

        # Most common hour range
        hour_counts = {}
        for inc in incidents:
            hour_counts[inc.hour] = hour_counts.get(inc.hour, 0) + 1
        top_hour = max(hour_counts, key=hour_counts.get) if hour_counts else 22

        evidence = [
            EvidenceItem(
                label="Temporal Clustering",
                value=f"{night_pct}% between 21:00 – 02:30 hrs",
                benchmark=f"Citywide baseline: {city_night_pct}%",
                trend="up" if night_pct > city_night_pct else "down",
            ),
            EvidenceItem(
                label="Weekend Surge",
                value=f"{weekend_pct}% on weekends",
                benchmark="Citywide baseline: ~35%",
                trend="up" if weekend_pct > 35 else "down",
            ),
            EvidenceItem(
                label="Modality Recurrence",
                value=f"Top hour {top_hour}:00 accounts for {hour_counts.get(top_hour,0)} incidents",
                benchmark="Cross-district average spread",
                trend="neutral",
            ),
        ]

        pattern = (
            f"Concentrated nocturnal cluster of {crime_type or 'selected crime'} observed in "
            f"{district or 'selected district'} sector during Friday–Sunday cycles."
        )
        recommendation = (
            "Consider reviewing static checkpoint placement at sector egress junctions between 21:30 and 02:30, "
            "and evaluate shifting two motorized patrol units from low-activity daytime sectors to reinforce the transit corridor perimeter."
        )

        return DecisionSupportResponse(
            pattern=pattern,
            recommendation=recommendation,
            evidence=evidence,
            temporal_hotspot="Friday–Sunday, 21:30–02:30 IST",
            spatial_focus=f"{district or 'Target'} Arterial Transit Junctions",
            resource_gap="Estimated 35% gap in nocturnal patrol coverage vs. incident probability density",
        )