import React, { useEffect, useState } from "react";
import nebulaLogo from "../assets/logo.png";

const NebulaLogo = ({ mode = "background", active = false }) => {
  const [glow, setGlow] = useState(0);

  // Optional pulsing glow effect (e.g., when music is playing)
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setGlow(Math.random() * 0.6 + 0.4); // range 0.4–1.0 for a breathing glow
    }, 400);
    return () => clearInterval(interval);
  }, [active]);

  if (mode === "brand") {
    // Static logo for navbar, splash, or loading screen
    return (
      <div className="flex items-center gap-3 select-none">
        <img
          src={nebulaLogo}
          alt="Nebula Music"
          className="w-12 h-12 drop-shadow-[0_0_10px_rgba(150,70,255,0.6)]"
        />
        <h1 className="text-xl font-bold text-white tracking-wide">
          <span className="text-[#b389ff]">Nebula</span> Music
        </h1>
      </div>
    );
  }

  // Background mode with optional glowing animation
  return (
    <div className="fixed inset-0 flex items-center justify-center -z-10">
      <img
        src={nebulaLogo}
        alt="Nebula Music"
        style={{
          opacity: active ? 0.25 + glow * 0.1 : 0.2,
          filter: `blur(${active ? 5 + glow * 10 : 8}px) drop-shadow(0 0 ${
            active ? 40 + glow * 60 : 20
          }px rgba(150,70,255,${0.3 + glow * 0.3}))`,
          transition: "all 0.3s ease-out",
        }}
        className="w-[380px] select-none pointer-events-none"
      />
    </div>
  );
};

export default NebulaLogo;
