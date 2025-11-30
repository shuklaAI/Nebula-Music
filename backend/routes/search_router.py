from fastapi import APIRouter, Query, HTTPException
import yt_dlp

router = APIRouter()

@router.get("/search")
def search_songs(q: str = Query(..., description="Song name or keyword to search")):
    """
    Search YouTube for songs matching the query and return top results.
    """
    try:
        ydl_opts = {
            "quiet": True,
            "skip_download": True,
            "extract_flat": "in_playlist",  # ✅ Required for ytsearch to work
            "default_search": "ytsearch5",  # ✅ Get top 5 results
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(q, download=False)

        if not info:
            return []

        entries = info.get("entries", [])
        if not entries:
            return []

        results = []
        for entry in entries:
            results.append({
                "title": entry.get("title", "Unknown Title"),
                "url": f"https://www.youtube.com/watch?v={entry.get('id')}",
                "thumbnail": (entry.get("thumbnails") or [{}])[-1].get("url", ""),
                "artist": entry.get("uploader", "Unknown Artist")
            })

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
