import requests, os
from dotenv import load_dotenv

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def search_youtube(query):
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&type=video&maxResults=10&key={YOUTUBE_API_KEY}"
    res = requests.get(url)
    data = res.json()
    results = []
    for item in data.get("items", []):
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        thumbnail = item["snippet"]["thumbnails"]["high"]["url"]
        channel = item["snippet"]["channelTitle"]
        results.append({
            "title": title,
            "artist": channel,
            "thumbnail": thumbnail,
            "url": f"https://www.youtube.com/watch?v={video_id}"
        })
    return results
