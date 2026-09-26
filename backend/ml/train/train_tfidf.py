#!/usr/bin/env python3
"""
Fit TF-IDF vectorizer on incident descriptions from CSV dataset and save artifact.
Run standalone:
    python ml/train/train_tfidf.py
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from app.config import get_settings


def main():
    settings = get_settings()
    csv_path = settings.DATA_CSV_PATH

    if not os.path.exists(csv_path):
        alt_path = os.path.join(os.path.dirname(__file__), "../../data/incidents.csv")
        if os.path.exists(alt_path):
            csv_path = alt_path
        else:
            print(f"[ERROR] CSV dataset not found at {csv_path}")
            return

    df = pd.read_csv(csv_path)
    descriptions = df["description"].dropna().astype(str).tolist()

    if not descriptions:
        print("[ERROR] No descriptions found in CSV.")
        return

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words="english",
        min_df=1,
        max_df=0.9,
    )
    vectorizer.fit(descriptions)
    print(f"[OK] TF-IDF fitted on {len(descriptions)} documents, vocab size {len(vectorizer.vocabulary_)}")

    os.makedirs(os.path.dirname(settings.TFIDF_PATH), exist_ok=True)
    joblib.dump(vectorizer, settings.TFIDF_PATH)
    print(f"[OK] Vectorizer saved to {settings.TFIDF_PATH}")


if __name__ == "__main__":
    main()