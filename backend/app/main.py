from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api import incidents, risk, dna_matcher, nl_query, decision_support, simulator

settings = get_settings()

app = FastAPI(title="Nirikshan Intelligence API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(incidents.router)
app.include_router(risk.router)
app.include_router(dna_matcher.router)
app.include_router(nl_query.router)
app.include_router(decision_support.router)
app.include_router(simulator.router)


@app.get("/health")
def health():
    return {"status": "ok"}