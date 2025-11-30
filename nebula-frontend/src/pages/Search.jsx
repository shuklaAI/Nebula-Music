import React, { useState } from "react";

export default function Search({ onPlay }) {
  const backend = "http://127.0.0.1:8000";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = await fetch(`${backend}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data || []);
  };

  const handlePlay = (song) => {
    onPlay(song, results); // pass entire results as queue
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700 }}>Search</h1>
      <form onSubmit={handleSearch} style={{ marginTop: 20, marginBottom: 30 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs or artists..."
          style={{
            width: "80%",
            padding: "12px 16px",
            borderRadius: 8,
            border: "none",
            outline: "none",
            background: "#181818",
            color: "#fff",
            fontSize: 16,
          }}
        />
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 24,
        }}
      >
        {results.map((song) => (
          <div
            key={song.videoId}
            onClick={() => handlePlay(song)}
            style={{
              background: "#121212",
              borderRadius: 12,
              padding: 16,
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 0 12px rgba(139,92,246,0.4)";
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
                width: "100%",
                height: 160,
                borderRadius: 8,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
              {song.title.length > 25
                ? song.title.slice(0, 25) + "..."
                : song.title}
            </div>
            <div style={{ color: "#aaa", fontSize: 13 }}>{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
