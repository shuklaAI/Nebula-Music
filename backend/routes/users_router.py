from fastapi import APIRouter

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me")
def get_profile():
    return {"username": "guest", "status": "Logged in as guest (no auth yet)"}
