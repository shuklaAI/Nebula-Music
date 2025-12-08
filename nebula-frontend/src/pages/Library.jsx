import React, { useEffect, useState } from "react";
import { FiMusic, FiPlay, FiTrash2, FiDownload } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Library({ onPlay, onToggleLike, likedSet }) {
  const backend = "http://127.0.0.1:8000";
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  // Fetch playlists + liked songs
  useEffect(() => {
    fetchPlaylists();
    fetchLikedSongs();
  }, []);

  async function fetchPlaylists() {
    try {
      const res = await fetch(`${backend}/playlist/all`);
      if (!res.ok) throw new Error("Failed to fetch playlists");
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error("Error loading playlists:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLikedSongs() {
    try {
      const res = await fetch(`${backend}/liked/all`);
      if (res.ok) {
        const data = await res.json();
        setLikedSongs(data.liked || []);
      }
    } catch (err) {
      console.error("Failed to load liked songs:", err);
    }
  }

  async function deletePlaylist(id) {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const res = await fetch(`${backend}/playlist/delete?playlist_id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  }

  const handlePlay = (song) => onPlay && onPlay(song);

  const handlePlayAll = () => {
    if (likedSongs.length > 0) onPlay(likedSongs[0]);
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(90deg, #fff, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <FiMusic size={32} />
          Your Library
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
          Manage your music collection, playlists, and saved content.
        </p>
      </div>

      {/* Stats Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          { label: "Total Songs", value: likedSongs.length, color: "#8b5cf6" },
          { label: "Playlists", value: playlists.length, color: "#d946ef" },
          { label: "Artists", value: "—", color: "#3b82f6" },
          { label: "Albums", value: "—", color: "#10b981" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${stat.color}20`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiMusic size={22} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {stat.label}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: `${60 + i * 10}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Liked Songs Section */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FaHeart color="#8b5cf6" /> Liked Songs
            <span style={{ color: "#aaa", fontSize: 14 }}>
              • {likedSongs.length} songs
            </span>
          </h2>
          {likedSongs.length > 0 && (
            <button
              onClick={handlePlayAll}
              style={{
                padding: "10px 22px",
                background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                border: "none",
                borderRadius: "24px",
                color: "#fff",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <FiPlay size={16} /> Play All
            </button>
          )}
        </div>

        {likedSongs.length === 0 ? (
          <p style={{ color: "#777" }}>You haven’t liked any songs yet.</p>
        ) : (
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {likedSongs.map((track, i) => (
              <div
                key={track.videoId}
                onClick={() => handlePlay(track)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr 80px 60px",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ color: "#888", fontSize: 14 }}>{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{track.title}</div>
                  <div style={{ color: "#aaa", fontSize: 13 }}>
                    {track.artist}
                  </div>
                </div>
                <span style={{ color: "#888", fontSize: 14 }}>
                  {track.duration || "—"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(track);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: likedSet?.has(track.videoId)
                      ? "#8b5cf6"
                      : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                >
                  <FaHeart size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Playlists Section */}
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        <FiMusic style={{ marginRight: 8 }} /> Playlists • {playlists.length}
      </h2>

      {loading && <p style={{ color: "#888" }}>Loading playlists...</p>}
      {!loading && playlists.length === 0 && (
        <p style={{ color: "#777" }}>You haven’t created any playlists yet.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
          marginTop: 20,
        }}
      >
        {!loading &&
          playlists.map((p) => (
            <div
              key={p.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{p.name}</h3>
                <FiTrash2
                  color="#ff5555"
                  size={18}
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(p.id);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <p style={{ color: "#aaa", fontSize: 13, marginBottom: 10 }}>
                {p.songs?.length || 0} songs
              </p>

              {expanded === p.id && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "16px",
                    marginTop: 10,
                  }}
                >
                  {p.songs && p.songs.length > 0 ? (
                    p.songs.map((s) => (
                      <div
                        key={s.videoId}
                        onClick={() => handlePlay(s)}
                        style={{
                          background: "#181818",
                          borderRadius: "10px",
                          padding: "10px",
                          transition: "all 0.25s ease",
                          textAlign: "center",
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
                            s.thumbnail ||
                            `https://img.youtube.com/vi/${s.videoId}/mqdefault.jpg`
                          }
                          alt={s.title}
                          style={{
                            width: "100%",
                            height: 140,
                            borderRadius: 8,
                            objectFit: "cover",
                            marginBottom: 10,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                            marginBottom: 4,
                          }}
                        >
                          {s.title.length > 20
                            ? s.title.slice(0, 20) + "..."
                            : s.title}
                        </div>
                        <div style={{ color: "#aaa", fontSize: 12 }}>
                          {s.artist || "Unknown"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#777" }}>No songs yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
