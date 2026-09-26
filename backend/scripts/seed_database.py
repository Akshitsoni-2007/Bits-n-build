#!/usr/bin/env python3
"""
Seed the database with the initial mock incidents.
Also writes a JSON snapshot to data/incidents_seed.json for reference.
Run manually after tables exist:
    python scripts/seed_database.py
"""
import json
import sys
from datetime import date
from app.database import SessionLocal
from app.models.incident import Incident
from app.models.enums import District, CrimeType, IncidentStatus, IncidentPriority

# ----- Constants mirroring src/lib/mock-data.ts -----
DISTRICTS = [
    District.CENTRAL,
    District.NORTH,
    District.SOUTH,
    District.CYBER_CITY,
    District.WEST_OUTER,
    District.TECH_HUB,
    District.HARBOUR,
    District.EAST_DISTRICT,
]

CRIME_TYPES = [
    CrimeType.CYBER_FRAUD_FINANCIAL,
    CrimeType.VEHICLE_THEFT,
    CrimeType.BURGLARY_BREAKING_IN,
    CrimeType.ROBBERY_SNATCHING,
    CrimeType.ASSAULT_GRIEVOUS_HURT,
    CrimeType.NARCOTICS_NDPS,
    CrimeType.PUBLIC_NUISANCE_GAMBLING,
]

MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
]

DISTRICT_COORDS = {
    District.CENTRAL: (28.6328, 77.2197),
    District.NORTH: (28.6942, 77.2104),
    District.SOUTH: (28.5355, 77.2410),
    District.CYBER_CITY: (28.4900, 77.0880),
    District.WEST_OUTER: (28.6500, 77.0600),
    District.TECH_HUB: (28.4595, 77.0266),
    District.HARBOUR: (28.5800, 77.3100),
    District.EAST_DISTRICT: (28.6280, 77.2950),
}

# Base 26 incidents (copied from mock-data.ts)
BASE_INCIDENTS = [
    {
        "fir_id": "FIR-2024-08912",
        "date": "2024-11-14",
        "district": District.CYBER_CITY,
        "crime_type": CrimeType.CYBER_FRAUD_FINANCIAL,
        "hour": 23,
        "day_of_week": "Thursday",
        "is_weekend": False,
        "latitude": 28.4912,
        "longitude": 77.0894,
        "description": "Victim targeted via social engineering and cloned SIM request at late night, transferring unauthorized sum to mule account network.",
        "location_name": "Sector 29 Financial Enclave",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-08918",
        "date": "2024-11-15",
        "district": District.CYBER_CITY,
        "crime_type": CrimeType.CYBER_FRAUD_FINANCIAL,
        "hour": 2,
        "day_of_week": "Friday",
        "is_weekend": False,
        "latitude": 28.4880,
        "longitude": 77.0910,
        "description": "ATM skimming device detected at midnight with duplicate card clone attempts on multiple corporate payroll accounts.",
        "location_name": "Cyber Greens Tower B",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09004",
        "date": "2024-11-16",
        "district": District.NORTH,
        "crime_type": CrimeType.VEHICLE_THEFT,
        "hour": 22,
        "day_of_week": "Saturday",
        "is_weekend": True,
        "latitude": 28.6920,
        "longitude": 77.2130,
        "description": "Two-wheeler stolen from unlit residential perimeter parking using master key ignition bypass technique.",
        "location_name": "Model Town Ring Road",
        "status": IncidentStatus.PENDING_CHARGE,
        "priority": IncidentPriority.MEDIUM,
    },
    {
        "fir_id": "FIR-2024-09015",
        "date": "2024-11-16",
        "district": District.NORTH,
        "crime_type": CrimeType.ROBBERY_SNATCHING,
        "hour": 23,
        "day_of_week": "Saturday",
        "is_weekend": True,
        "latitude": 28.6955,
        "longitude": 77.2085,
        "description": "Two masked suspects on a dark motorcycle snatched handbag and smartphone from commuter near metro subway exit.",
        "location_name": "GTB Nagar Metro Gate 3",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09033",
        "date": "2024-11-17",
        "district": District.SOUTH,
        "crime_type": CrimeType.BURGLARY_BREAKING_IN,
        "hour": 3,
        "day_of_week": "Sunday",
        "is_weekend": True,
        "latitude": 28.5370,
        "longitude": 77.2435,
        "description": "Forced entry via rear alley window into commercial jewelry showroom during low-traffic predawn hours.",
        "location_name": "Greater Kailash Main Market",
        "status": IncidentStatus.COURT_TRIAL,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09048",
        "date": "2024-11-18",
        "district": District.CENTRAL,
        "crime_type": CrimeType.ROBBERY_SNATCHING,
        "hour": 19,
        "day_of_week": "Monday",
        "is_weekend": False,
        "latitude": 28.6340,
        "longitude": 77.2215,
        "description": "Gold chain snatched by pillion rider on motorcycle in crowded bazaar bottleneck during peak evening shopping transit.",
        "location_name": "Connaught Circle Inner Block",
        "status": IncidentStatus.CLOSED,
        "priority": IncidentPriority.MEDIUM,
    },
    {
        "fir_id": "FIR-2024-09062",
        "date": "2024-11-19",
        "district": District.TECH_HUB,
        "crime_type": CrimeType.CYBER_FRAUD_FINANCIAL,
        "hour": 14,
        "day_of_week": "Tuesday",
        "is_weekend": False,
        "latitude": 28.4610,
        "longitude": 77.0280,
        "description": "Phishing portal impersonating state electricity bill payment portal gathered OTP credentials from senior citizen.",
        "location_name": "DLF Cyber Park Sector 20",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.MEDIUM,
    },
    {
        "fir_id": "FIR-2024-09075",
        "date": "2024-11-20",
        "district": District.WEST_OUTER,
        "crime_type": CrimeType.VEHICLE_THEFT,
        "hour": 1,
        "day_of_week": "Wednesday",
        "is_weekend": False,
        "latitude": 28.6520,
        "longitude": 77.0580,
        "description": "Commercial delivery van hotwired and driven toward state border corridor with GPS tracker disabled.",
        "location_name": "Najafgarh Freight Terminal",
        "status": IncidentStatus.CLOSED,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09091",
        "date": "2024-11-21",
        "district": District.HARBOUR,
        "crime_type": CrimeType.NARCOTICS_NDPS,
        "hour": 21,
        "day_of_week": "Thursday",
        "is_weekend": False,
        "latitude": 28.5815,
        "longitude": 77.3120,
        "description": "Interception of contraband transit parcel hidden inside inter-state cargo consignment at logistics junction.",
        "location_name": "Noida-Okhla Freight Depot",
        "status": IncidentStatus.COURT_TRIAL,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09102",
        "date": "2024-11-22",
        "district": District.EAST_DISTRICT,
        "crime_type": CrimeType.ASSAULT_GRIEVOUS_HURT,
        "hour": 23,
        "day_of_week": "Friday",
        "is_weekend": False,
        "latitude": 28.6295,
        "longitude": 77.2970,
        "description": "Altercation between two groups near public night food stalls escalating to physical violence with blunt objects.",
        "location_name": "Laxmi Nagar Night Market",
        "status": IncidentStatus.PENDING_CHARGE,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09120",
        "date": "2024-11-23",
        "district": District.CENTRAL,
        "crime_type": CrimeType.PUBLIC_NUISANCE_GAMBLING,
        "hour": 20,
        "day_of_week": "Saturday",
        "is_weekend": True,
        "latitude": 28.6310,
        "longitude": 77.2180,
        "description": "Unauthorized underground sports betting syndicate running inside basement club; equipment seized.",
        "location_name": "Paharganj Alley 4",
        "status": IncidentStatus.CLOSED,
        "priority": IncidentPriority.LOW,
    },
    {
        "fir_id": "FIR-2024-09134",
        "date": "2024-11-23",
        "district": District.NORTH,
        "crime_type": CrimeType.ROBBERY_SNATCHING,
        "hour": 22,
        "day_of_week": "Saturday",
        "is_weekend": True,
        "latitude": 28.6970,
        "longitude": 77.2110,
        "description": "Black motorcycle without registration plate intercepted pedestrian near park boundary and grabbed mobile device.",
        "location_name": "Civil Lines Northern Ridge",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09148",
        "date": "2024-11-24",
        "district": District.CYBER_CITY,
        "crime_type": CrimeType.CYBER_FRAUD_FINANCIAL,
        "hour": 16,
        "day_of_week": "Sunday",
        "is_weekend": True,
        "latitude": 28.4890,
        "longitude": 77.0870,
        "description": "Remote screen sharing malware application installed under guise of technical support for banking app update.",
        "location_name": "Golf Course Road Sector 43",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09160",
        "date": "2024-11-25",
        "district": District.SOUTH,
        "crime_type": CrimeType.VEHICLE_THEFT,
        "hour": 4,
        "day_of_week": "Monday",
        "is_weekend": False,
        "latitude": 28.5340,
        "longitude": 77.2390,
        "description": "Luxury SUV stolen using electronic key frequency repeater attack from residential driveway.",
        "location_name": "Vasant Vihar Block C",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09172",
        "date": "2024-11-26",
        "district": District.WEST_OUTER,
        "crime_type": CrimeType.BURGLARY_BREAKING_IN,
        "hour": 2,
        "day_of_week": "Tuesday",
        "is_weekend": False,
        "latitude": 28.6480,
        "longitude": 77.0620,
        "description": "Lock tampering and shutter shuttering at electronics warehouse; inventory taken in unmarked pickup truck.",
        "location_name": "Janakpuri District Centre",
        "status": IncidentStatus.PENDING_CHARGE,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09185",
        "date": "2024-11-27",
        "district": District.EAST_DISTRICT,
        "crime_type": CrimeType.VEHICLE_THEFT,
        "hour": 23,
        "day_of_week": "Wednesday",
        "is_weekend": False,
        "latitude": 28.6270,
        "longitude": 77.2930,
        "description": "Sedan vehicle lifted from unmonitored hospital outdoor parking lot during night shift hours.",
        "location_name": "Mayur Vihar Phase 1",
        "status": IncidentStatus.CLOSED,
        "priority": IncidentPriority.MEDIUM,
    },
    {
        "fir_id": "FIR-2024-09199",
        "date": "2024-11-28",
        "district": District.CENTRAL,
        "crime_type": CrimeType.CYBER_FRAUD_FINANCIAL,
        "hour": 11,
        "day_of_week": "Thursday",
        "is_weekend": False,
        "latitude": 28.6350,
        "longitude": 77.2230,
        "description": "Fake investment crypto portal promising 30% daily returns defrauded retail investor of funds.",
        "location_name": "Barakhamba Road Plaza",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.MEDIUM,
    },
    {
        "fir_id": "FIR-2024-09210",
        "date": "2024-11-29",
        "district": District.TECH_HUB,
        "crime_type": CrimeType.ASSAULT_GRIEVOUS_HURT,
        "hour": 22,
        "day_of_week": "Friday",
        "is_weekend": False,
        "latitude": 28.4580,
        "longitude": 77.0250,
        "description": "Road rage incident following vehicle collision resulting in physical altercation and bodily injury.",
        "location_name": "Sohna Road Expressway Junction",
        "status": IncidentStatus.COURT_TRIAL,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09225",
        "date": "2024-11-30",
        "district": District.NORTH,
        "crime_type": CrimeType.VEHICLE_THEFT,
        "hour": 3,
        "day_of_week": "Saturday",
        "is_weekend": True,
        "latitude": 28.6960,
        "longitude": 77.2120,
        "description": "Multiple motorcycles stolen in single night from metro parking lot with clipped perimeter chain.",
        "location_name": "Vishwa Vidyalaya Metro Complex",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09238",
        "date": "2024-12-01",
        "district": District.SOUTH,
        "crime_type": CrimeType.NARCOTICS_NDPS,
        "hour": 0,
        "day_of_week": "Sunday",
        "is_weekend": True,
        "latitude": 28.5360,
        "longitude": 77.2420,
        "description": "Raid on private farmhouse party resulting in seizure of synthetic narcotics and unregistered imported alcohol.",
        "location_name": "Chattarpur Farm Zone",
        "status": IncidentStatus.PENDING_CHARGE,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09250",
        "date": "2024-12-02",
        "district": District.HARBOUR,
        "crime_type": CrimeType.BURGLARY_BREAKING_IN,
        "hour": 4,
        "day_of_week": "Monday",
        "is_weekend": False,
        "latitude": 28.5790,
        "longitude": 77.3080,
        "description": "Commercial godown shutter lock cut using gas torch; copper coils and industrial cables removed.",
        "location_name": "Okhla Industrial Area Phase 2",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.MEDIUM,
    },
    {
        "fir_id": "FIR-2024-09264",
        "date": "2024-12-03",
        "district": District.CYBER_CITY,
        "crime_type": CrimeType.CYBER_FRAUD_FINANCIAL,
        "hour": 15,
        "day_of_week": "Tuesday",
        "is_weekend": False,
        "latitude": 28.4920,
        "longitude": 77.0860,
        "description": "Corporate email compromise (CEO fraud) directing wire transfer change of vendor banking details.",
        "location_name": "Udyog Vihar Phase 4",
        "status": IncidentStatus.UNDER_INVESTIGATION,
        "priority": IncidentPriority.HIGH,
    },
    {
        "fir_id": "FIR-2024-09277",
        "date": "2024-12-04",
        "district": District.EAST_DISTRICT,
        "crime_type": CrimeType.ROBBERY_SNATCHING,
        "hour": 21,
        "day_of_week": "Wednesday",
        "is_weekend": False,
        "latitude": 28.6260,
        "longitude": 77.2980,
        "description": "Purse snatching outside vegetable market by motorcycle riders fleeing into narrow bypass lanes.",
        "location_name": "Patparganj Residential Colony",
        "status": IncidentStatus.CLOSED,
        "priority": IncidentPriority.LOW,
    },
    {
        "fir_id": "FIR-2024-09289",
        "date": "2024-12-05",
        "district": District.WEST_OUTER,
        "crime_type": CrimeType.PUBLIC_NUISANCE_GAMBLING,
        "hour": 23,
        "day_of_week": "Thursday",
        "is_weekend": False,
        "latitude": 28.6530,
        "longitude": 77.0630,
        "description": "Open drinking and noise disturbance resulting in public brawl outside highway commercial complex.",
        "location_name": "Dwarka Expressway Toll Sector 108",
        "status": IncidentStatus.CLOSED,
        "priority": IncidentPriority.LOW,
    },
    {
        "fir_id": "FIR-2024-09301",
        "date": "2024-12-06",
        "district": District.CENTRAL,
        "crime_type": CrimeType.VEHICLE_THEFT,
        "hour": 20,
        "day_of_week": "Friday",
        "is_weekend": False,
        "latitude": 28.6320,
        "longitude": 77.2190,
        "description": "Parked motorcycle lifted from unattended street near railway reservation counter.",
        "location_name": "New Delhi Station Ajmeri Gate",
        "status": IncidentStatus.PENDING_CHARGE,
        "priority": IncidentPriority.MEDIUM,
    },
]

ADDITIONAL_DESCRIPTIONS = [
    "Motorcycle snatching targeting pedestrian walking near dark arterial transit hub.",
    "Unlawful entry into locked retail shop overnight, cash register emptied.",
    "Online task-based part-time job scam siphoning payments via UPI QR code.",
    "Vehicle broken into and laptop bag removed from backseat after window smash.",
    "Street brawl between transport operators over parking queue rights.",
    "Narcotics distribution parcel seized during routine vehicle checkpoint inspection.",
    "Illegal betting operation running through encrypted instant messaging channels.",
    "Stolen luxury scooter dismantled for spare parts in local garage.",
    "SIM swap fraud initiated via compromised telecommunications vendor portal.",
    "Pedestrian intercepted at knife-point near pedestrian underpass at late hour.",
]

def generate_additional_incidents(start_idx=26, total=65):
    incidents = []
    for i in range(start_idx, total + 1):
        district = DISTRICTS[i % len(DISTRICTS)]
        crime_type = CRIME_TYPES[(i * 3) % len(CRIME_TYPES)]
        hour = (i * 7) % 24
        is_weekend = i % 3 == 0
        base_lat, base_lng = DISTRICT_COORDS[district]
        lat_offset = ((i % 7) - 3) * 0.005
        lng_offset = (((i + 2) % 7) - 3) * 0.005

        # day_of_week
        if is_weekend:
            day_of_week = "Saturday" if i % 2 == 0 else "Sunday"
        else:
            day_of_week = ["Monday","Tuesday","Wednesday","Thursday","Friday"][i % 5]

        month = (i % 12) + 1
        day = (i % 27) + 1
        fir_id = f"FIR-2024-09{300 + i}"
        date_str = f"2024-{month:02d}-{day:02d}"
        description = ADDITIONAL_DESCRIPTIONS[i % len(ADDITIONAL_DESCRIPTIONS)]
        location_name = f"{district.value} Sector {10 + (i % 30)} Corridor"
        status_cycle = [IncidentStatus.UNDER_INVESTIGATION, IncidentStatus.PENDING_CHARGE, IncidentStatus.CLOSED, IncidentStatus.COURT_TRIAL]
        status = status_cycle[i % 4]
        priority = IncidentPriority.HIGH if (hour >= 22 or hour <= 4) else (IncidentPriority.MEDIUM if i % 2 == 0 else IncidentPriority.LOW)

        incidents.append({
            "fir_id": fir_id,
            "date": date_str,
            "district": district,
            "crime_type": crime_type,
            "hour": hour,
            "day_of_week": day_of_week,
            "is_weekend": is_weekend,
            "latitude": round(base_lat + lat_offset, 4),
            "longitude": round(base_lng + lng_offset, 4),
            "description": description,
            "location_name": location_name,
            "status": status,
            "priority": priority,
        })
    return incidents


def build_all_incidents():
    all_inc = BASE_INCIDENTS.copy()
    all_inc.extend(generate_additional_incidents())
    return all_inc


def write_seed_json(incidents, path="data/incidents_seed.json"):
    serializable = []
    for inc in incidents:
        d = inc.copy()
        d["date"] = inc["date"]
        d["district"] = inc["district"].value
        d["crime_type"] = inc["crime_type"].value
        d["status"] = inc["status"].value if inc["status"] else None
        d["priority"] = inc["priority"].value if inc["priority"] else None
        serializable.append(d)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(serializable, f, ensure_ascii=False, indent=2)
    print(f"🗂️  Seed JSON written to {path} ({len(serializable)} records)")


def seed_database():
    incidents_data = build_all_incidents()
    write_seed_json(incidents_data)

    db = SessionLocal()
    try:
        existing = db.query(Incident).count()
        if existing:
            print(f"⚠️  Database already contains {existing} incidents. Skipping insert.")
            return

        db_objs = [
            Incident(
                fir_id=inc["fir_id"],
                date=date.fromisoformat(inc["date"]),
                district=inc["district"],
                crime_type=inc["crime_type"],
                hour=inc["hour"],
                day_of_week=inc["day_of_week"],
                is_weekend=inc["is_weekend"],
                latitude=inc["latitude"],
                longitude=inc["longitude"],
                description=inc["description"],
                location_name=inc["location_name"],
                status=inc["status"],
                priority=inc["priority"],
            )
            for inc in incidents_data
        ]
        db.bulk_save_objects(db_objs)
        db.commit()
        print(f"✅ Inserted {len(db_objs)} incidents into database.")
    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()