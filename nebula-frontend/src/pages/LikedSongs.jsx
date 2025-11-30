// src/pages/LikedSongs.jsx
import React, { useEffect, useState } from "react";

export default function LikedSongs({ onPlay, onToggleLike, likedSet, refreshLiked }) {
  const backend = "http://127.0.0.1:8000";
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH LIKED SONGS ----------------
  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      const res = await fetch(`${backend}/liked/all`);
      if (!res.ok) throw new Error("Failed to load liked songs");
      const data = await res.json();
      setLikedSongs(data.liked || []);
    } catch (err) {
      console.error("Error loading liked songs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PLAY HANDLER ----------------
  const handlePlay = (track) => {
    if (!onPlay) return;
    // Pass full likedSongs array as context so MiniPlayer Next/Prev works
    onPlay(track, likedSongs);
  };

  // ---------------- UNLIKE HANDLER ----------------
  const handleUnlike = async (track) => {
    try {
      const res = await fetch(`${backend}/unlike?videoId=${track.videoId}`, {
        method: "POST",
      });
      if (res.ok) {
        // Refresh both local state + global liked list
        await fetchLikedSongs();
        await refreshLiked?.();
      }
    } catch (err) {
      console.error("Error unliking song:", err);
    }
  };

  // ---------------- UI RENDER ----------------
  return (
    <div style={{ padding: "30px 40px", color: "white" }}>
      <h1 style={{ fontSize: 38, fontWeight: 700, marginBottom: 4 }}>Liked Songs</h1>
      <p style={{ color: "#aaa" }}>Your favorite tracks.</p>

      {loading && <p style={{ color: "#aaa", marginTop: 40 }}>Loading your liked songs...</p>}

      {!loading && likedSongs.length === 0 && (
        <p style={{ color: "#555", marginTop: 40 }}>
          You haven’t liked any songs yet.
        </p>
      )}

      {!loading && likedSongs.length > 0 && (
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 24,
          }}
        >
          {likedSongs.map((song) => (
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
                e.currentTarget.style.boxShadow = "0 0 14px rgba(139,92,246,0.4)";
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
                {song.artist || song.channel || "Unknown Artist"}
              </div>

              {/*❤️ Like/Unlike Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnlike(song);
                }}
                style={{
                  background: likedSet?.has(song.videoId)
                    ? "rgba(139,92,246,0.2)"
                    : "transparent",
                  border: "1px solid #8b5cf6",
                  borderRadius: 20,
                  color: likedSet?.has(song.videoId) ? "#a855f7" : "#8b5cf6",
                  padding: "5px 10px",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "0.25s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#8b5cf6";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = likedSet?.has(song.videoId)
                    ? "rgba(139,92,246,0.2)"
                    : "transparent";
                  e.target.style.color = likedSet?.has(song.videoId)
                    ? "#a855f7"
                    : "#8b5cf6";
                }}
              >
                {likedSet?.has(song.videoId) ? "Unlike" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
