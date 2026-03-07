import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axios.get("https://job-portal-backend-ah72.onrender.com/api/applications/my",
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplications(res.data));
  }, []);

  const statusColor = (s) => s === "accepted" ? "#2ecc71" : s === "rejected" ? "#e74c3c" : "#f39c12";

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", padding: "2rem", color: "white" }}>
      <h2 style={{ color: "#00d4ff", fontSize: "2rem", marginBottom: "2rem" }}>📋 My Applications</h2>

      {applications.length === 0 && (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "3rem" }}>
          You haven't applied to any jobs yet.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {applications.map(app => (
          <div key={app._id} style={{
            background: "#16213e", borderRadius: "12px", padding: "1.5rem",
            border: `1px solid ${statusColor(app.status)}33`
          }}>
            <h3 style={{ color: "#00d4ff", marginBottom: "0.5rem" }}>{app.job?.title}</h3>
            <p style={{ color: "#aaa" }}>📍 {app.job?.location}</p>
            <p style={{ color: "#aaa" }}>💰 {app.job?.salary}</p>
            <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Applied: {new Date(app.appliedAt).toLocaleDateString()}
            </p>
            <div style={{
              marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: "20px",
              background: `${statusColor(app.status)}22`, display: "inline-block"
            }}>
              <span style={{ color: statusColor(app.status), fontWeight: "bold", textTransform: "capitalize" }}>
                {app.status === "accepted" ? "✅" : app.status === "rejected" ? "❌" : "⏳"} {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}