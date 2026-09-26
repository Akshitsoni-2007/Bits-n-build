import os
import json
import httpx
from typing import Optional
from app.config import get_settings
from app.schemas.nl_query import ParsedFilters


class LLMProvider:
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.LLM_API_KEY
        self.base_url = self.settings.LLM_BASE_URL.rstrip("/")
        self.model = self.settings.LLM_MODEL

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def parse(self, prompt: str) -> dict:
        # Use function calling style: ask model to return JSON only
        system = (
            "You are a query parser for a crime analytics system. "
            "Convert the user's natural language query into a JSON object with the following optional fields: "
            "district (string), crime_type (string), day_type ('weekend'|'weekday'), "
            "hour_min (int), hour_max (int), time_of_day ('morning'|'afternoon'|'evening'|'night'), keyword (string). "
            "Only include fields you are confident about. Return ONLY valid JSON."
        )
        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ]
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0,
            "max_tokens": 200,
        }
        url = f"{self.base_url}/chat/completions"
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, headers=self._headers(), json=payload)
            resp.raise_for_status()
            data = resp.json()
        content = data["choices"][0]["message"]["content"].strip()
        # Try parse JSON
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Attempt to extract JSON from code fences
            if content.startswith("```"):
                content = content.strip("`")
                if content.startswith("json"):
                    content = content[4:]
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    pass
            raise


class NLParserService:
    def __init__(self):
        self.provider = LLMProvider()

    def parse(self, query: str) -> ParsedFilters:
        # First attempt
        try:
            raw = self.provider.parse(query)
        except Exception:
            # Retry once
            try:
                raw = self.provider.parse(query)
            except Exception:
                raw = {}
        # Validate via Pydantic
        return ParsedFilters(**raw)

    def empty_filters(self) -> ParsedFilters:
        return ParsedFilters()