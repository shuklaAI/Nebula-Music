from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils import db

router = APIRouter(prefix="/api/likes", tags=["likes"])

def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@router.post("/{song_id}")
def like_song(song_id: int, database: Session = Depends(get_db)):
    new_like = db.Like(song_id=song_id)
    database.add(new_like)
    database.commit()
    return {"message": f"Song {song_id} liked"}

@router.get("/")
def get_liked(database: Session = Depends(get_db)):
    return database.query(db.Like).all()
