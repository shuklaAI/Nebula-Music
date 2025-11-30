from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from utils import db

router = APIRouter(prefix="/api/playlists", tags=["playlists"])

# --------------------------------------------------
# Dependency for DB session
# --------------------------------------------------
def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

# --------------------------------------------------
# Pydantic Models
# --------------------------------------------------
class PlaylistCreate(BaseModel):
    name: str

# --------------------------------------------------
# Create a new playlist
# --------------------------------------------------
@router.post("/")
def create_playlist(playlist: PlaylistCreate, database: Session = Depends(get_db)):
    new_playlist = db.Playlist(name=playlist.name)
    database.add(new_playlist)
    database.commit()
    database.refresh(new_playlist)
    return {
        "message": "Playlist created successfully",
        "playlist": {"id": new_playlist.id, "name": new_playlist.name}
    }

# --------------------------------------------------
# Get all playlists with songs
# --------------------------------------------------
@router.get("/")
def get_all_playlists(database: Session = Depends(get_db)):
    playlists = database.query(db.Playlist).all()
    result = []
    for playlist in playlists:
        result.append({
            "id": playlist.id,
            "name": playlist.name,
            "songs": [
                {"id": s.id, "title": s.title, "artist": s.artist, "url": s.url}
                for s in playlist.songs
            ]
        })
    return result

# --------------------------------------------------
# Add a song to playlist
# --------------------------------------------------
@router.post("/{playlist_id}/add/{song_id}")
def add_song_to_playlist(playlist_id: int, song_id: int, database: Session = Depends(get_db)):
    playlist = database.query(db.Playlist).filter(db.Playlist.id == playlist_id).first()
    song = database.query(db.Song).filter(db.Song.id == song_id).first()
    if not playlist:
        return {"error": f"Playlist {playlist_id} not found"}
    if not song:
        return {"error": f"Song {song_id} not found"}
    if song in playlist.songs:
        return {"message": "Song already in playlist"}
    playlist.songs.append(song)
    database.commit()
    return {"message": f"Added '{song.title}' to '{playlist.name}'"}

# --------------------------------------------------
# Remove a song from playlist
# --------------------------------------------------
@router.delete("/{playlist_id}/remove/{song_id}")
def remove_song_from_playlist(playlist_id: int, song_id: int, database: Session = Depends(get_db)):
    playlist = database.query(db.Playlist).filter(db.Playlist.id == playlist_id).first()
    song = database.query(db.Song).filter(db.Song.id == song_id).first()
    if not playlist:
        return {"error": f"Playlist {playlist_id} not found"}
    if not song:
        return {"error": f"Song {song_id} not found"}
    if song not in playlist.songs:
        return {"message": "Song not in playlist"}
    playlist.songs.remove(song)
    database.commit()
    return {"message": f"Removed '{song.title}' from '{playlist.name}'"}

# --------------------------------------------------
# Get one playlist by ID
# --------------------------------------------------
@router.get("/{playlist_id}")
def get_playlist(playlist_id: int, database: Session = Depends(get_db)):
    playlist = database.query(db.Playlist).filter(db.Playlist.id == playlist_id).first()
    if not playlist:
        return {"error": f"Playlist {playlist_id} not found"}
    return {
        "id": playlist.id,
        "name": playlist.name,
        "songs": [
            {"id": s.id, "title": s.title, "artist": s.artist, "url": s.url}
            for s in playlist.songs
        ]
    }
