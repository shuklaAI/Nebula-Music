import React from "react";

export default function UpNext({ upNextQueue, currentTrack, onPlay }) {
  return (
    <div
      className="glass-effect fade-in"
      style={{
        width: "320px",
        height: "480px",
        padding: "20px",
        borderRadius: "16px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        background: "rgba(20,20,30,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Up Next
      </h3>

      {(!upNextQueue || upNextQueue.length === 0) ? (
        <p style={{ color: "#aaa" }}>Nothing queued yet.</p>
      ) : (
        upNextQueue.slice(1).map((song, i) => (
          <div
            key={song.videoId || i}
            onClick={() => onPlay(song, upNextQueue)}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "14px",
              gap: "12px",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "10px",
              transition: "0.25s ease",
              background:
                currentTrack?.videoId === song.videoId
                  ? "rgba(139,92,246,0.2)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(139,92,246,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                currentTrack?.videoId === song.videoId
                  ? "rgba(139,92,246,0.2)"
                  : "transparent")
            }
          >
            <img
              src={
                song.thumbnail ||
                `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`
              }
              alt={song.title}
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {song.title}
              </div>
              <div
                style={{
                  color: "#aaa",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {song.artist || "Unknown Artist"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
