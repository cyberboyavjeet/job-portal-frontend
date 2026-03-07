import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "1rem 2.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{
        background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "1.6rem",
        fontWeight: "800",
        letterSpacing: "-0.5px"
      }}>💼 JobPortal</Link>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link to="/jobs" style={{
          color: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem",
          borderRadius: "8px", fontSize: "0.9rem", fontWeight: "500",
          transition: "all 0.2s"
        }}>Jobs</Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" style={{
                color: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem",
                borderRadius: "8px", fontSize: "0.9rem", fontWeight: "500"
              }}>Admin Panel</Link>
            )}
            {user.role === "worker" && (
              <>
                <Link to="/my-applications" style={{
                  color: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem",
                  borderRadius: "8px", fontSize: "0.9rem"
                }}>My Applications</Link>
                <Link to="/chat" style={{
                  color: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem",
                  borderRadius: "8px", fontSize: "0.9rem"
                }}>💬 Chat</Link>
              </>
            )}
            {user.role === "admin" && (
              <Link to="/chat" style={{
                color: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem",
                borderRadius: "8px", fontSize: "0.9rem"
              }}>💬 Messages</Link>
            )}
            <span style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.85rem", padding: "0 0.5rem"
            }}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
              padding: "0.5rem 1.2rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer"
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem",
              borderRadius: "8px", fontSize: "0.9rem"
            }}>Login</Link>
            <Link to="/register" style={{
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              color: "white", padding: "0.55rem 1.3rem",
              borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600"
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}