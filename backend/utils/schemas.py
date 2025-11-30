from pydantic import BaseModel

class SongBase(BaseModel):
    title: str
    artist: str
    thumbnail: str
    url: str

class SongCreate(SongBase):
    pass

class SongResponse(SongBase):
    id: int
    class Config:
        from_attributes = True

class PlaylistBase(BaseModel):
    name: str

class PlaylistCreate(PlaylistBase):
    pass
