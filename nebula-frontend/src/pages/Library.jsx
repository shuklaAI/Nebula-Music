import React, { useEffect, useState } from "react";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";

export default function Library({ onPlay }) {
  const backend = "http://127.0.0.1:8000";
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchPlaylists();
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

  async function deletePlaylist(id) {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const res = await fetch(`${backend}/playlist/delete?playlist_id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPlaylists((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  }

  const handlePlay = (song) => {
    if (onPlay) onPlay(song);
  };

  return (
    <div style={{ padding: "20px 40px", color: "white" }}>
      <h1 style={{ fontSize: 38, fontWeight: 700 }}>Your Library</h1>
      <p style={{ color: "#aaa", marginTop: 6 }}>
        Your playlists & songs will appear here.
      </p>

      {loading && <p style={{ color: "#888", marginTop: 40 }}>Loading playlists...</p>}

      {!loading && playlists.length === 0 && (
        <p style={{ color: "#555", marginTop: 40 }}>
          You haven’t created any playlists yet.
        </p>
      )}

      {!loading &&
        playlists.length > 0 &&
        playlists.map((playlist) => (
          <div
            key={playlist.id}
            style={{
              marginTop: 40,
              background: "#121212",
              borderRadius: 12,
              padding: "20px 24px",
              boxShadow: "0 0 12px rgba(0,0,0,0.3)",
              transition: "all 0.25s ease",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                setExpanded(expanded === playlist.id ? null : playlist.id)
              }
            >
              <div>
                <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 600 }}>
                  {playlist.name}
                </h2>
                <p style={{ color: "#aaa", fontSize: 13 }}>
                  {playlist.songs?.length || 0} songs
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#8b5cf6",
                }}
              >
                <FiTrash2
                  size={20}
                  color="#ff5555"
                  style={{ cursor: "pointer" }}
                  title="Delete playlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(playlist.id);
                  }}
                />
                <div
                  style={{
                    fontSize: 24,
                    transform:
                      expanded === playlist.id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  ▼
                </div>
              </div>
            </div>

            {/* Expanded Song Grid */}
            {expanded === playlist.id && playlist.songs?.length > 0 && (
              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 24,
                }}
              >
                {playlist.songs.map((song) => (
                  <div
                    key={song.videoId}
                    onClick={() => handlePlay(song)}
                    style={{
                      background: "#181818",
                      borderRadius: 10,
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
                        width: 140,
                        height: 140,
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

            {expanded === playlist.id && (!playlist.songs || playlist.songs.length === 0) && (
              <p style={{ color: "#777", marginTop: 16, marginLeft: 4 }}>
                No songs in this playlist yet.
              </p>
            )}
          </div>
        ))}
    </div>
  );
}
