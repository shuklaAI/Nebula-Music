// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import MiniPlayer from "./components/MiniPlayer";
import LikedSongs from "./pages/LikedSongs";
import Discover from "./pages/Discover";

const BACKEND = "http://127.0.0.1:8000";

export default function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [upNextQueue, setUpNextQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [likedSet, setLikedSet] = useState(() => new Set());
  const [streamCache] = useState(() => new Map());
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const audioRef = useRef(null);

  // -------- Liked Handling --------
  const refreshLiked = async () => {
    try {
      const res = await fetch(`${BACKEND}/liked/all`);
      if (res.ok) {
        const data = await res.json();
        const ids = new Set((data.liked || []).map((s) => s.videoId));
        setLikedSet(ids);
      }
    } catch (err) {
      console.error("Failed to refresh liked:", err);
    }
  };

  const toggleLike = async (track) => {
    if (!track?.videoId) return;
    try {
      const res = await fetch(
        `${BACKEND}/like?videoId=${track.videoId}&title=${encodeURIComponent(
          track.title || ""
        )}&artist=${encodeURIComponent(track.artist || "")}&thumbnail=${encodeURIComponent(
          track.thumbnail || ""
        )}`,
        { method: "POST" }
      );
      const data = await res.json();
      setLikedSet((prev) => {
        const next = new Set(prev);
        if (data.liked) next.add(track.videoId);
        else next.delete(track.videoId);
        return new Set(next);
      });
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
  };

  // -------- Stream Helper --------
  const getStreamUrl = async (videoId) => {
    if (streamCache.has(videoId)) return streamCache.get(videoId);
    try {
      const res = await fetch(
        `${BACKEND}/stream?url=${encodeURIComponent(
          `https://www.youtube.com/watch?v=${videoId}`
        )}`
      );
      const data = await res.json();
      if (data?.url) {
        streamCache.set(videoId, data.url);
        return data.url;
      }
      return null;
    } catch {
      return null;
    }
  };

  // -------- Core Playback + AutoUpNext --------
  const playTrack = async (track, contextList = null) => {
    if (!track?.videoId) return;
    const streamUrl = await getStreamUrl(track.videoId);
    if (!streamUrl) return;

    const merged = { ...track, streamUrl };
    setCurrentTrack(merged);
    if (audioRef.current) {
      audioRef.current.src = streamUrl;
      await audioRef.current.play().catch(() => {});
    }

    try {
      const oldList = JSON.parse(localStorage.getItem("recentPlayed") || "[]");
      const newList = [
        merged,
        ...oldList.filter((x) => x.videoId !== merged.videoId),
      ].slice(0, 10);
      localStorage.setItem("recentPlayed", JSON.stringify(newList));
      window.dispatchEvent(new Event("recentUpdated"));
    } catch {}

    if (Array.isArray(contextList) && contextList.length > 0) {
      setUpNextQueue(contextList);
      const idx = contextList.findIndex((t) => t.videoId === track.videoId);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      setUpNextQueue([track]);
      setCurrentIndex(0);
    }

    try {
      const res = await fetch(
        `${BACKEND}/autoplay/upnext?videoId=${track.videoId}`
      );
      const data = await res.json();
      if (Array.isArray(data.upnext) && data.upnext.length > 0) {
        setUpNextQueue([track, ...data.upnext]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.warn("UpNext build failed:", err);
    }
  };

  const handleNext = async () => {
    if (currentIndex < upNextQueue.length - 1) {
      const nextTrack = upNextQueue[currentIndex + 1];
      setCurrentIndex((i) => i + 1);
      await playTrack(nextTrack, upNextQueue);
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      const prevTrack = upNextQueue[currentIndex - 1];
      setCurrentIndex((i) => i - 1);
      await playTrack(prevTrack, upNextQueue);
    }
  };

  useEffect(() => {
    if (currentTrack?.streamUrl && audioRef.current) {
      audioRef.current.src = currentTrack.streamUrl;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  return (
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />

      <div
        className="main-content"
        style={{
          marginLeft: isSidebarCollapsed ? "80px" : "260px",
          transition: "margin-left 0.3s ease",
          flex: 1,
          minHeight: "100vh",
          background: "#0d0d0d",
          color: "white",
        }}
      >
        <Routes>
          <Route path="/" element={<Home onPlay={playTrack} />} />
          <Route path="/search" element={<Search onPlay={playTrack} />} />
          <Route path="/library" element={<Library onPlay={playTrack} />} />
          <Route
            path="/liked"
            element={
              <LikedSongs
                onPlay={playTrack}
                onToggleLike={toggleLike}
                likedSet={likedSet}
                refreshLiked={refreshLiked}
              />
            }
          />
          <Route path="/discover" element={<Discover onPlay={playTrack} />} />
          <Route path="/recent" element={<Navigate to="/discover" replace />} />
        </Routes>
      </div>

      <audio ref={audioRef} style={{ display: "none" }} />

      <MiniPlayer
        currentTrack={currentTrack}
        audioRef={audioRef}
        setCurrentTrack={setCurrentTrack}
        likedSet={likedSet}
        onToggleLike={toggleLike}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
