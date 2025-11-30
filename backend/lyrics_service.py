# lyrics_service.py
import random
import html
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import requests

router = APIRouter(prefix="/lyrics", tags=["Lyrics"])

# Simple templates for generating synthetic lyrics
VERSE_LINES = [
    "We ride through the night, chasing the glow",
    "Every rhythm hits deep, like we already know",
    "The city moves slow but our hearts don’t fade",
    "Every beat we drop, another memory made",
]

CHORUS_LINES = [
    "Yeah, this is {title}, the vibe we own",
    "Every word you say cuts straight to the bone",
    "Keep it moving, {title}, don’t let it go",
    "We’re lost in the music, just let it flow",
]

BRIDGE_LINES = [
    "And I can’t let go, no matter the sound",
    "Your voice still lingers when no one’s around",
    "Every note we hit pulls me in again",
    "This song’s forever — it’ll never end",
]


def generate_local_lyrics(title: str, artist: str) -> str:
    """Generate lyrics locally, ensuring a full output always."""
    random.seed(title + artist)

    title = html.unescape(title)
    artist = html.unescape(artist)

    verses = "\n".join(random.sample(VERSE_LINES, len(VERSE_LINES)))
    chorus = "\n".join(line.format(title=title) for line in random.sample(CHORUS_LINES, 3))
    bridge = "\n".join(random.sample(BRIDGE_LINES, 3))

    return f"""{title} — {artist}

[Verse 1]
{verses}

[Chorus]
{chorus}

[Bridge]
{bridge}

[Final Chorus]
{chorus}
"""


@router.get("/")
def get_lyrics(title: str = Query(...), artist: str = Query(...)):
    title = html.unescape(title)
    artist = html.unescape(artist)

    # Try real lyrics API
    try:
        r = requests.get(f"https://api.lyrics.ovh/v1/{artist}/{title}", timeout=6)
        if r.status_code == 200:
            data = r.json()
            lyrics = data.get("lyrics", "").strip()
            if lyrics and len(lyrics.splitlines()) > 3:
                return JSONResponse({"lyrics": lyrics, "source": "api"})
    except Exception:
        pass

    # Always generate fallback
    generated = generate_local_lyrics(title, artist)
    if not generated.strip():
        generated = f"No lyrics found for {title} by {artist}, but the beat goes on."

    return JSONResponse({"lyrics": generated, "source": "local"})
