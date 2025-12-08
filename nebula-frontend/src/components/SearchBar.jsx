import React from "react";
import { 
  FiHome, 
  FiMusic, 
  FiList, 
  FiSearch, 
  FiHeart, 
  FiSettings,
  FiPlus
} from "react-icons/fi";
import { FaSpotify } from "react-icons/fa";

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: <FiHome /> },
    { id: "library", label: "Your Library", icon: <FiMusic /> },
    { id: "playlists", label: "Playlists", icon: <FiList /> },
    { id: "search", label: "Search", icon: <FiSearch /> },
  ];

  const playlists = [
    { id: "liked", label: "Liked Songs", icon: <FiHeart /> },
    { id: "chill", label: "Chill Vibes", count: 42 },
    { id: "workout", label: "Workout Mix", count: 28 },
    { id: "focus", label: "Focus Flow", count: 35 },
    { id: "party", label: "Party Time", count: 56 },
  ];

  return (
    <div style={{
      width: "260px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, rgba(15,15,35,0.95) 0%, rgba(20,20,45,0.92) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.1)",
      padding: "24px 0",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 1000,
    }}>
      {/* Logo */}
      <div style={{
        padding: "0 24px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        marginBottom: "24px"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <FiMusic size={24} color="#fff" />
        </div>
        <span style={{
          fontSize: "24px",
          fontWeight: 800,
          background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Nebula
        </span>
      </div>

      {/* Navigation */}
      <div style={{ padding: "0 16px", marginBottom: "24px" }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: activeTab === item.id 
                ? "rgba(139, 92, 246, 0.15)" 
                : "transparent",
              border: "none",
              borderRadius: "12px",
              color: activeTab === item.id ? "#fff" : "rgba(255,255,255,0.7)",
              fontSize: "15px",
              fontWeight: activeTab === item.id ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }
            }}
          >
            <span style={{ 
              fontSize: "20px",
              opacity: activeTab === item.id ? 1 : 0.8
            }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Your Playlists Section */}
      <div style={{
        flex: 1,
        padding: "0 16px",
        overflowY: "auto",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          padding: "0 8px"
        }}>
          <span style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>
            Your Playlists
          </span>
          <button style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <FiPlus size={16} />
          </button>
        </div>
        
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => onTabChange(playlist.id)}
            style={{
              padding: "10px 16px",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(217,70,239,0.2))",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {playlist.icon || <FiMusic size={16} color="rgba(255,255,255,0.7)" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "14px",
                fontWeight: 500,
              }}>
                {playlist.label}
              </div>
              {playlist.count && (
                <div style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "12px",
                }}>
                  {playlist.count} songs
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Settings & User */}
      <div style={{ 
        padding: "20px 16px 0",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        marginTop: "auto"
      }}>
        <button
          onClick={() => onTabChange("settings")}
          style={{
            width: "100%",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "transparent",
            border: "none",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          <FiSettings size={20} />
          Settings
        </button>
        
        {/* User Profile */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          marginTop: "12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}>
            S
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
            }}>
              Shukla AI
            </div>
            <div style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "12px",
            }}>
              Premium
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;