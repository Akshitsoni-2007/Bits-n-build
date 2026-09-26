import os
import pandas as pd
from typing import List, Dict, Any, Optional, Tuple
from app.config import get_settings

REQUIRED_COLUMNS = [
    "fir_id",
    "date",
    "state",
    "city",
    "crime_type",
    "hour",
    "day_of_week",
    "is_weekend",
    "latitude",
    "longitude",
    "description",
]

MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

FULL_MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

class DataService:
    def __init__(self, csv_path: Optional[str] = None):
        settings = get_settings()
        self.csv_path = csv_path or settings.DATA_CSV_PATH
        self.df: pd.DataFrame = pd.DataFrame()
        self.load_csv()

    def load_csv(self):
        if not os.path.exists(self.csv_path):
            alt_paths = [
                os.path.join(os.path.dirname(__file__), "../../data/incidents.csv"),
                os.path.join(os.path.dirname(__file__), "../../../backend/data/incidents.csv"),
                "backend/data/incidents.csv",
                "data/incidents.csv",
            ]
            found = False
            for p in alt_paths:
                if os.path.exists(p):
                    self.csv_path = p
                    found = True
                    break
            if not found:
                raise FileNotFoundError(
                    f"Dataset CSV not found at '{self.csv_path}'. Please ensure 'backend/data/incidents.csv' exists."
                )

        try:
            self.df = pd.read_csv(self.csv_path)
        except Exception as e:
            raise ValueError(f"Failed to parse CSV dataset at '{self.csv_path}': {e}")

        missing = [col for col in REQUIRED_COLUMNS if col not in self.df.columns]
        if missing:
            raise ValueError(
                f"CSV dataset at '{self.csv_path}' is missing required columns: {missing}"
            )

        self.df["hour"] = pd.to_numeric(self.df["hour"], errors="coerce").fillna(0).astype(int)
        self.df["latitude"] = pd.to_numeric(self.df["latitude"], errors="coerce").fillna(0.0).astype(float)
        self.df["longitude"] = pd.to_numeric(self.df["longitude"], errors="coerce").fillna(0.0).astype(float)
        
        if self.df["is_weekend"].dtype == object:
            self.df["is_weekend"] = self.df["is_weekend"].astype(str).str.lower().isin(["true", "1", "t", "yes"])
        else:
            self.df["is_weekend"] = self.df["is_weekend"].astype(bool)

        for col in ["fir_id", "date", "state", "city", "crime_type", "day_of_week", "description"]:
            self.df[col] = self.df[col].fillna("").astype(str)

        if "location_name" not in self.df.columns:
            self.df["location_name"] = self.df["city"] + " Central"
        else:
            self.df["location_name"] = self.df["location_name"].fillna(self.df["city"])

        if "status" not in self.df.columns:
            self.df["status"] = "UNDER INVESTIGATION"

        if "priority" not in self.df.columns:
            self.df["priority"] = "MEDIUM"

        print(f"[OK] Loaded {len(self.df)} incident records from '{self.csv_path}' into memory.")

    def _filter_df(
        self,
        state: Optional[str] = None,
        city: Optional[str] = None,
        crime_type: Optional[str] = None,
        district: Optional[str] = None,
    ) -> pd.DataFrame:
        filtered = self.df.copy()

        target_state = state or (district if district and district in self.df["state"].values else None)
        target_city = city or (district if district and district in self.df["city"].values else None)

        if target_state:
            filtered = filtered[filtered["state"].str.lower() == target_state.lower()]
        if target_city:
            filtered = filtered[filtered["city"].str.lower() == target_city.lower()]
        if crime_type:
            filtered = filtered[filtered["crime_type"].str.lower() == crime_type.lower()]

        return filtered

    def get_summary(
        self,
        state: Optional[str] = None,
        city: Optional[str] = None,
        crime_type: Optional[str] = None,
        district: Optional[str] = None,
    ) -> Dict[str, Any]:
        df = self._filter_df(state=state, city=city, crime_type=crime_type, district=district)
        total = len(df)

        if total == 0:
            return {
                "total_incidents": 0,
                "by_state": [],
                "by_city": [],
                "by_district": [],
                "by_crime_type": [],
                "by_hour": [{"hour": h, "count": 0} for h in range(24)],
                "by_month": [{"month": m, "count": 0} for m in MONTH_NAMES],
                "weekend_pct": 0,
                "night_pct": 0,
            }

        state_counts = df["state"].value_counts().to_dict()
        by_state = [{"state": s, "district": s, "count": int(c)} for s, c in state_counts.items()]
        
        city_counts = df["city"].value_counts().to_dict()
        by_city = [{"city": c, "count": int(cnt)} for c, cnt in city_counts.items()]

        crime_counts = df["crime_type"].value_counts().to_dict()
        by_crime_type = [{"crime_type": ct, "count": int(c)} for ct, c in crime_counts.items()]

        hour_counts = df["hour"].value_counts().to_dict()
        by_hour = [{"hour": h, "count": int(hour_counts.get(h, 0))} for h in range(24)]

        month_counts = {m: 0 for m in range(1, 13)}
        for d in df["date"]:
            try:
                m_idx = int(d.split("-")[1])
                if 1 <= m_idx <= 12:
                    month_counts[m_idx] += 1
            except Exception:
                pass
        
        by_month = [{"month": MONTH_NAMES[m - 1], "count": month_counts[m]} for m in range(1, 13)]

        weekend_cnt = int(df["is_weekend"].sum())
        night_cnt = int(((df["hour"] >= 20) | (df["hour"] <= 5)).sum())

        return {
            "total_incidents": total,
            "by_state": by_state,
            "by_city": by_city,
            "by_district": by_state,
            "by_crime_type": by_crime_type,
            "by_hour": by_hour,
            "by_month": by_month,
            "weekend_pct": round((weekend_cnt / total) * 100) if total else 0,
            "night_pct": round((night_cnt / total) * 100) if total else 0,
        }

    def get_incidents(
        self,
        state: Optional[str] = None,
        city: Optional[str] = None,
        crime_type: Optional[str] = None,
        district: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
    ) -> Tuple[List[Dict[str, Any]], int]:
        df = self._filter_df(state=state, city=city, crime_type=crime_type, district=district)
        total = len(df)

        start = (page - 1) * page_size
        paginated_df = df.iloc[start : start + page_size]

        results = paginated_df.to_dict(orient="records")
        for r in results:
            r["district"] = f"{r['city']}, {r['state']}"

        return results, total

    def get_all_records(self) -> List[Dict[str, Any]]:
        records = self.df.to_dict(orient="records")
        for r in records:
            r["district"] = f"{r['city']}, {r['state']}"
        return records

    def get_states_and_cities(self) -> Dict[str, List[str]]:
        mapping = {}
        for state, group in self.df.groupby("state"):
            mapping[state] = sorted(group["city"].unique().tolist())
        return mapping


_data_service_instance: Optional[DataService] = None

def get_data_service() -> DataService:
    global _data_service_instance
    if _data_service_instance is None:
        _data_service_instance = DataService()
    return _data_service_instance
