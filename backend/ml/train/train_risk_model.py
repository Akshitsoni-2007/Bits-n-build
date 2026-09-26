#!/usr/bin/env python3
"""
Train Random Forest risk model from CSV dataset and save artifacts.
Run standalone:
    python ml/train/train_risk_model.py
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from app.config import get_settings


def load_training_data(csv_path: str) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        alt_path = os.path.join(os.path.dirname(__file__), "../../data/incidents.csv")
        if os.path.exists(alt_path):
            csv_path = alt_path
        else:
            raise FileNotFoundError(f"CSV dataset not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # Process dates to month names
    def parse_month(d_str):
        try:
            m_idx = int(str(d_str).split("-")[1])
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            return months[m_idx - 1]
        except Exception:
            return "November"

    df["month"] = df["date"].apply(parse_month)
    df["is_weekend"] = df["is_weekend"].astype(str).str.lower().isin(["true", "1", "t", "yes"]).astype(int)

    return df


def compute_target(row) -> float:
    base = 32.0
    hour = int(row["hour"])
    if hour >= 21 or hour <= 4:
        base += 26
    elif hour >= 18:
        base += 15
    else:
        base -= 8

    if row["is_weekend"]:
        base += 18
    else:
        base -= 4

    c_type = str(row["crime_type"])
    if "Vehicle" in c_type or "Robbery" in c_type:
        base += 14
    elif "Cyber" in c_type:
        base += 10

    state_val = str(row["state"])
    if state_val in ["Delhi (UT)", "Haryana", "Maharashtra"]:
        base += 12

    month_val = str(row["month"])
    if month_val in ["November", "December", "January", "October"]:
        base += 8

    return max(8, min(96, round(base)))


def main():
    settings = get_settings()
    df = load_training_data(settings.DATA_CSV_PATH)
    if df.empty:
        print("[ERROR] Training dataframe is empty.")
        return

    df["target"] = df.apply(compute_target, axis=1)

    le_state = LabelEncoder()
    le_city = LabelEncoder()
    le_crime = LabelEncoder()
    le_month = LabelEncoder()

    df["state_enc"] = le_state.fit_transform(df["state"])
    df["city_enc"] = le_city.fit_transform(df["city"])
    df["crime_enc"] = le_crime.fit_transform(df["crime_type"])
    df["month_enc"] = le_month.fit_transform(df["month"])

    X = df[["state_enc", "city_enc", "crime_enc", "month_enc", "hour", "is_weekend"]].values
    y = df["target"].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"[METRICS] R^2 train: {train_score:.3f}, test: {test_score:.3f}")

    os.makedirs(os.path.dirname(settings.RISK_MODEL_PATH), exist_ok=True)
    joblib.dump(model, settings.RISK_MODEL_PATH)

    encoders = {
        "state": le_state,
        "city": le_city,
        "crime_type": le_crime,
        "month": le_month,
    }
    joblib.dump(encoders, settings.ENCODERS_PATH)
    print(f"[OK] Model saved to {settings.RISK_MODEL_PATH}")
    print(f"[OK] Encoders saved to {settings.ENCODERS_PATH}")


if __name__ == "__main__":
    main()