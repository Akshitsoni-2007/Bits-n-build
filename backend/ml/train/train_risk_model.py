#!/usr/bin/env python3
"""
Train Random Forest risk model and save artifacts.
Run after database is seeded:
    python ml/train/train_risk_model.py
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from app.database import SessionLocal
from app.models.incident import Incident
from app.config import get_settings


def load_training_data() -> pd.DataFrame:
    db = SessionLocal()
    try:
        rows = db.query(Incident).all()
        data = []
        for r in rows:
            data.append({
                "district": r.district.value,
                "crime_type": r.crime_type.value,
                "month": r.date.strftime("%B"),
                "hour": r.hour,
                "is_weekend": 1 if r.is_weekend else 0,
                # target: risk score heuristic (same as frontend mock)
                # We'll compute a synthetic target using same heuristic for training
            })
        return pd.DataFrame(data)
    finally:
        db.close()


def compute_target(row) -> float:
    # Replicate frontend heuristic to generate target for supervised learning
    base = 32.0
    # hour
    if row["hour"] >= 21 or row["hour"] <= 4:
        base += 26
    elif row["hour"] >= 18:
        base += 15
    else:
        base -= 8
    # weekend
    if row["is_weekend"]:
        base += 18
    else:
        base -= 4
    # crime type
    if "Vehicle" in row["crime_type"] or "Robbery" in row["crime_type"]:
        base += 14
    elif "Cyber" in row["crime_type"]:
        base += 10
    # district
    if row["district"] in ["Cyber City", "North", "Central"]:
        base += 12
    # month
    if row["month"] in ["November", "December", "January", "October"]:
        base += 8
    return max(8, min(96, round(base)))


def main():
    df = load_training_data()
    if df.empty:
        print("❌ No training data found. Seed database first.")
        return

    df["target"] = df.apply(compute_target, axis=1)

    # Encode categorical
    le_district = LabelEncoder()
    le_crime = LabelEncoder()
    le_month = LabelEncoder()

    df["district_enc"] = le_district.fit_transform(df["district"])
    df["crime_enc"] = le_crime.fit_transform(df["crime_type"])
    df["month_enc"] = le_month.fit_transform(df["month"])

    X = df[["district_enc", "crime_enc", "month_enc", "hour", "is_weekend"]].values
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

    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"📈 R^2 train: {train_score:.3f}, test: {test_score:.3f}")

    settings = get_settings()
    os.makedirs(os.path.dirname(settings.RISK_MODEL_PATH), exist_ok=True)
    joblib.dump(model, settings.RISK_MODEL_PATH)
    encoders = {"district": le_district, "crime_type": le_crime, "month": le_month}
    joblib.dump(encoders, settings.ENCODERS_PATH)
    print(f"✅ Model saved to {settings.RISK_MODEL_PATH}")
    print(f"✅ Encoders saved to {settings.ENCODERS_PATH}")


if __name__ == "__main__":
    main()