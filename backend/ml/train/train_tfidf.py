#!/usr/bin/env python3
"""
Fit TF-IDF vectorizer on incident descriptions and save artifact.
Run after database is seeded:
    python ml/train/train_tfidf.py
"""
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from app.database import SessionLocal
from app.models.incident import Incident
from app.config import get_settings


def main():
    db = SessionLocal()
    try:
        incidents = db.query(Incident).all()
        if not incidents:
            print("❌ No incidents found. Seed database first.")
            return
        descriptions = [inc.description for inc in incidents]
    finally:
        db.close()

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words="english",
        min_df=1,
        max_df=0.9,
    )
    vectorizer.fit(descriptions)
    print(f"✅ TF-IDF fitted on {len(descriptions)} documents, vocab size {len(vectorizer.vocabulary_)}")

    settings = get_settings()
    os.makedirs(os.path.dirname(settings.TFIDF_PATH), exist_ok=True)
    joblib.dump(vectorizer, settings.TFIDF_PATH)
    print(f"✅ Vectorizer saved to {settings.TFIDF_PATH}")


if __name__ == "__main__":
    main()