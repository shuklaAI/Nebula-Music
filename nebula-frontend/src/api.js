// nebula-frontend/src/services/api.js

const API_BASE = "http://127.0.0.1:8000"; // change if your FastAPI uses a different port

// Fetch Recently Played
export const fetchRecentlyPlayed = async () => {
  try {
    const res = await fetch(`${API_BASE}/recent`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching recently played:", err);
    return [];
  }
};

// Fetch “Made For You” playlists
export const fetchMadeForYou = async () => {
  try {
    const res = await fetch(`${API_BASE}/madeforyou`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching made for you:", err);
    return [];
  }
};

// Fetch top tracks
export const fetchTopTracks = async () => {
  try {
    const res = await fetch(`${API_BASE}/toptracks`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching top tracks:", err);
    return [];
  }
};
