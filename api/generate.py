from fastapi import APIRouter, HTTPException
from server import generate_server

router = APIRouter()


@router.get("/generate", summary="Generate a anti red uuid")
def generate_anti_red_uuid(url: str) -> str:
    if url is None:
        raise HTTPException(400, detail="URL is required")
    # Generate server
    return generate_server.generate_anti_red_uuid(url)


@router.post("/get_by_uuid", summary="Get secret by uuid")
def get_by_identity_id(identity_id: str) -> str:
    if identity_id is None:
        raise HTTPException(
            400, detail="Identity id is required")
    # Get by identity id
    secret = generate_server.get_by_identity_id(identity_id)
    if not secret:
        raise HTTPException(500)
    return secret
