from fastapi import APIRouter, HTTPException
from service import generate_server
router = APIRouter()


@router.get("/generate", summary="Generate a anti red uuid")
def generate_anti_red_uri(url: str) -> str:
    if url is None:
        raise HTTPException(400, detail="URL is required")
    # Generate service
    return generate_server.generate_anti_red_uri(url)


@router.post("/redirect", summary="Get secret by uuid")
def get_by_identity_id(uuid: str) -> str:
    if uuid is None:
        raise HTTPException(
            400, detail="Identity id is required")
    # Get ciphertext by identity id
    from service import generate_server
    ciphertext = generate_server.get_by_identity_id(uuid)
    if not ciphertext:
        raise HTTPException(500)
    return ciphertext
