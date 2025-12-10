import React from "react";

export default function PlayerBar({
  currentTrack,
  isPlaying,
  togglePlay,
  stopPlayback,
  progress,
  seek,
  setVolume,
}) {
  const percent =
    progress.duration > 0 ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="player-bar">
      <div className="player-left">
        {currentTrack ? (
          <>
            <img src={currentTrack.thumbnail} alt="thumb" className="player-thumb" />
            <div className="player-meta">
              <div className="player-title">{currentTrack.title}</div>
              <div className="player-artist">{currentTrack.artist}</div>
            </div>
          </>
        ) : (
          <div className="player-empty">No song playing</div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control small" onClick={() => {
            
          }}>⏮</button>

          <button className="control main" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶️"}
          </button>

          <button className="control small" onClick={() => {
            
          }}>⏭</button>
        </div>

        <div
          className="player-progress"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = x / rect.width;
            if (progress.duration) seek(pct * progress.duration);
          }}
        >
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="time">
            {formatTime(progress.current)} / {formatTime(progress.duration)}
          </div>
        </div>
      </div>

      <div className="player-right">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.9"
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
        />
        <button className="control small" onClick={stopPlayback}>■</button>
      </div>
    </div>
  );
}

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
