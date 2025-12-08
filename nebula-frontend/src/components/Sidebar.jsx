// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiMusic,
  FiList,
  FiSearch,
  FiHeart,
  FiSettings,
  FiPlus,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname;

  const menuItems = [
    { id: "home", label: "Home", icon: <FiHome />, path: "/" },
    { id: "library", label: "Your Library", icon: <FiMusic />, path: "/library" },
    { id: "playlists", label: "Playlists", icon: <FiList />, path: "/discover" },
    { id: "search", label: "Search", icon: <FiSearch />, path: "/search" },
  ];

  const playlists = [
    { id: "liked", label: "Liked Songs", icon: <FiHeart />, path: "/liked" },
    { id: "discover", label: "Discover", count: 24, path: "/discover" },
  ];

  return (
    <div
      style={{
        width: isCollapsed ? "80px" : "260px",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(15,15,15,0.98) 0%, rgba(10,10,10,0.96) 100%)",
        boxShadow: "2px 0 8px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        padding: "16px 0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0 20px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiMusic size={22} color="#fff" />
            </div>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 800,
                background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nebula
            </span>
          </div>
        )}
        <button
          onClick={() => onToggleCollapse(!isCollapsed)}
          style={{
            background: "transparent",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div style={{ padding: "0 12px", marginBottom: "20px" }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: isCollapsed ? "0" : "14px",
              justifyContent: isCollapsed ? "center" : "flex-start",
              background:
                activeTab === item.path
                  ? "rgba(139,92,246,0.15)"
                  : "transparent",
              border: "none",
              borderRadius: "10px",
              color:
                activeTab === item.path ? "#fff" : "rgba(255,255,255,0.7)",
              fontSize: "15px",
              fontWeight: activeTab === item.path ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            {!isCollapsed && item.label}
          </button>
        ))}
      </div>

      {/* Playlists Section */}
      {!isCollapsed && (
        <div style={{ flex: 1, padding: "0 16px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
              padding: "0 8px",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Your Playlists
            </span>
            <FiPlus size={16} color="rgba(255,255,255,0.6)" />
          </div>

          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigate(pl.path)}
              style={{
                padding: "10px 14px",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background:
                  activeTab === pl.path
                    ? "rgba(139,92,246,0.15)"
                    : "transparent",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(217,70,239,0.15))",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pl.icon}
              </div>
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {pl.label}
                </div>
                {pl.count && (
                  <div
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "12px",
                    }}
                  >
                    {pl.count} songs
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {!isCollapsed && (
        <div
          style={{
            padding: "18px 16px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={() => navigate("/settings")}
            style={{
              width: "100%",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            <FiSettings size={20} />
            Settings
          </button>

          {/* User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              marginTop: "12px",
              borderRadius: "12px",
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(217,70,239,0.1))",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "17px",
                color: "#fff",
              }}
            >
              S
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Shukla AI
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                }}
              >
                Premium
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
