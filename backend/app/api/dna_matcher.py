from fastapi import APIRouter, Depends, HTTPException
from app.schemas.dna_matcher import DNAMatcherResponse
from app.services.retrieval import RetrievalService

router = APIRouter(prefix="/api/dna-matcher", tags=["dna-matcher"])

_retrieval_service = None


def get_retrieval_service() -> RetrievalService:
    global _retrieval_service
    if _retrieval_service is None:
        _retrieval_service = RetrievalService()
    return _retrieval_service


@router.post("/search", response_model=DNAMatcherResponse)
def search_dna(
    payload: dict,  # expects {"narrative": "..."}
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
):
    narrative = payload.get("narrative", "")
    if not narrative:
        raise HTTPException(status_code=400, detail="Field 'narrative' is required")
    try:
        matches = retrieval_service.search(narrative, top_k=6)
        return DNAMatcherResponse(matches=matches)
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="TF-IDF vectorizer not fitted. Run training script first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="DNA search failed")