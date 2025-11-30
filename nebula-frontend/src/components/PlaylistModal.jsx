// src/components/PlaylistModal.jsx
import React, { useState, useEffect } from "react";

export default function PlaylistModal({ track, backend, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${backend}/playlist/all`);
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToPlaylist = async (playlistId) => {
    try {
      const thumb =
        track.thumbnail ||
        `https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg`;

      const res = await fetch(`${backend}/playlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlist_id: playlistId,
          videoId: track.videoId,
          title: track.title,
          artist: track.artist,
          thumbnail: thumb,
        }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);

      setMessage(
        `✅ Added "${track.title}" to ${
          playlists.find((p) => p.id === playlistId)?.name || "playlist"
        }`
      );
      setTimeout(() => onClose(), 900);
    } catch (err) {
      console.error("Error adding to playlist:", err);
      setMessage("❌ Failed to add song. Check backend.");
    }
  };

  const createPlaylist = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${backend}/playlist/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();

      // Robust ID extraction — works for all backend responses
      const newId =
        data.id ||
        data.playlist_id ||
        data.playlistId ||
        data?.playlist?.id ||
        data?.playlist?.playlist_id;

      if (!newId) {
        console.error("Unexpected backend response:", data);
        throw new Error("Backend did not return playlist ID");
      }

      await addToPlaylist(newId);
      await fetchPlaylists();
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setMessage("❌ Failed to create playlist. (Check backend response)");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#181818",
          borderRadius: 12,
          padding: "24px 32px",
          width: 380,
          maxHeight: "70vh",
          overflowY: "auto",
          boxShadow: "0 0 18px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ color: "#fff", fontSize: 22, marginBottom: 10 }}>
          Add to Playlist
        </h2>
        <p style={{ color: "#aaa", fontSize: 14, marginBottom: 18 }}>
          Select an existing playlist or create a new one.
        </p>

        {loading ? (
          <p style={{ color: "#aaa" }}>Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14, marginBottom: 10 }}>
            You have no playlists yet.
          </p>
        ) : (
          playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => addToPlaylist(pl.id)}
              style={{
                background: "#222",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 8,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#2d2d2d")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#222")}
            >
              {pl.name}
            </div>
          ))
        )}

        <div style={{ marginTop: 16 }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New playlist name"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #333",
              background: "#0b0b0b",
              color: "#fff",
              outline: "none",
            }}
          />
          <button
            onClick={createPlaylist}
            disabled={creating}
            style={{
              width: "100%",
              marginTop: 10,
              background: "#8b5cf6",
              border: "none",
              padding: "8px 0",
              borderRadius: 6,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              opacity: creating ? 0.6 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {creating ? "Creating..." : "Create & Add"}
          </button>
        </div>

        {message && (
          <p
            style={{
              marginTop: 12,
              fontSize: 13,
              color: message.startsWith("✅") ? "#8b5cf6" : "#ff5555",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
