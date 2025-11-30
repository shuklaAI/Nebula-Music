from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils import db, schemas, youtube_api

router = APIRouter(prefix="/api/songs", tags=["songs"])

def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@router.get("/search")
def search_song(query: str):
    return youtube_api.search_youtube(query)

@router.get("/")
def get_all_songs(database: Session = Depends(get_db)):
    songs = database.query(db.Song).all()
    return songs

@router.post("/add")
def add_song(song: schemas.SongCreate, database: Session = Depends(get_db)):
    new_song = db.Song(**song.dict())
    database.add(new_song)
    database.commit()
    database.refresh(new_song)
    return {"message": "Song added", "song": new_song}
