from fastapi import APIRouter
import yt_dlp, os

router = APIRouter(prefix="/api/download", tags=["download"])
DOWNLOAD_PATH = "downloads"

os.makedirs(DOWNLOAD_PATH, exist_ok=True)

@router.get("/{video_id}")
def download_song(video_id: str):
    """Download YouTube song as audio file"""
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": f"{DOWNLOAD_PATH}/%(title)s.%(ext)s",
        "quiet": True,
        "noplaylist": True,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192"
        }]
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=True)
        filename = ydl.prepare_filename(info).replace(".webm", ".mp3").replace(".m4a", ".mp3")
    return {
        "message": "Downloaded successfully",
        "title": info["title"],
        "file": os.path.abspath(filename)
    }
