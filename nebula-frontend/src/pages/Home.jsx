// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import api from "../api/nebulaApi";

export default function Home({ onPlay }) {
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [mixes, setMixes] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const backend = "http://127.0.0.1:8000";

  useEffect(() => {
    loadHome();
    loadPlaylist();
    loadMadeForYou();
    loadTopTracks();
  }, []);

  // ======================================================
  // 🏠 Load Home Data
  // ======================================================
  async function loadHome() {
    try {
      const trendKeywords = [
        "trending hits 2025",
        "new english songs 2025",
        "bollywood trending songs",
        "top charts 2025",
        "viral songs 2025",
      ];
      const randomQ =
        trendKeywords[Math.floor(Math.random() * trendKeywords.length)];
      const trending = await api.searchSongs(randomQ);
      setPopular(trending.slice(0, 6));

      const stored = JSON.parse(localStorage.getItem("recentPlayed") || "[]");
      const repaired = await Promise.all(
        stored.map(async (song) => {
          if (!song.title || !song.thumbnail) {
            try {
              const refetch = await api.searchSongs(song.videoId);
              return refetch[0] || song;
            } catch {
              return song;
            }
          }
          return song;
        })
      );
      setRecent(repaired);
    } catch (err) {
      console.error("Home load error:", err);
    }
  }

  // ======================================================
  // 🎵 Load Playlists
  // ======================================================
  async function loadPlaylist() {
    try {
      const res = await fetch(`${backend}/playlist/all`);
      const data = await res.json();
      const allPlaylists = data.playlists || [];
      const combinedSongs = allPlaylists.flatMap((pl) =>
        pl.songs.map((s) => ({
          ...s,
          playlistName: pl.name,
        }))
      );
      setPlaylist(combinedSongs);
    } catch (err) {
      console.error("Playlist load error:", err);
    }
  }

  // ======================================================
  // 🎧 Load Made for You (keep layout exactly as before)
  // ======================================================
  async function loadMadeForYou() {
    try {
      const cached = localStorage.getItem("nebula_mixes");
      if (cached) {
        setMixes(JSON.parse(cached));
        return;
      }

      const mixThemes = [
        { name: "Lofi Chill Mix", query: "lofi chill beats 2025" },
        { name: "Workout Power Mix", query: "workout gym songs 2025" },
        { name: "Top Bollywood Mix", query: "bollywood top hits 2025" },
        { name: "Evening Vibes", query: "relaxing acoustic songs 2025" },
      ];

      const results = await Promise.all(
        mixThemes.map(async (mix) => {
          const songs = await api.searchSongs(mix.query);
          return { ...mix, songs: songs.slice(0, 6) };
        })
      );

      setMixes(results);
      localStorage.setItem("nebula_mixes", JSON.stringify(results));
    } catch (err) {
      console.error("Made For You load error:", err);
    }
  }

  // ======================================================
  // 🎧 Load Top Tracks
  // ======================================================
  async function loadTopTracks() {
    try {
      const songs = await api.searchSongs("top global hits 2025");
      setTopTracks(songs.slice(0, 6));
    } catch (err) {
      console.error("Top Tracks load error:", err);
    }
  }

  // ======================================================
  // ▶️ Play Song
  // ======================================================
  async function handlePlay(track, contextList) {
    try {
      const streamRes = await fetch(
        `${backend}/stream?url=https://www.youtube.com/watch?v=${track.videoId}`
      );
      const streamData = await streamRes.json();
      const playableTrack = { ...track, url: streamData.url };
      if (onPlay) onPlay(playableTrack, contextList);

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

  // ======================================================
  // 🎨 SongCard
  // ======================================================
  const SongCard = ({ item, list }) => (
    <div
      onClick={() => handlePlay(item, list)}
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
        {item.artist || item.playlistName || "Unknown Artist"}
      </div>
    </div>
  );

  // ======================================================
  // 🖼️ Render UI
  // ======================================================
  return (
    <div style={{ padding: "20px 40px", color: "white" }}>
      <h1 style={{ fontSize: 40, fontWeight: 700 }}>Good evening</h1>
      <p style={{ color: "#aaa", marginTop: 6 }}>
        Ready to jam to some music?
      </p>

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

      {/* Made For You (untouched layout) */}
      <h2 style={{ marginTop: 50, fontSize: 24 }}>Made For You</h2>
      {mixes.length === 0 ? (
        <p style={{ color: "#555" }}>Loading your daily mixes...</p>
      ) : (
        mixes.map((mix, idx) => (
          <div key={idx} style={{ marginTop: 25 }}>
            <h3 style={{ fontSize: 20, marginBottom: 15 }}>{mix.name}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 20,
              }}
            >
              {mix.songs.map((item) => (
                <SongCard key={item.videoId} item={item} list={mix.songs} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Your Top Tracks (added below Made For You) */}
      <h2
        style={{
          marginTop: 60,
          fontSize: 24,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: 10 }}>🎧 Trending Tracks </span>
        <span style={{ color: "#888", fontSize: 14 }}>• This month</span>
      </h2>

      <div
        style={{
          background: "#121212",
          borderRadius: 10,
          padding: 16,
          marginTop: 16,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#888", textAlign: "left", fontSize: 13 }}>
              <th style={{ padding: "10px 5px" }}>#</th>
              <th style={{ padding: "10px 5px" }}>Title</th>
              <th style={{ padding: "10px 5px" }}>Artist</th>
              <th style={{ padding: "10px 5px" }}>Duration</th>
              <th style={{ padding: "10px 5px" }}>Plays</th>
            </tr>
          </thead>
          <tbody>
            {topTracks.map((track, idx) => (
              <tr
                key={track.videoId}
                onClick={() => handlePlay(track, topTracks)}
                style={{
                  borderTop: "1px solid #222",
                  color: "#ddd",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                <td style={{ padding: "10px 5px" }}>{idx + 1}</td>
                <td style={{ padding: "10px 5px" }}>{track.title}</td>
                <td style={{ padding: "10px 5px" }}>{track.artist}</td>
                <td style={{ padding: "10px 5px" }}>
                  {Math.floor(Math.random() * 3) + 2}:
                  {Math.floor(Math.random() * 60)
                    .toString()
                    .padStart(2, "0")}
                </td>
                <td style={{ padding: "10px 5px" }}>
                  {Math.floor(Math.random() * 5) + 1}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popular Right Now */}
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

      {/* Your Playlist */}
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
