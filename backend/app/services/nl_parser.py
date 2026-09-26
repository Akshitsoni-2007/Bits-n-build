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
        system = (
            "You are a query parser for an Indian crime analytics system. "
            "Convert the user's natural language query into a JSON object with the following optional fields: "
            "state (string, e.g. 'Maharashtra', 'Madhya Pradesh', 'Delhi (UT)', 'Haryana'), "
            "city (string, e.g. 'Indore', 'Mumbai', 'Pune', 'Gurugram', 'North Delhi'), "
            "crime_type (string, e.g. 'Cyber Fraud / Financial', 'Vehicle Theft', 'Burglary / Breaking-in', 'Robbery / Snatching', 'Assault / Grievous Hurt', 'Narcotics / NDPS'), "
            "day_type ('weekend'|'weekday'), "
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
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
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
        try:
            raw = self.provider.parse(query)
        except Exception:
            # Local fallback rule-based parsing if LLM API key is absent or unreachable
            raw = self._heuristic_parse(query)
        return ParsedFilters(**raw)

    def _heuristic_parse(self, query: str) -> dict:
        q = query.lower()
        res = {}

        cities = ["indore", "mumbai", "pune", "gurugram", "bhopal", "chennai", "kolkata", "bengaluru", "hyderabad", "jaipur", "ludhiana", "noida", "delhi"]
        for c in cities:
            if c in q:
                res["city"] = c.capitalize()
                break

        if "vehicle" in q or "car" in q or "bike" in q:
            res["crime_type"] = "Vehicle Theft"
        elif "cyber" in q or "fraud" in q or "scam" in q:
            res["crime_type"] = "Cyber Fraud / Financial"
        elif "robbery" in q or "snatch" in q:
            res["crime_type"] = "Robbery / Snatching"
        elif "burglary" in q or "break" in q:
            res["crime_type"] = "Burglary / Breaking-in"
        elif "assault" in q or "brawl" in q:
            res["crime_type"] = "Assault / Grievous Hurt"

        if "weekend" in q:
            res["day_type"] = "weekend"
        elif "weekday" in q:
            res["day_type"] = "weekday"

        if "night" in q:
            res["time_of_day"] = "night"
            res["hour_min"] = 21
            res["hour_max"] = 5

        return res

    def empty_filters(self) -> ParsedFilters:
        return ParsedFilters()