from enum import Enum


class District(str, Enum):
    CENTRAL = "Central"
    NORTH = "North"
    SOUTH = "South"
    CYBER_CITY = "Cyber City"
    WEST_OUTER = "West Outer"
    TECH_HUB = "Tech Hub"
    HARBOUR = "Harbour"
    EAST_DISTRICT = "East District"


class CrimeType(str, Enum):
    CYBER_FRAUD_FINANCIAL = "Cyber Fraud / Financial"
    VEHICLE_THEFT = "Vehicle Theft"
    BURGLARY_BREAKING_IN = "Burglary / Breaking-in"
    ROBBERY_SNATCHING = "Robbery / Snatching"
    ASSAULT_GRIEVOUS_HURT = "Assault / Grievous Hurt"
    NARCOTICS_NDPS = "Narcotics / NDPS"
    PUBLIC_NUISANCE_GAMBLING = "Public Nuisance & Gambling"


class IncidentStatus(str, Enum):
    CLOSED = "CLOSED"
    UNDER_INVESTIGATION = "UNDER INVESTIGATION"
    PENDING_CHARGE = "PENDING CHARGE"
    COURT_TRIAL = "COURT TRIAL"


class IncidentPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RiskClassification(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    MODERATE_HIGH = "MODERATE-HIGH"
    HIGH = "HIGH"