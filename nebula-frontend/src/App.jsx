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
  const [durationCache, setDurationCache] = useState({});

  const audioRef = useRef(null);

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

  //  Toggle like/unlike
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

  //  Fetch and cache stream URL
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

  //  Fetch and cache duration for track
  const getTrackDuration = async (videoId) => {
    if (durationCache[videoId]) return durationCache[videoId];
    try {
      const res = await fetch(`${BACKEND}/track_info?video_id=${videoId}`);
      const data = await res.json();
      if (data?.duration) {
        setDurationCache((prev) => ({ ...prev, [videoId]: data.duration }));
        return data.duration;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  //  Smart Play Logic (context-aware)
  const playTrack = async (track, contextList = null, contextType = "single") => {
    if (!track?.videoId) return;
    const streamUrl = await getStreamUrl(track.videoId);
    if (!streamUrl) return;

    // Fetch real duration in background
    getTrackDuration(track.videoId);

    const merged = { ...track, streamUrl };
    setCurrentTrack(merged);

    // Start playback
    if (audioRef.current) {
      audioRef.current.src = streamUrl;
      await audioRef.current.play().catch(() => {});
    }

    // Save to recent history
    try {
      const oldList = JSON.parse(localStorage.getItem("recentPlayed") || "[]");
      const newList = [
        merged,
        ...oldList.filter((x) => x.videoId !== merged.videoId),
      ].slice(0, 10);
      localStorage.setItem("recentPlayed", JSON.stringify(newList));
      window.dispatchEvent(new Event("recentUpdated"));
    } catch {}

    //  Contextual handling
    if (contextType === "playlist" || contextType === "liked") {
      if (contextList && contextList !== upNextQueue) {
        setUpNextQueue(contextList || []);
      }
      const idx = contextList?.findIndex((t) => t.videoId === track.videoId);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      
      try {
        const res = await fetch(`${BACKEND}/autoplay/upnext?videoId=${track.videoId}`);
        const data = await res.json();
        if (Array.isArray(data.upnext) && data.upnext.length > 0) {
          setUpNextQueue([track, ...data.upnext]);
          setCurrentIndex(0);
        } else {
          setUpNextQueue([track]);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.warn("UpNext fetch failed:", err);
        setUpNextQueue([track]);
        setCurrentIndex(0);
      }
    }
  };

  const handleNext = async () => {
    if (currentIndex < upNextQueue.length - 1) {
      const newIndex = currentIndex + 1;
      const nextTrack = upNextQueue[newIndex];
      const streamUrl = await getStreamUrl(nextTrack.videoId);
      if (streamUrl && audioRef.current) {
        setCurrentTrack({ ...nextTrack, streamUrl });
        getTrackDuration(nextTrack.videoId);
        audioRef.current.src = streamUrl;
        await audioRef.current.play().catch(() => {});
        setCurrentIndex(newIndex);
      }
    } else {
      console.log("End of queue reached");
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const prevTrack = upNextQueue[newIndex];
      const streamUrl = await getStreamUrl(prevTrack.videoId);
      if (streamUrl && audioRef.current) {
        setCurrentTrack({ ...prevTrack, streamUrl });
        getTrackDuration(prevTrack.videoId);
        audioRef.current.src = streamUrl;
        await audioRef.current.play().catch(() => {});
        setCurrentIndex(newIndex);
      }
    } else {
      console.log("Start of queue");
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
          <Route path="/" element={<Home onPlay={(t) => playTrack(t, null, "single")} />} />
          <Route path="/search" element={<Search onPlay={(t) => playTrack(t, null, "search")} />} />
          <Route path="/library" element={<Library onPlay={(t) => playTrack(t, null, "single")} />} />
          <Route
            path="/liked"
            element={
              <LikedSongs
                onPlay={(t, list) => playTrack(t, list, "liked")}
                onToggleLike={toggleLike}
                likedSet={likedSet}
                refreshLiked={refreshLiked}
              />
            }
          />
          <Route
            path="/discover"
            element={<Discover onPlay={(t, list) => playTrack(t, list, "playlist")} />}
          />
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
        upNextQueue={upNextQueue}
        onPlay={playTrack}
      />
    </div>
  );
}
