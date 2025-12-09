import json
import yt_dlp
import random
import time
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
import logging

app = FastAPI()
logger = logging.getLogger("nebula-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# ⚡ STREAM CACHING (major speed boost)
# ==========================================================
_stream_cache = {}
CACHE_TTL = 60 * 30  # 30 minutes

def get_cached_stream(url: str):
    now = time.time()
    entry = _stream_cache.get(url)
    if entry and now - entry["time"] < CACHE_TTL:
        return entry["url"]
    elif entry:
        _stream_cache.pop(url, None)
    return None

def save_stream(url: str, stream_url: str):
    _stream_cache[url] = {"url": stream_url, "time": time.time()}


# ==========================================================
# 🎵 STREAM ENDPOINT
# ==========================================================
@app.get("/stream")
async def stream(url: str):
    cached = get_cached_stream(url)
    if cached:
        return {"url": cached}
    try:
        ydl_opts = {
            "quiet": True,
            "format": "bestaudio[ext=m4a]/bestaudio/best",
            "extract_flat": False,
            "noplaylist": True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            stream_url = (
                info.get("url")
                or next((f.get("url") for f in info.get("formats", []) if f.get("url")), None)
            )
            if stream_url:
                save_stream(url, stream_url)
                return {"url": stream_url}
        return {"error": "Stream not found"}
    except Exception as e:
        logger.warning(f"Stream failed: {e}")
        return {"error": str(e)}

# ==========================================================
# 🔍 SEARCH ENDPOINT
# ==========================================================
@app.get("/search")
async def search(q: str):
    try:
        ydl_opts = {"quiet": True, "extract_flat": True, "skip_download": True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch20:{q}", download=False)
        results = [
            {
                "videoId": e.get("id"),
                "title": e.get("title"),
                "artist": e.get("uploader"),
                "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/hqdefault.jpg",
            }
            for e in info.get("entries", [])
            if e.get("id")
        ]
        return results
    except Exception as e:
        logger.warning(f"/search failed: {e}")
        return []

# ==========================================================
# 🔁 SMART UP NEXT (Dynamic Autoplay)
# ==========================================================
_upnext_cache = {}
UPNEXT_TTL = 60 * 10  # 10 minutes

@app.get("/autoplay/upnext")
async def autoplay_upnext(videoId: str):
    """Build dynamic 'Up Next' list similar to YouTube Music autoplay."""
    now = time.time()
    if videoId in _upnext_cache and now - _upnext_cache[videoId]["time"] < UPNEXT_TTL:
        return _upnext_cache[videoId]["data"]

    try:
        ydl_opts = {"quiet": True, "extract_flat": True, "skip_download": True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={videoId}", download=False)

        related = []
        # Pull from YouTube's related_videos
        for e in info.get("related_videos", [])[:25]:
            if not e.get("id"):
                continue
            related.append({
                "videoId": e["id"],
                "title": e.get("title") or "Unknown Title",
                "artist": e.get("uploader") or "Unknown Artist",
                "thumbnail": f"https://img.youtube.com/vi/{e['id']}/hqdefault.jpg",
            })

        # Fallback — if related list is empty, do a smart search
        if not related:
            query = f"{info.get('artist','') or info.get('uploader','')} {info.get('title','')}".strip()
            if not query:
                query = "popular songs"
            search_info = ydl.extract_info(f"ytsearch15:{query}", download=False)
            related = [
                {
                    "videoId": e.get("id"),
                    "title": e.get("title"),
                    "artist": e.get("uploader"),
                    "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/hqdefault.jpg",
                }
                for e in search_info.get("entries", [])
                if e.get("id")
            ]

        # Sort with same-artist and "music" priority
        main_artist = (info.get("artist") or info.get("uploader") or "").lower()
        related.sort(
            key=lambda r: (
                (main_artist in (r.get("artist", "") or "").lower()),
                "music" in (r.get("title", "").lower() + r.get("artist", "").lower()),
            ),
            reverse=True,
        )

        # Shuffle slightly for natural feel
        random.shuffle(related)

        data = {"upnext": related[:20]}
        _upnext_cache[videoId] = {"data": data, "time": now}
        return data

    except Exception as e:
        logger.warning(f"UpNext failed: {e}")
        return {"upnext": []}

# ==========================================================
# 📂 PLAYLIST MANAGEMENT
# ==========================================================
PLAYLISTS_FILE = Path("playlists.json")

def load_playlists():
    if PLAYLISTS_FILE.exists():
        try:
            with open(PLAYLISTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f).get("playlists", [])
        except:
            return []
    return []

def save_playlists(playlists):
    with open(PLAYLISTS_FILE, "w", encoding="utf-8") as f:
        json.dump({"playlists": playlists}, f, indent=2)

@app.get("/playlist/all")
async def get_all_playlists():
    return {"playlists": load_playlists()}

@app.post("/playlist/create")
async def create_playlist(request: Request):
    body = await request.json()
    name = body.get("name", "").strip()
    if not name:
        return {"error": "Playlist name required"}
    playlists = load_playlists()
    new_id = max([p["id"] for p in playlists], default=0) + 1 if playlists else 1
    new_playlist = {"id": new_id, "name": name, "songs": []}
    playlists.append(new_playlist)
    save_playlists(playlists)
    return {"id": new_id, "playlist": new_playlist}

@app.post("/playlist/add")
async def add_to_playlist(request: Request):
    body = await request.json()
    pid, videoId = body.get("playlist_id"), body.get("videoId")
    playlists = load_playlists()
    for pl in playlists:
        if pl["id"] == pid:
            if any(s["videoId"] == videoId for s in pl["songs"]):
                return {"message": "Already added"}
            pl["songs"].append({
                "videoId": videoId,
                "title": body.get("title"),
                "artist": body.get("artist"),
                "thumbnail": body.get("thumbnail"),
            })
            save_playlists(playlists)
            return {"message": "Song added"}
    return {"error": "Playlist not found"}

@app.delete("/playlist/delete")
async def delete_playlist(playlist_id: int = Query(...)):
    playlists = load_playlists()
    updated = [p for p in playlists if p["id"] != playlist_id]
    save_playlists(updated)
    return {"message": "Deleted"}

# ==========================================================
# ❤️ LIKE / UNLIKE SYSTEM
# ==========================================================
LIKES_FILE = Path("liked_songs.json")

def load_likes():
    if LIKES_FILE.exists():
        try:
            with open(LIKES_FILE, "r", encoding="utf-8") as f:
                return json.load(f).get("liked", [])
        except:
            return []
    return []

def save_likes(liked):
    with open(LIKES_FILE, "w", encoding="utf-8") as f:
        json.dump({"liked": liked}, f, indent=2)

@app.post("/like")
async def toggle_like(
    videoId: str = Query(...),
    title: str = Query(...),
    artist: str = Query(""),
    thumbnail: str = Query(""),
):
    liked = load_likes()
    exists = next((s for s in liked if s["videoId"] == videoId), None)
    if exists:
        liked = [s for s in liked if s["videoId"] != videoId]
        save_likes(liked)
        return {"liked": False, "message": "Song unliked"}
    liked.append({
        "videoId": videoId,
        "title": title,
        "artist": artist,
        "thumbnail": thumbnail,
    })
    save_likes(liked)
    return {"liked": True, "message": "Song liked"}

@app.get("/liked/all")
async def get_all_liked():
    return {"liked": load_likes()}

# ==========================================================
# 🌐 FRONTEND FALLBACK (for production build)
# ==========================================================
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    index_path = Path("frontend/dist/index.html")
    if index_path.exists():
        return FileResponse(index_path)
    return {"error": "Frontend build not found"}
