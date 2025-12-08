// src/components/ExpandedPlayer.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaHeart,
} from "react-icons/fa";
import { FiRepeat, FiVolume2, FiHeart, FiPlus, FiX } from "react-icons/fi";
import PlaylistModal from "./PlaylistModal";

export default function ExpandedPlayer({
  currentTrack,
  audioRef,
  onNext,
  onPrev,
  onToggleLike,
  likedSet,
  onClose,
  queue = [],
  onPlayTrack,
}) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!audioRef?.current?.paused);
  const [volume, setVolume] = useState(audioRef?.current?.volume || 1);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const isLiked = likedSet?.has?.(currentTrack?.videoId);
  const purple = "#8b5cf6";
  const pinkTint = "rgba(244, 114, 182, 0.08)";
  const blueTint = "rgba(96, 165, 250, 0.12)";

  // 🟣 GLOBAL SCALE VARIABLE — only this is new
  const playerScale = 0.65; // 1 = normal size, 0.8 smaller, 1.1 larger

  // APPLE MUSIC EXPANDED GLASS MORPHISM
  const appleMusicExpandedGlass = {
    background: `
      /* Base frosted glass */
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.12) 25%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.02) 100%
      ),
      /* Corner light flares */
      radial-gradient(
        120% 140% at 0% 0%,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 70%
      ),
      radial-gradient(
        120% 140% at 100% 100%,
        rgba(139, 92, 246, 0.15) 0%,
        transparent 70%
      )
    `,
    backdropFilter: "blur(30px) saturate(200%) brightness(1.1)",
    WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderTop: "1px solid rgba(255, 255, 255, 0.25)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    boxShadow: `
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15),
      0 25px 70px rgba(0, 0, 0, 0.5),
      0 15px 40px rgba(139, 92, 246, 0.25),
      0 5px 15px rgba(139, 92, 246, 0.1)
    `,
  };

  const appleMusicBackgroundOverlay = {
    background: `
      linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0.5) 30%,
        rgba(0, 0, 0, 0.25) 60%,
        rgba(0, 0, 0, 0.1) 100%
      )
    `,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
  };

  const appleMusicGlassOverlay = `
    radial-gradient(
      200% 150% at 50% -30%,
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.18) 40%,
      rgba(255, 255, 255, 0.05) 60%,
      transparent 80%
    )
  `;

  // Apple Music play button
  const appleMusicPlayButton = {
    background: isPlaying
      ? `radial-gradient(circle at 30% 30%, #8b5cf6 0%, #7c3aed 100%)`
      : `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`,
    boxShadow: isPlaying
      ? `
        0 0 0 6px rgba(139, 92, 246, 0.4),
        0 0 40px rgba(139, 92, 246, 0.9),
        0 0 60px rgba(139, 92, 246, 0.6)
      `
      : `
        0 8px 32px rgba(139, 92, 246, 0.6),
        0 12px 40px rgba(0, 0, 0, 0.4)
      `,
    animation: isPlaying ? "appleMusicPulseExpanded 2s infinite" : "none",
  };

  // Apple Music noise texture
  const noiseTexture = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E")`,
    backgroundSize: "140px 140px",
    opacity: 0.05,
    mixBlendMode: "overlay",
  };

  const togglePlay = () => {
    const audio = audioRef?.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
    setIsPlaying(!audio.paused);
  };

  const handleSeek = (e) => {
    const audio = audioRef?.current;
    if (!audio?.duration) return;
    const pct = parseFloat(e.target.value);
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="expanded-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1400,
          display: "grid",
          placeItems: "end center",
          ...appleMusicBackgroundOverlay,
        }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 40, scale: 0.96 * playerScale, opacity: 0 }}
          animate={{ y: 0, scale: 1 * playerScale, opacity: 1 }}
          exit={{ y: 40, scale: 0.96 * playerScale, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            transform: `scale(${playerScale})`,
            transformOrigin: "center bottom",
            width: "min(900px, 92vw)",
            maxHeight: "calc(145vh - 30px)",
            marginBottom: 16,
            borderRadius: 28,
            padding: 8,
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 240px",
            gap: 14,
            ...appleMusicExpandedGlass,
          }}
        >
          {/* Noise Texture Layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              ...noiseTexture,
            }}
          />

          {/* Glass Overlay Layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: appleMusicGlassOverlay,
              opacity: 0.4,
            }}
          />

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            title="Close"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(0, 0, 0, 0.25)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              zIndex: 10,
            }}
          >
            <FiX size={20} />
          </motion.button>

          {/* LEFT COLUMN */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              minWidth: 0,
              padding: "20px 20px 20px 24px",
            }}
          >
            {/* Album Art */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                borderRadius: 22,
                overflow: "hidden",
                position: "relative",
                boxShadow: `
                  0 20px 60px rgba(0, 0, 0, 0.6),
                  0 10px 30px rgba(139, 92, 246, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                aspectRatio: "1/1",
                width: "100%",
                maxWidth: "500px",
                alignSelf: "center",
              }}
            >
              <img
                src={
                  currentTrack?.thumbnail ||
                  `https://img.youtube.com/vi/${currentTrack?.videoId}/hqdefault.jpg`
                }
                alt={currentTrack?.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {isPlaying && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    inset: -10,
                    borderRadius: "50%",
                    border: "2px solid transparent",
                    borderTop: `2px solid rgba(168, 85, 247, 0.9)`,
                    borderRight: `2px solid rgba(244, 114, 182, 0.7)`,
                    filter:
                      "drop-shadow(0 0 8px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 12px rgba(244, 114, 182, 0.5))",
                    pointerEvents: "none",
                  }}
                />
              )}
            </motion.div>

            {/* PROGRESS + CONTROLS */}
            <div style={{ padding: "0 10px" }}>
              {/* Progress bar */}
              <div
                style={{
                  position: "relative",
                  height: 6,
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(8px)",
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: `
                      linear-gradient(
                        90deg,
                        rgba(139, 92, 246, 0.95),
                        rgba(139, 92, 246, 0.7) 70%,
                        #a78bfa 100%
                    )`,
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.9)",
                    transition: "width 120ms linear",
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.25"
                  value={progress}
                  onChange={handleSeek}
                  style={{
                    position: "absolute",
                    inset: -6,
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Title + Artist */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 24,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 4,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {currentTrack?.title}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  {currentTrack?.artist}
                </div>
              </div>

              {/* Control Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 28,
                  marginBottom: 20,
                }}
              >
                {/* Like */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleLike(currentTrack)}
                  title={isLiked ? "Unlike" : "Like"}
                  style={appleMusicIconButton(isLiked ? purple : undefined)}
                >
                  {isLiked ? <FaHeart color={purple} size={20} /> : <FiHeart size={20} />}
                </motion.button>

                {/* Add */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPlaylistModal(true)}
                  title="Add to playlist"
                  style={appleMusicIconButton()}
                >
                  <FiPlus size={20} />
                </motion.button>

                {/* Repeat */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRepeat((r) => !r)}
                  title={repeat ? "Repeat: ON" : "Repeat: OFF"}
                  style={appleMusicIconButton(repeat ? purple : undefined)}
                >
                  <FiRepeat size={20} />
                </motion.button>
              </div>

              {/* Playback Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 32,
                  marginBottom: 20,
                }}
              >
                {/* Prev */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onPrev}
                  title="Previous"
                  style={appleMusicControlButton()}
                >
                  <FaStepBackward size={20} />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: appleMusicPlayButton.background,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: appleMusicPlayButton.boxShadow,
                    animation: appleMusicPlayButton.animation,
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isPlaying ? (
                    <FaPause size={22} />
                  ) : (
                    <FaPlay size={22} style={{ marginLeft: 2 }} />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at center, white 0%, transparent 70%)",
                      opacity: isPlaying ? 0.2 : 0.15,
                      pointerEvents: "none",
                    }}
                  />
                </motion.button>

                {/* Next */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onNext}
                  title="Next"
                  style={appleMusicControlButton()}
                >
                  <FaStepForward size={20} />
                </motion.button>
              </div>

              {/* Volume */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: "12px 20px",
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: 16,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <FiVolume2 size={20} color="rgba(255,255,255,0.9)" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    outline: "none",
                    accentColor: purple,
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Up Next (dynamic) */}
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: 20,
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    margin: "20px 20px 20px 0",
  }}
>
  <div
    style={{
      color: "#fff",
      fontWeight: 700,
      fontSize: 18,
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    Up Next
  </div>

  {queue.length > 0 ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {queue.map((track, i) => (
        <motion.div
          key={track.videoId || i}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onPlayTrack?.(track)} // optional: play clicked
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background:
              track.videoId === currentTrack?.videoId
                ? "rgba(139,92,246,0.25)"
                : "rgba(255,255,255,0.05)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            transition: "0.2s ease",
          }}
        >
          <img
            src={
              track.thumbnail ||
              `https://img.youtube.com/vi/${track.videoId}/default.jpg`
            }
            alt={track.title}
            style={{
              width: 46,
              height: 46,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
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
              {track.title}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
              }}
            >
              {track.artist || "Unknown Artist"}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
   <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
  {queue && queue.length > 0 ? (
    queue.map((song, i) => (
      <motion.div
        key={song.videoId}
        onClick={() => playTrack(song)}
        whileHover={{ scale: 1.02 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,0.06)",
          padding: "8px 10px",
          borderRadius: 12,
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <img
          src={song.thumbnail}
          alt={song.title}
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
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
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {song.artist}
          </div>
        </div>
      </motion.div>
    ))
  ) : (
    <div
      style={{
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        padding: "30px 0",
        fontSize: 14,
      }}
    >
      Nothing queued — play something to start your Up Next list.
    </div>
  )}
</div>


        </motion.div>
      </motion.div>

      {showPlaylistModal && (
        <PlaylistModal
          track={currentTrack}
          backend="http://127.0.0.1:8000"
          onClose={() => setShowPlaylistModal(false)}
        />
      )}

      <style>{`
        @keyframes appleMusicPulseExpanded {
          0%, 100% {
            box-shadow: 
              0 0 0 0 rgba(139, 92, 246, 0.4),
              0 0 40px rgba(139, 92, 246, 0.8),
              0 0 60px rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 
              0 0 0 10px rgba(139, 92, 246, 0.3),
              0 0 50px rgba(139, 92, 246, 1),
              0 0 80px rgba(139, 92, 246, 0.6);
          }
        }
      `}</style>
    </AnimatePresence>
  );
}

// Buttons
function appleMusicIconButton(activeColor) {
  return {
    width: 48,
    height: 48,
    borderRadius: 14,
    border: activeColor
      ? `1px solid ${activeColor}80`
      : "1px solid rgba(255,255,255,0.2)",
    background: activeColor
      ? `rgba(139,92,246,0.15)`
      : "rgba(255,255,255,0.08)",
    color: activeColor ? activeColor : "rgba(255,255,255,0.9)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    transition: "all 0.2s ease",
  };
}

function appleMusicControlButton() {
  return {
    width: 52,
    height: 52,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.9)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    transition: "all 0.2s ease",
  };
}
