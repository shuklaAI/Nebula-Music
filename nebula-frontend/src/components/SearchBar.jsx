import React, { useState } from "react";
import api from "../api/nebulaApi";

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const results = await api.searchSongs(query);
      console.log("🔍 Search results:", results);
      onResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Search for a song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}
