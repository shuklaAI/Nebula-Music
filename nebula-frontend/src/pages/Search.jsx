import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Search({ onPlay }) {
  const backend = "http://127.0.0.1:8000";
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", label: "All" },
    { id: "songs", label: "Songs" },
    { id: "artists", label: "Artists" },
    { id: "playlists", label: "Playlists" },
    { id: "albums", label: "Albums" },
  ];

  const BrowseGrid = [
    { name: "Trending Now", query: "trending songs", img: "/assets/trending.jpg" },
    { name: "Bollywood", query: "bollywood hits", img: "/assets/bollywood.jpg" },
    { name: "Chill Vibes", query: "chill lofi songs", img: "/assets/chill.jpg" },
    { name: "Romantic Hits", query: "romantic songs", img: "/assets/romantic.jpg" },
    { name: "Party Mix", query: "party songs", img: "/assets/party.jpg" },
    { name: "90s Retro", query: "90s songs", img: "/assets/retro.jpg" },
    { name: "Punjabi Beats", query: "punjabi songs", img: "/assets/punjabi.jpg" },
    { name: "Hip-Hop / Rap", query: "hip hop rap", img: "/assets/hiphop.jpg" },
    { name: "Instrumental", query: "instrumental", img: "/assets/instrumental.jpg" },
    { name: "Lo-Fi", query: "lofi songs", img: "/assets/lofi.jpg" },
    { name: "Pop Stars", query: "pop hits", img: "/assets/pop.jpg" },
    { name: "Top International", query: "international hits", img: "/assets/international.jpg" },
    { name: "Acoustic", query: "acoustic songs", img: "/assets/acoustic.jpg" },
    { name: "Workout Jams", query: "workout songs", img: "/assets/workout.jpg" },
    { name: "Regional India", query: "regional indian songs", img: "/assets/regional.jpg" },
    { name: "Soulful Voices", query: "soul songs", img: "/assets/soulful.jpg" },
  ];

  const performSearch = async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    setQuery(term);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const res = await fetch(`${backend}/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setAllResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.id);
  };

  const handlePlay = (song) => {
    if (!song?.videoId) return;
    const visibleSongs = allResults.filter((s) => s.videoId);
    if (onPlay) onPlay(song, visibleSongs);
  };

  const openArtist = (name) => {
    performSearch(name);
    setActiveCategory("songs");
  };

  const songs = allResults.filter((x) => x?.videoId);
  const artists = (() => {
    const map = new Map();
    for (const s of songs) {
      const name = (s.artist || "").trim();
      if (!name) continue;
      if (!map.has(name)) {
        map.set(name, {
          name,
          count: 1,
          thumb:
            s.thumbnail || (s.videoId ? `https://img.youtube.com/vi/${s.videoId}/mqdefault.jpg` : null),
        });
      } else {
        map.get(name).count += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  })();

  const fadeSlide = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const EmptyMessage = ({ label }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        marginTop: 40,
        padding: 20,
        borderRadius: 12,
        textAlign: "center",
        color: "rgba(255,255,255,0.6)",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      No direct {label.toLowerCase()} found for “{query}”.<br />
      Try a different keyword or use the Browse grid below.
    </motion.div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            marginBottom: "24px",
            background: "linear-gradient(90deg, #fff, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Search
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: "32px" }}>
          <FiSearch
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "20px",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            style={{
              width: "100%",
              padding: "16px 20px 16px 56px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "10px 24px",
              background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
              border: "none",
              borderRadius: "20px",
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {/* Category Buttons */}
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              style={{
                padding: "10px 24px",
                background:
                  activeCategory === category.id ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)",
                border:
                  activeCategory === category.id ? "1px solid #8b5cf6" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                color: activeCategory === category.id ? "#fff" : "rgba(255,255,255,0.7)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 24,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 12,
                padding: 16,
                overflow: "hidden",
              }}
            >
              <div className="skeleton" style={{ width: "100%", height: 160, borderRadius: 8, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: "80%", height: 16, marginBottom: 6, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: "60%", height: 14, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && query && (
          <motion.div
            key={`${activeCategory}-${query}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeSlide}
            transition={{ duration: 0.35 }}
          >
            {/* SONGS */}
            {(activeCategory === "songs" || activeCategory === "all") && (
              <>
                {songs.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: 24,
                    }}
                  >
                    {songs.map((song) => (
                      <motion.div
                        key={song.videoId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.02 }}
                        onClick={() => handlePlay(song)}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 12,
                          padding: 16,
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <img
                          loading="lazy"
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
                            marginBottom: 10,
                          }}
                        />
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                          {song.title?.length > 25 ? song.title.slice(0, 25) + "..." : song.title}
                        </div>
                        <div style={{ color: "#aaa", fontSize: 13 }}>{song.artist}</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyMessage label="Songs" />
                )}
              </>
            )}

            {/* ARTISTS */}
            {activeCategory === "artists" &&
              (artists.length ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 24,
                  }}
                >
                  {artists.map((a) => (
                    <motion.div
                      key={a.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => openArtist(a.name)}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: 12,
                        padding: 20,
                        cursor: "pointer",
                        textAlign: "center",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: "50%",
                          margin: "0 auto 12px",
                          background: `url(${a.thumb || ""}) center/cover, rgba(255,255,255,0.06)`,
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      />
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{a.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{a.count} songs</div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyMessage label="Artists" />
              ))}

            {/* PLAYLISTS / ALBUMS empty state */}
            {activeCategory === "playlists" && <EmptyMessage label="Playlists" />}
            {activeCategory === "albums" && <EmptyMessage label="Albums" />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BROWSE */}
      {!loading && !query && (
        <motion.div
          key="browse"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeSlide}
          transition={{ duration: 0.4 }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px", color: "#fff" }}>
            Browse All
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            {BrowseGrid.map((genre, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                onClick={() => {
                  performSearch(genre.query);
                  setActiveCategory("songs");
                }}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  loading="lazy"
                  src={genre.img}
                  alt={genre.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    filter: "brightness(0.8)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                  }}
                />
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: 700,
                      textShadow: "0 2px 6px rgba(0,0,0,0.7)",
                    }}
                  >
                    {genre.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <style>
        {`
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        `}
      </style>
    </div>
  );
}
