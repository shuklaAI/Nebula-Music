import React, { useState } from "react";
import { FiPlus, FiPlay, FiMoreVertical, FiUsers, FiLock, FiGlobe } from "react-icons/fi";

const Playlists = ({ setCurrentTrack, setQueue }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistPrivacy, setNewPlaylistPrivacy] = useState("public");

  // Sample playlists data
  const playlists = [
    {
      id: 1,
      name: "Chill Vibes",
      description: "Relaxing tunes for your downtime",
      songCount: 42,
      followers: 1248,
      isPublic: true,
      color: "#8b5cf6",
      created: "2 weeks ago"
    },
    {
      id: 2,
      name: "Workout Energy",
      description: "High-energy tracks for your workout sessions",
      songCount: 28,
      followers: 892,
      isPublic: true,
      color: "#d946ef",
      created: "1 month ago"
    },
    {
      id: 3,
      name: "Focus Flow",
      description: "Concentration music for deep work",
      songCount: 35,
      followers: 1567,
      isPublic: true,
      color: "#3b82f6",
      created: "3 days ago"
    },
    {
      id: 4,
      name: "Party Time",
      description: "Hits for celebrations and parties",
      songCount: 56,
      followers: 2345,
      isPublic: false,
      color: "#10b981",
      created: "1 week ago"
    },
    {
      id: 5,
      name: "Road Trip Mix",
      description: "Perfect companions for long drives",
      songCount: 38,
      followers: 789,
      isPublic: true,
      color: "#f59e0b",
      created: "2 months ago"
    },
    {
      id: 6,
      name: "Sleep Well",
      description: "Calming sounds for better sleep",
      songCount: 24,
      followers: 3456,
      isPublic: true,
      color: "#6366f1",
      created: "5 days ago"
    },
  ];

  // Sample collaborative playlists
  const collaborativePlaylists = [
    {
      id: 7,
      name: "Family Road Trip",
      description: "Everyone's favorites",
      songCount: 45,
      collaborators: 4,
      owner: "You",
      color: "#ec4899",
      created: "1 week ago"
    },
    {
      id: 8,
      name: "Office Playlist",
      description: "Team's choice for work",
      songCount: 32,
      collaborators: 12,
      owner: "Alex",
      color: "#14b8a6",
      created: "3 weeks ago"
    },
  ];

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    // In a real app, you would add to backend here
    console.log("Creating playlist:", { newPlaylistName, newPlaylistPrivacy });
    
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      {/* Header */}
      <div style={{ 
        marginBottom: "40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
      }}>
        <div>
          <h1 style={{
            fontSize: "36px",
            fontWeight: 800,
            marginBottom: "8px",
            background: "linear-gradient(90deg, #fff, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Your Playlists
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "16px",
            maxWidth: "600px"
          }}>
            Create, manage, and share your music collections.
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
            border: "none",
            borderRadius: "24px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,92,246,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FiPlus size={16} />
          New Playlist
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "40px"
      }}>
        <div style={{
          background: "rgba(139,92,246,0.1)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(139,92,246,0.2)"
        }}>
          <div style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <FiPlay />
            Total Playlists
          </div>
          <div style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#fff"
          }}>
            {playlists.length + collaborativePlaylists.length}
          </div>
        </div>
        
        <div style={{
          background: "rgba(217,70,239,0.1)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(217,70,239,0.2)"
        }}>
          <div style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <FiUsers />
            Total Followers
          </div>
          <div style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#fff"
          }}>
            {playlists.reduce((sum, p) => sum + p.followers, 0).toLocaleString()}
          </div>
        </div>
        
        <div style={{
          background: "rgba(59,130,246,0.1)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(59,130,246,0.2)"
        }}>
          <div style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <FiGlobe />
            Public Playlists
          </div>
          <div style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#fff"
          }}>
            {playlists.filter(p => p.isPublic).length}
          </div>
        </div>
        
        <div style={{
          background: "rgba(16,185,129,0.1)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(16,185,129,0.2)"
        }}>
          <div style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <FiLock />
            Private Playlists
          </div>
          <div style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#fff"
          }}>
            {playlists.filter(p => !p.isPublic).length}
          </div>
        </div>
      </div>

      {/* Your Playlists */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
          color: "#fff"
        }}>
          Your Playlists
          <span style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            marginLeft: "12px"
          }}>
            • {playlists.length} playlists
          </span>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = playlist.color + "40";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {/* Color accent */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${playlist.color}, ${playlist.color}80)`,
              }} />
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px"
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: `linear-gradient(135deg, ${playlist.color}, ${playlist.color}80)`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fff",
                  flexShrink: 0
                }}>
                  {playlist.name.charAt(0)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {playlist.name}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{
                      padding: "2px 6px",
                      background: playlist.isPublic ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      border: `1px solid ${playlist.isPublic ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.2)'}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      {playlist.isPublic ? <FiGlobe size={10} /> : <FiLock size={10} />}
                      {playlist.isPublic ? "Public" : "Private"}
                    </span>
                    <span>•</span>
                    <span>{playlist.songCount} songs</span>
                  </div>
                </div>
              </div>
              
              <div style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "20px",
                minHeight: "42px"
              }}>
                {playlist.description}
              </div>
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <div>
                  <div style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "4px"
                  }}>
                    Followers
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "#fff",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <FiUsers size={14} />
                    {playlist.followers.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "4px"
                  }}>
                    Created
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                  }}>
                    {playlist.created}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: "flex",
                gap: "12px"
              }}>
                <button style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "8px",
                  color: "#8b5cf6",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.1)";
                }}>
                  <FiPlay size={16} />
                  Play
                </button>
                
                <button style={{
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}>
                  <FiMoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Playlists */}
      <div>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
          color: "#fff"
        }}>
          <FiUsers style={{ marginRight: "12px" }} />
          Collaborative Playlists
          <span style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            marginLeft: "12px"
          }}>
            • {collaborativePlaylists.length} playlists
          </span>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {collaborativePlaylists.map((playlist) => (
            <div
              key={playlist.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = playlist.color + "40";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px"
              }}>
                <div>
                  <div style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "4px"
                  }}>
                    {playlist.name}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                    By {playlist.owner}
                  </div>
                </div>
                
                <div style={{
                  padding: "4px 12px",
                  background: "rgba(236,72,153,0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(236,72,153,0.3)",
                  color: "#ec4899",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <FiUsers size={12} />
                  {playlist.collaborators} collaborators
                </div>
              </div>
              
              <div style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "20px"
              }}>
                {playlist.description}
              </div>
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <div>
                  <div style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "4px"
                  }}>
                    Songs
                  </div>
                  <div style={{
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: 600
                  }}>
                    {playlist.songCount}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "4px"
                  }}>
                    Created
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                  }}>
                    {playlist.created}
                  </div>
                </div>
              </div>
              
              <button style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,92,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                <FiPlay size={16} />
                Play Collaborative Playlist
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          backdropFilter: "blur(10px)"
        }}
        onClick={() => setShowCreateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(20,20,45,0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "32px",
              width: "90%",
              maxWidth: "500px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              animation: "riseUp 0.3s ease"
            }}
          >
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "24px"
            }}>
              Create New Playlist
            </h2>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                marginBottom: "8px"
              }}>
                Playlist Name
              </label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.background = "rgba(255,255,255,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.background = "rgba(255,255,255,0.05)";
                }}
              />
            </div>
            
            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                marginBottom: "12px"
              }}>
                Privacy
              </label>
              <div style={{
                display: "flex",
                gap: "12px"
              }}>
                {[
                  { id: "public", label: "Public", icon: <FiGlobe />, desc: "Anyone can see this playlist" },
                  { id: "private", label: "Private", icon: <FiLock />, desc: "Only you can see this playlist" },
                ].map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setNewPlaylistPrivacy(option.id)}
                    style={{
                      flex: 1,
                      padding: "16px",
                      background: newPlaylistPrivacy === option.id 
                        ? "rgba(139,92,246,0.15)" 
                        : "rgba(255,255,255,0.05)",
                      border: newPlaylistPrivacy === option.id 
                        ? "1px solid #8b5cf6" 
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (newPlaylistPrivacy !== option.id) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newPlaylistPrivacy !== option.id) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px"
                    }}>
                      <div style={{
                        color: newPlaylistPrivacy === option.id ? "#8b5cf6" : "rgba(255,255,255,0.7)",
                        fontSize: "20px"
                      }}>
                        {option.icon}
                      </div>
                      <div style={{
                        color: newPlaylistPrivacy === option.id ? "#fff" : "rgba(255,255,255,0.9)",
                        fontWeight: 600,
                        fontSize: "16px"
                      }}>
                        {option.label}
                      </div>
                    </div>
                    <div style={{
                      color: newPlaylistPrivacy === option.id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)",
                      fontSize: "13px",
                      lineHeight: "1.4"
                    }}>
                      {option.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                style={{
                  padding: "12px 32px",
                  background: newPlaylistName.trim() 
                    ? "linear-gradient(90deg, #8b5cf6, #d946ef)" 
                    : "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: newPlaylistName.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  opacity: newPlaylistName.trim() ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (newPlaylistName.trim()) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,92,246,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (newPlaylistName.trim()) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                Create Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;