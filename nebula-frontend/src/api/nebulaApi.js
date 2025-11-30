// src/api/nebulaApi.js
const API_BASE = "http://localhost:8000";

// ---- Clean Song Title ----
function cleanTitle(raw) {
  if (!raw) return "";

  let t = raw;

  // Remove Official Video junk
  t = t.replace(/\(.*?\)/g, "");
  t = t.replace(/\[.*?\]/g, "");

  // Remove everything after "|"
  if (t.includes("|")) t = t.split("|")[0];

  // Remove everything after "-"
  if (t.includes(" - ")) t = t.split(" - ")[1];

  // Cleanup quotes
  t = t.replace(/&quot;/g, '"').trim();

  return t.trim();
}

// ---- Extract Artist ----
function extractArtist(rawTitle, channelName) {
  if (!rawTitle) return channelName || "";

  // Case: Drake - One Dance
  if (rawTitle.includes(" - ")) {
    return rawTitle.split(" - ")[0].trim();
  }

  return channelName || "";
}

export default {
  // SEARCH SONGS
  async searchSongs(query) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    return (data || []).map((item) => ({
      videoId: item.videoId,
      title: cleanTitle(item.title),
      artist: extractArtist(item.title, item.channel),
      thumbnail: item.thumbnail,
      url: `https://www.youtube.com/watch?v=${item.videoId}`,
    }));
  },

  // STREAM SONG
  async getStream(url) {
    const res = await fetch(
      `${API_BASE}/stream?url=${encodeURIComponent(url)}`
    );
    return res.json();
  },
};
