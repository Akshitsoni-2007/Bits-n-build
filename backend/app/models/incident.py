from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Boolean,
    Float,
    Enum as SQLEnum,
    Index,
)
from sqlalchemy.dialects.mysql import VARCHAR
from app.database import Base
from app.models.enums import (
    District,
    CrimeType,
    IncidentStatus,
    IncidentPriority,
)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fir_id = Column(VARCHAR(50), unique=True, nullable=False, index=True)
    date = Column(Date, nullable=False)
    district = Column(SQLEnum(District, native_enum=False), nullable=False)
    crime_type = Column(SQLEnum(CrimeType, native_enum=False), nullable=False)
    hour = Column(Integer, nullable=False)
    day_of_week = Column(VARCHAR(20), nullable=False)
    is_weekend = Column(Boolean, nullable=False, default=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(VARCHAR(2000), nullable=False)
    location_name = Column(VARCHAR(200), nullable=True)
    status = Column(SQLEnum(IncidentStatus, native_enum=False), nullable=True)
    priority = Column(SQLEnum(IncidentPriority, native_enum=False), nullable=True)

    __table_args__ = (
        Index("ix_incidents_district_crime_type", "district", "crime_type"),
        Index("ix_incidents_date", "date"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"},
    )