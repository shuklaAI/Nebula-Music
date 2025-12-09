// src/components/MiniPlayer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart } from "react-icons/fa";
import { FiRepeat, FiVolume2, FiHeart, FiPlus, FiX } from "react-icons/fi";

export default function MiniPlayer({
  currentTrack,
  audioRef,
  setCurrentTrack,
  likedSet,
  onToggleLike,
  onNext,
  onPrev,
  upNextQueue,
  onPlay,
}) {
  const backend = "http://127.0.0.1:8000";

  // --- hooks first: never conditionally declare hooks
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const raf = useRef(null);

  // mirror currentTrack into visibility
  useEffect(() => {
    if (currentTrack?.videoId) setIsVisible(true);
    else setIsVisible(false);
  }, [currentTrack?.videoId]);

  // derive liked from global truth
  const isLiked = useMemo(
    () => !!likedSet?.has?.(currentTrack?.videoId),
    [likedSet, currentTrack?.videoId]
  );

  // wire audio events
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onTime = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        if (!audio.duration) return;
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      });
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (onNext) {
        onNext();
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioRef, repeat, onNext]);

  // ensure stream src if parent didn't set it already
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio || !currentTrack?.videoId) return;
    const ensure = async () => {
      if (audio.src && audio.src.startsWith("http")) return;
      try {
        const r = await fetch(
          `${backend}/stream?url=${encodeURIComponent(
            `https://www.youtube.com/watch?v=${currentTrack.videoId}`
          )}`
        );
        const { url } = await r.json();
        if (url) audio.src = url;
      } catch (e) {
        console.error("Mini ensure stream failed:", e);
      }
    };
    ensure();
  }, [audioRef, currentTrack?.videoId]);

  // keep volume in sync
  useEffect(() => {
    if (audioRef?.current) audioRef.current.volume = volume;
  }, [volume, audioRef]);

  // handlers
  const togglePlay = () => {
    const a = audioRef?.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const handleSeek = (e) => {
    const a = audioRef?.current;
    if (!a || !a.duration) return;
    const pct = parseFloat(e.target.value);
    a.currentTime = (pct / 100) * a.duration;
    setProgress(pct);
  };

  const handleToggleLike = () => {
    if (!currentTrack) return;
    onToggleLike?.(currentTrack);
  };

  const openExpanded = () => setIsExpanded(true);
  const closeExpanded = () => setIsExpanded(false);

  const openPlaylistModal = () => setShowPlaylistModal(true);

  // Format time function
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isVisible || !currentTrack) return null;

  // --- shared styles
  const purple = "#8b5cf6"; // accent
  const glassBg =
    "linear-gradient( to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02) )";
  const glassOverlay =
    "radial-gradient(120% 200% at 50% -50%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.25) 100%)";

  // Sample upNext data (replace with actual upNextQueue)
  const sampleUpNext = [
    { title: "The Best Acoustic Cover of Popular Songs", artist: "Acoustic Songs", duration: "3:45", videoId: "1" },
    { title: "Ulla Records", artist: "Video Jukebox", duration: "4:20", videoId: "2" },
    { title: "100M Blockbusters", artist: "90's Evergreen !", duration: "3:15", videoId: "3" },
    { title: "Tips Official", artist: "Latest Hits", duration: "3:58", videoId: "4" },
    { title: "Ek Din Pyaar || m", artist: "BRAZI-IDOL", duration: "4:32", videoId: "5" },
    { title: "Daftar Ki Girl Fui", artist: "T-Series", duration: "3:27", videoId: "6" },
    { title: "Romantic Mix", artist: "Love Songs", duration: "4:15", videoId: "7" },
    { title: "Workout Beats", artist: "Energy Mix", duration: "3:40", videoId: "8" },
  ];

  const displayUpNext = upNextQueue && upNextQueue.length > 0 ? upNextQueue : sampleUpNext;

  return (
    <>
      {/* MINI (Apple-like) */}
      <div
        role="button"
        onClick={openExpanded}
        style={{
          position: "fixed",
          left: 260,
          right: 20,
          bottom: 18,
          height: 72,
          borderRadius: 18,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          zIndex: 1200,

          // Liquid glass stack
          background: `${glassBg}`,
          backdropFilter: "blur(16px) saturate(1.2)",
          WebkitBackdropFilter: "blur(16px) saturate(1.2)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 30px rgba(0,0,0,0.45), 0 4px 16px rgba(139,92,246,0.18)",
          overflow: "hidden",
        }}
      >
        {/* inner gloss */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: glassOverlay,
          }}
        />
        {/* rim highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 10,
            right: 10,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* cover */}
        <img
          src={
            currentTrack.thumbnail ||
            `https://img.youtube.com/vi/${currentTrack.videoId}/mqdefault.jpg`
          }
          alt={currentTrack.title}
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            objectFit: "cover",
            flex: "0 0 auto",
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* titles */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack.title}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 12,
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack.artist}
          </div>
        </div>

        {/* controls (clicks don't bubble to open) */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPrev?.();
            }}
            title="Previous"
            style={{ cursor: "pointer" }}
          >
            <FaStepBackward size={16} color="#fff" />
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            title={isPlaying ? "Pause" : "Play"}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: purple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isPlaying
                ? "0 0 20px 6px rgba(139,92,246,0.85)"
                : "0 0 12px 3px rgba(139,92,246,0.45)",
              animation: isPlaying ? "pulseMini 1.6s infinite" : "none",
            }}
          >
            {isPlaying ? <FaPause size={16} color="#fff" /> : <FaPlay size={16} color="#fff" style={{ marginLeft: 1 }} />}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
            title="Next"
            style={{ cursor: "pointer" }}
          >
            <FaStepForward size={16} color="#fff" />
          </div>

          {/* like */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLike();
            }}
            title={isLiked ? "Unlike" : "Like"}
            style={{ cursor: "pointer" }}
          >
            {isLiked ? <FaHeart size={16} color={purple} /> : <FiHeart size={18} color="#ddd" />}
          </div>

          {/* add */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              openPlaylistModal();
            }}
            title="Add to playlist"
            style={{ cursor: "pointer" }}
          >
            <FiPlus size={18} color="#ddd" />
          </div>
        </div>

        {/* Apple-like thin progress on top edge */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            left: 10,
            right: 10,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
          title="Seek"
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.95), rgba(139,92,246,0.55))",
              boxShadow: "0 0 12px rgba(139,92,246,0.75)",
              transition: "width 120ms linear",
            }}
          />
          {/* invisible range input overlay for accurate seeking */}
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
      </div>

      {/* EXPANDED OVERLAY - FIXED SIZING */}
      {isExpanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.65), rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.05))",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(8px)",
            animation: "fadeIn 200ms ease",
            padding: "20px",
          }}
          onClick={closeExpanded}
        >
          {/* panel - CONSISTENT SIZE */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, calc(100vw - 40px))",
              maxHeight: "calc(100vh - 40px)",
              borderRadius: 26,
              padding: "20px",
              background: glassBg,
              backdropFilter: "blur(24px) saturate(1.15)",
              WebkitBackdropFilter: "blur(24px) saturate(1.15)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 18px 60px rgba(0,0,0,0.55), 0 10px 28px rgba(139,92,246,0.22)",
              position: "relative",
              overflow: "hidden",
              transformOrigin: "center",
              animation: "riseUp 240ms cubic-bezier(.2,.8,.2,1)",
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) 300px",
              gap: 24,
            }}
          >
            {/* gloss */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: glassOverlay,
              }}
            />
            {/* close */}
            <button
              onClick={closeExpanded}
              title="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.25)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                zIndex: 10,
              }}
            >
              <FiX />
            </button>

            {/* left: art + transport */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                minWidth: 0,
                paddingRight: 10,
              }}
            >
              {/* Album art with neon ring - PROPERLY CONSTRAINED */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "300px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "min(280px, 70%)",
                    aspectRatio: "1/1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Rotating + Pulsing Neon Ring - FIXED POSITIONING */}
                  {isPlaying && (
                    <div
                      style={{
                        position: "absolute",
                        width: "calc(100% + 32px)",
                        height: "calc(100% + 32px)",
                        borderRadius: "50%",
                        border: "3px solid transparent",
                        borderTop: `3px solid ${purple}`,
                        borderRight: "3px solid rgba(244,114,182,0.8)",
                        filter:
                          "drop-shadow(0 0 15px rgba(139,92,246,0.9)) drop-shadow(0 0 25px rgba(244,114,182,0.5))",
                        animation:
                          "rotateRing 10s linear infinite, pulseGlow 3s ease-in-out infinite",
                        pointerEvents: "none",
                        transformOrigin: "center",
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Album Art */}
                  <div
                    style={{
                      borderRadius: "50%",
                      overflow: "hidden",
                      position: "relative",
                      boxShadow:
                        "0 16px 50px rgba(0,0,0,0.55), 0 6px 18px rgba(139,92,246,0.25)",
                      width: "100%",
                      height: "100%",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={
                        currentTrack.thumbnail ||
                        `https://img.youtube.com/vi/${currentTrack.videoId}/hqdefault.jpg`
                      }
                      alt={currentTrack.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* subtle shine */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "radial-gradient(120% 140% at 100% -20%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 40%, transparent 60%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* transport - FIXED ALIGNMENT */}
              <div style={{ padding: "0 10px" }}>
                {/* title-row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 20,
                    minWidth: 0,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 20,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        pointerEvents: "none",
                        marginBottom: 4,
                      }}
                    >
                      {currentTrack.title}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 14,
                        pointerEvents: "none",
                      }}
                    >
                      {currentTrack.artist}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <button
                      onClick={handleToggleLike}
                      title={isLiked ? "Unlike" : "Like"}
                      style={btnGhost(isLiked ? purple : "rgba(255,255,255,0.85)")}
                    >
                      {isLiked ? <FaHeart color={purple} /> : <FiHeart />}
                    </button>

                    <button
                      onClick={openPlaylistModal}
                      title="Add to playlist"
                      style={btnGhost()}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* progress bar with time display */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      position: "relative",
                      height: 6,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.1)",
                      overflow: "hidden",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, rgba(139,92,246,1), rgba(139,92,246,0.55))",
                        boxShadow: "0 0 16px rgba(139,92,246,0.85)",
                        transition: "width 120ms linear",
                        pointerEvents: "none",
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* controls - FIXED ALIGNMENT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 24,
                    paddingBottom: 6,
                  }}
                >
                  <button
                    onClick={onPrev}
                    title="Previous"
                    style={{
                      ...btnGhost(),
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaStepBackward size={18} />
                  </button>

                  <button
                    onClick={togglePlay}
                    title={isPlaying ? "Pause" : "Play"}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 999,
                      background: purple,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isPlaying
                        ? "0 0 28px 8px rgba(139,92,246,0.95)"
                        : "0 0 18px 6px rgba(139,92,246,0.55)",
                      animation: isPlaying ? "pulseMini 1.6s infinite" : "none",
                      border: "none",
                      cursor: "pointer",
                      margin: "0 4px",
                    }}
                  >
                    {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} style={{ marginLeft: 2 }} />}
                  </button>

                  <button
                    onClick={onNext}
                    title="Next"
                    style={{
                      ...btnGhost(),
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaStepForward size={18} />
                  </button>

                  <button
                    onClick={() => setRepeat((r) => !r)}
                    title={repeat ? "Repeat: ON" : "Repeat: OFF"}
                    style={{
                      ...btnGhost(repeat ? purple : "rgba(255,255,255,0.85)"),
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 8,
                    }}
                  >
                    <FiRepeat size={18} />
                  </button>

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 10, 
                    marginLeft: 16,
                    height: 44,
                    justifyContent: "center",
                  }}>
                    <FiVolume2 size={18} />
                    {/* FIXED VOLUME SLIDER WITH CUSTOM STYLING */}
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "4px",
                        borderRadius: "2px",
                        background: "rgba(255,255,255,0.1)",
                        overflow: "hidden",
                        marginTop: 2,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: `${volume * 100}%`,
                          height: "100%",
                          background: purple,
                          borderRadius: "2px",
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        style={{
                          position: "absolute",
                          top: "-6px",
                          left: 0,
                          width: "100%",
                          height: "16px",
                          opacity: 0,
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* right: UpNext - SIMPLIFIED */}
            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "16px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100%",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {/* UpNext Header */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255,255,255,0.1)"
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: 4, height: 20, background: "#8b5cf6", borderRadius: 2, marginRight: 10 }} />
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}>Up Next</h3>
                </div>
                <div style={{ 
                  color: "#8b5cf6", 
                  fontSize: 12, 
                  background: "rgba(139,92,246,0.1)",
                  padding: "4px 10px",
                  borderRadius: 10,
                  fontWeight: 600
                }}>
                  {displayUpNext.length} tracks
                </div>
              </div>
              
              {/* UpNext List - SIMPLIFIED, NO PLAY BUTTONS */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                overflowY: "auto",
                paddingRight: 4,
                minHeight: 0,
              }}>
                {displayUpNext.map((track, index) => {
                  const isCurrent = track.videoId === currentTrack?.videoId;
                  return (
                    <div
                      key={track.videoId || index}
                      onClick={() => {
                        if (onPlay) onPlay(track);
                        else if (setCurrentTrack) setCurrentTrack(track);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: isCurrent 
                          ? "rgba(139,92,246,0.2)" 
                          : "rgba(255,255,255,0.05)",
                        border: isCurrent 
                          ? "1px solid rgba(139,92,246,0.4)" 
                          : "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.background = "rgba(139,92,246,0.15)";
                          e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }
                      }}
                    >
                      {/* Track number */}
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: isCurrent 
                          ? "rgba(139,92,246,0.8)" 
                          : index === 0 
                            ? "rgba(139,92,246,0.3)" 
                            : "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isCurrent ? "#fff" : (index === 0 ? "#8b5cf6" : "rgba(255,255,255,0.6)"),
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {isCurrent ? (
                          <div style={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            background: '#fff',
                            animation: 'pulseNowPlaying 1.5s infinite'
                          }} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      {/* Album thumbnail */}
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, rgba(139,92,246,0.2), rgba(244,114,182,0.2))`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 14,
                        flexShrink: 0,
                        overflow: "hidden",
                        position: "relative",
                      }}>
                        {track.thumbnail ? (
                          <img 
                            src={track.thumbnail} 
                            alt="" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span>♪</span>
                        )}
                      </div>
                      
                      {/* Track info - PROPER ALIGNMENT */}
                      <div style={{ 
                        flex: 1, 
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}>
                        <div style={{
                          color: isCurrent ? "#fff" : "#fff",
                          fontWeight: isCurrent ? 700 : 600,
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: 2,
                          lineHeight: "1.2",
                        }}>
                          {track.title}
                        </div>
                        <div style={{
                          color: isCurrent ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)",
                          fontSize: 11,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.2",
                        }}>
                          {track.artist}
                        </div>
                      </div>
                      
                      {/* Duration only - NO PLAY BUTTON */}
                      <div style={{
                        color: isCurrent ? "#fff" : "rgba(255,255,255,0.5)",
                        fontSize: 11,
                        background: isCurrent 
                          ? "rgba(139,92,246,0.3)" 
                          : "rgba(255,255,255,0.08)",
                        padding: "3px 6px",
                        borderRadius: 4,
                        flexShrink: 0,
                        minWidth: "35px",
                        textAlign: "center",
                        fontWeight: isCurrent ? 600 : 400,
                      }}>
                        {track.duration || "3:45"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* keyframes */}
      <style>{`
        @keyframes pulseMini {
          0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.85); }
          60% { box-shadow: 0 0 0 12px rgba(139,92,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
        }
        @keyframes fadeIn { from { opacity: .0 } to { opacity: 1 } }
        @keyframes riseUp {
          0% { transform: translateY(30px) scale(.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes rotateRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 15px rgba(139,92,246,0.9)) drop-shadow(0 0 25px rgba(244,114,182,0.5)); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 10px rgba(139,92,246,0.7)) drop-shadow(0 0 20px rgba(244,114,182,0.3)); }
        }
        @keyframes pulseNowPlaying {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Custom scrollbar for UpNext */
        div::-webkit-scrollbar {
          width: 4px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.5);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(139,92,246,0.7);
        }
      `}</style>
    </>
  );
}

function btnGhost(color = "rgba(255,255,255,0.85)") {
  return {
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.25)",
    color,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease",
  };
}