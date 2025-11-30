import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  Heart,
  History,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#0d0d0d",
        padding: "24px 18px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1a1a1a",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* LOGO */}
      <h1
        style={{
          color: "white",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "40px",
        }}
      >
        Nebula Music
      </h1>

      {/* MAIN NAV */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <SidebarItem to="/" icon={<Home size={20} />}>Home</SidebarItem>
        <SidebarItem to="/search" icon={<Search size={20} />}>Search</SidebarItem>
      </div>

      {/* SECTION TITLE */}
      <p
        style={{
          marginTop: "22px",
          marginBottom: "8px",
          fontSize: "13px",
          color: "#888",
          fontWeight: 500,
        }}
      >
        Library
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <SidebarItem to="/library" icon={<Library size={20} />}>
          Your Library
        </SidebarItem>
        <SidebarItem to="/liked" icon={<Heart size={20} />}>
          Liked Songs
        </SidebarItem>
        <SidebarItem to="/recent" icon={<History size={20} />}>
          Discover
        </SidebarItem>
      </div>

      {/* PUSH SETTINGS TO BOTTOM */}
      <div style={{ flexGrow: 1 }}></div>

      <SidebarItem to="/settings" icon={<Settings size={20} />}>
        Settings
      </SidebarItem>
    </aside>
  );
}

function SidebarItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "10px 12px",
        borderRadius: "10px",
        color: isActive ? "white" : "#b3b3b3",
        background: isActive ? "rgba(139, 92, 246, 0.25)" : "transparent",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: 500,
        transition: "0.25s",
      })}
    >
      {icon}
      {children}
    </NavLink>
  );
}
