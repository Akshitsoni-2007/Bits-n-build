import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATA_CSV_PATH: str = "data/incidents.csv"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    LOG_LEVEL: str = "INFO"

    # LLM provider (OpenAI-compatible)
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4o-mini"

    # Model artifact paths
    RISK_MODEL_PATH: str = "ml/artifacts/risk_model.pkl"
    TFIDF_PATH: str = "ml/artifacts/tfidf_vectorizer.pkl"
    ENCODERS_PATH: str = "ml/artifacts/label_encoders.pkl"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()