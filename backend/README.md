# Nirikshan Intelligence Backend (FastAPI)

FastAPI backend for the Nirikshan Crime Analytics & Decision Support Console.

## Features
- **Incidents API**: Summary statistics, paginated listing, filtering
- **Risk Predictor**: Random Forest + SHAP explanations
- **Crime DNA Matcher**: TF‑IDF + cosine similarity search
- **Natural Language Query**: LLM‑based NL → structured filters → SQLAlchemy query
- **Decision Support**: Pattern detection + evidence‑backed recommendations
- **Simulator**: Heuristic patrol allocation impact estimation

## Quick Start (when MySQL is ready)

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE nirikshan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Configure environment
cp .env.example .env
# edit .env with real DATABASE_URL

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create tables
python scripts/init_db.py

# 5. Seed initial data (≈65 incidents)
python scripts/seed_database.py

# 6. Train ML models (one‑time)
python ml/train/train_risk_model.py
python ml/train/train_tfidf.py

# 7. Run server
uvicorn app.main:app --reload --port 8000
```

Open API docs at **http://localhost:8000/docs**.

## Docker (local full stack)

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- MySQL: localhost:3306 (user `nirikshan`, password `nirikshan_pass`)

## Project Structure
```
backend/
├── app/
│   ├── main.py                 # FastAPI app, CORS, routing
│   ├── config.py               # Settings via .env
│   ├── database.py             # Sync SQLAlchemy engine/session
│   ├── api/                    # 7 endpoint modules
│   ├── models/                 # SQLAlchemy ORM + enums
│   ├── schemas/                # Pydantic request/response models
│   ├── services/               # ML & business logic
│   └── utils/
├── ml/
│   ├── artifacts/              # .gitignored model files
│   └── train/                  # Training scripts
├── data/                       # incidents_seed.json (generated)
├── scripts/
│   ├── init_db.py              # Create tables
│   └── seed_database.py        # Load seed data
├── tests/                      # pytest suite
├── requirements.txt
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── .gitignore
```

## API Endpoints (match frontend `src/lib/api.ts`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/incidents/summary` | Aggregated stats |
| GET | `/api/incidents` | Paginated incident list |
| POST | `/api/risk/predict` | Risk score + SHAP factors |
| POST | `/api/dna-matcher/search` | TF‑IDF similarity matches |
| POST | `/api/nl-query` | NL → filters → results |
| POST | `/api/decision-support/analyze` | Pattern + recommendation |
| POST | `/api/simulator/run` | Patrol allocation simulation |

All request/response schemas mirror the TypeScript definitions in `src/lib/types.ts`.

## ML Artifacts (git‑ignored)
- `ml/artifacts/risk_model.pkl` – RandomForestRegressor
- `ml/artifacts/label_encoders.pkl` – LabelEncoders for categorical features
- `ml/artifacts/tfidf_vectorizer.pkl` – Fitted TfidfVectorizer

Regenerate with training scripts after seeding data.

## Testing
```bash
pytest -q
```
Tests use an in‑memory SQLite database; no external MySQL required.

## Environment Variables
See `.env.example`. Required for production:
- `DATABASE_URL` (MySQL PyMySQL URL)
- `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL` (optional, for NL query)

## License
Prototype / Hackathon – see root README.