from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# --------------------------------------------------
# Database Setup
# --------------------------------------------------
DATABASE_URL = "sqlite:///./data/songs.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --------------------------------------------------
# Association Table for Playlist <-> Song
# --------------------------------------------------
playlist_songs = Table(
    "playlist_songs",
    Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlists.id")),
    Column("song_id", Integer, ForeignKey("songs.id"))
)

# --------------------------------------------------
# Songs Table
# --------------------------------------------------
class Song(Base):
    __tablename__ = "songs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    artist = Column(String)
    thumbnail = Column(String)
    url = Column(String)
    playlists = relationship("Playlist", secondary=playlist_songs, back_populates="songs")

# --------------------------------------------------
# Playlists Table
# --------------------------------------------------
class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    songs = relationship("Song", secondary=playlist_songs, back_populates="playlists")

# --------------------------------------------------
# Like Table (Future use)
# --------------------------------------------------
class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"))
    user_id = Column(Integer, nullable=True)

# --------------------------------------------------
# Initialize Database
# --------------------------------------------------
def init_db():
    Base.metadata.create_all(bind=engine)
