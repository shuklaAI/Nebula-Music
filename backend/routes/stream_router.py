from fastapi import APIRouter, Query, HTTPException
import yt_dlp

router = APIRouter()

@router.get("/stream")
def get_stream(url: str = Query(..., description="YouTube video URL")):
    """
    Extract a direct audio stream URL from a YouTube video using yt_dlp.
    Handles cases where abr is missing.
    """
    try:
        ydl_opts = {
            "quiet": True,
            "format": "bestaudio/best",
            "noplaylist": True,
            "geo_bypass": True,
            "extract_flat": False,
            "skip_download": True,
            "nocheckcertificate": True,
            "source_address": "0.0.0.0",
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        if not info:
            raise HTTPException(status_code=404, detail="Failed to extract info from URL")

        formats = info.get("formats", [])
        audio_formats = [
            f for f in formats
            if f.get("acodec") != "none"
            and f.get("url")
            and not f.get("tbr") == None
        ]

        if not audio_formats:
            raise HTTPException(status_code=500, detail="No valid audio formats found")

        # Sort safely — handle None abr values by converting to 0
        best_audio = sorted(audio_formats, key=lambda f: f.get("abr") or 0, reverse=True)[0]

        return {"stream_url": best_audio.get("url")}

    except yt_dlp.utils.DownloadError as e:
        raise HTTPException(status_code=500, detail=f"yt-dlp download error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stream extraction failed: {str(e)}")
