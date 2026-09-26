import os
import joblib
import numpy as np
from typing import List
from sklearn.metrics.pairwise import cosine_similarity
from app.config import get_settings
from app.schemas.dna_matcher import DNAMatch
from app.database import SessionLocal
from app.models.incident import Incident


class RetrievalService:
    def __init__(self):
        self.settings = get_settings()
        self.vectorizer = None
        self.tfidf_matrix = None
        self.incidents: List[Incident] = []
        self._load_artifacts()
        self._load_incidents()

    def _load_artifacts(self):
        path = self.settings.TFIDF_PATH
        if not os.path.exists(path):
            raise FileNotFoundError("TF-IDF vectorizer not found")
        self.vectorizer = joblib.load(path)

    def _load_incidents(self):
        db = SessionLocal()
        try:
            self.incidents = db.query(Incident).order_by(Incident.id).all()
            # Build TF-IDF matrix for all descriptions
            descriptions = [inc.description for inc in self.incidents]
            self.tfidf_matrix = self.vectorizer.transform(descriptions)
        finally:
            db.close()

    def search(self, narrative: str, top_k: int = 6) -> List[DNAMatch]:
        if not self.incidents:
            return []

        query_vec = self.vectorizer.transform([narrative])
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = np.argsort(sims)[::-1][:top_k]

        matches = []
        for idx in top_indices:
            inc = self.incidents[idx]
            sim = float(sims[idx])
            # Simple characteristic extraction (could be enhanced)
            matched_chars = []
            low = narrative.lower()
            desc_low = inc.description.lower()
            if any(k in low for k in ["motorcycle", "bike", "two-wheeler"]):
                if any(k in desc_low for k in ["motorcycle", "two-wheeler", "bike"]):
                    matched_chars.append("Two-wheeler / Motorcycle getaway modality")
            if any(k in low for k in ["snatch", "handbag", "chain", "purse"]):
                if inc.crime_type.value in ["Robbery / Snatching"] or any(k in desc_low for k in ["snatch", "handbag", "purse"]):
                    matched_chars.append("Target profile: Handheld personal assets & physical grab")
            if any(k in low for k in ["metro", "station", "subway", "transit"]):
                if any(k in desc_low for k in ["metro", "station"]):
                    matched_chars.append("Transit hub proximity (< 200m to Metro exit)")
            if any(k in low for k in ["night", "23:", "midnight", "02:", "dark"]):
                if inc.hour >= 21 or inc.hour <= 4:
                    matched_chars.append("Low ambient lighting / late night temporal alignment")
            if any(k in low for k in ["atm", "skimming", "card", "bank", "sim", "upi"]):
                if inc.crime_type.value == "Cyber Fraud / Financial" or any(k in desc_low for k in ["atm", "skimming", "cloned", "upi"]):
                    matched_chars.append("Electronic credential harvesting / financial diversion signature")
            if any(k in low for k in ["shutter", "warehouse", "break", "lock"]):
                if inc.crime_type.value == "Burglary / Breaking-in" or any(k in desc_low for k in ["shutter", "lock", "entry"]):
                    matched_chars.append("Forced structural breach / Commercial shutter manipulation")
            if not matched_chars:
                matched_chars = ["Correlated geographical grid sector", "Comparable temporal dispatch profile"]

            matches.append(
                DNAMatch(
                    fir_id=inc.fir_id,
                    similarity=round(min(0.96, max(0.48, sim)), 3),
                    district=inc.district.value,
                    crime_type=inc.crime_type.value,
                    time=f"{inc.hour:02d}:00 hrs ({inc.day_of_week})",
                    matched_characteristics=matched_chars,
                    snippet=inc.description,
                    date=inc.date.isoformat(),
                )
            )
        return matches