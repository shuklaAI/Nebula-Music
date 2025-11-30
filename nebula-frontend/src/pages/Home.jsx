// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import api from "../api/nebulaApi";

export default function Home({ onPlay }) {
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const backend = "http://127.0.0.1:8000";

  useEffect(() => {
    loadHome();
    loadPlaylist();
  }, []);

  async function loadHome() {
    try {
      const trending = await api.searchSongs("trending songs 2025");
      setPopular(trending.slice(0, 6));
      const stored = JSON.parse(localStorage.getItem("recentPlayed") || "[]");
      setRecent(stored);
    } catch (err) {
      console.error("Home load error:", err);
    }
  }

  async function loadPlaylist() {
    try {
      const res = await fetch(`${backend}/playlist`);
      const data = await res.json();
      setPlaylist(data.playlist || []);
    } catch (err) {
      console.error("Playlist load error:", err);
    }
  }

  // ✅ accepts full context list
  async function handlePlay(track, contextList) {
    try {
      const streamRes = await fetch(
        `${backend}/stream?url=https://www.youtube.com/watch?v=${track.videoId}`
      );
      const streamData = await streamRes.json();
      const playableTrack = { ...track, url: streamData.url };

      if (onPlay) onPlay(playableTrack, contextList); // <-- pass context

      const old = JSON.parse(localStorage.getItem("recentPlayed") || "[]");
      const updated = [
        playableTrack,
        ...old.filter((x) => x.videoId !== playableTrack.videoId),
      ].slice(0, 10);
      localStorage.setItem("recentPlayed", JSON.stringify(updated));
      setRecent(updated);
    } catch (err) {
      console.error("Play error:", err);
    }
  }

  const SongCard = ({ item, list }) => (
    <div
      onClick={() => handlePlay(item, list)} // <-- pass section list
      style={{
        padding: 12,
        borderRadius: 10,
        background: "#121212",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={
          item.thumbnail ||
          `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`
        }
        alt={item.title}
        style={{
          width: "100%",
          height: 160,
          borderRadius: 8,
          objectFit: "cover",
          marginBottom: 10,
        }}
      />
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.title}
      </div>
      <div style={{ marginTop: 4, color: "#aaa", fontSize: 13 }}>
        {item.artist}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px 40px", color: "white" }}>
      <h1 style={{ fontSize: 40, fontWeight: 700 }}>Good evening</h1>
      <p style={{ color: "#aaa", marginTop: 6 }}>Ready to jam to some music?</p>

      {/* Recently Played */}
      <h2 style={{ marginTop: 40, fontSize: 24 }}>Recently Played</h2>
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {recent.length === 0 ? (
          <p style={{ color: "#555" }}>Play songs to fill this area</p>
        ) : (
          recent.map((item) => (
            <SongCard key={item.videoId} item={item} list={recent} />
          ))
        )}
      </div>

      {/* Popular */}
      <h2 style={{ marginTop: 50, fontSize: 24 }}>Popular Right Now</h2>
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {popular.map((item) => (
          <SongCard key={item.videoId} item={item} list={popular} />
        ))}
      </div>

      {/* Playlist Section */}
      <h2 style={{ marginTop: 50, fontSize: 24 }}>Your Playlist</h2>
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {playlist.length === 0 ? (
          <p style={{ color: "#555" }}>No songs added to your playlist yet.</p>
        ) : (
          playlist.map((item) => (
            <SongCard key={item.videoId} item={item} list={playlist} />
          ))
        )}
      </div>
    </div>
  );
}
