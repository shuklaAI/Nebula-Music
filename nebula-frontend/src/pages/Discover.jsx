// src/pages/Discover.jsx
import React, { useEffect, useState } from "react";

export default function Discover({ onPlay }) {
  const backend = "http://127.0.0.1:8000";
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscoverSongs();
  }, []);

  async function fetchDiscoverSongs() {
    try {
      const moods = ["chill", "lofi", "acoustic", "pop", "indie", "romantic", "trap", "instrumental"];
      const randomQuery = moods[Math.floor(Math.random() * moods.length)];
      const res = await fetch(`${backend}/search?q=${encodeURIComponent(randomQuery)}`);
      if (!res.ok) throw new Error("Failed to fetch discover songs");
      const data = await res.json();
      setTracks(Array.isArray(data) ? data.slice(0, 20) : []);
    } catch (err) {
      console.error("Error fetching discover songs:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePlay = (track) => {
    if (onPlay) onPlay(track, tracks); // ✅ pass full list as queue
  };

  return (
    <div style={{ padding: "20px 40px", color: "white" }}>
      <h1 style={{ fontSize: 38, fontWeight: 700 }}>Discover</h1>
      <p style={{ color: "#aaa", marginTop: 6 }}>
        Explore new music and find tracks you might love.
      </p>

      {loading && <p style={{ color: "#888", marginTop: 40 }}>Loading...</p>}

      {!loading && tracks.length === 0 && (
        <p style={{ color: "#555", marginTop: 40 }}>
          Couldn’t find songs. Try reloading!
        </p>
      )}

      {!loading && tracks.length > 0 && (
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 24,
          }}
        >
          {tracks.map((song) => (
            <div
              key={song.videoId}
              onClick={() => handlePlay(song)}
              style={{
                background: "#121212",
                borderRadius: 12,
                padding: 12,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 0 14px rgba(139,92,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src={
                  song.thumbnail ||
                  `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`
                }
                alt={song.title}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 8,
                  objectFit: "cover",
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                {song.title.length > 25
                  ? song.title.slice(0, 25) + "..."
                  : song.title}
              </div>
              <div
                style={{
                  color: "#aaa",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {song.artist}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
