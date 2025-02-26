from fastapi import APIRouter, HTTPException
from service import generate_server
router = APIRouter()


@router.get("/generate", summary="Generate a anti red uuid")
def generate_anti_red_uri(url: str) -> str:
    if url is None:
        raise HTTPException(400, detail="URL is required")
    # Generate service
    return generate_server.generate_anti_red_uri(url)
