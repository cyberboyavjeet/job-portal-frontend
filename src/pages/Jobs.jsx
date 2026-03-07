import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [applied, setApplied] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => { fetchJobs(); }, [search, location]);

  const fetchJobs = async () => {
    const res = await axios.get(`https://job-portal-backend-ah72.onrender.com/api/jobs?search=${search}&location=${location}`);
    setJobs(res.data);
  };

  const applyJob = async (jobId) => {
    try {
      await axios.post("https://job-portal-backend-ah72.onrender.com/api/applications", { jobId },
        { headers: { Authorization: `Bearer ${token}` } });
      setApplied([...applied, jobId]);
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", padding: "2rem", color: "white" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem", color: "#00d4ff" }}>
        Available Jobs
      </h2>

      <div style={{ display: "flex", gap: "1rem", maxWidth: "700px", margin: "0 auto 2rem" }}>
        <input placeholder="Search jobs..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: "1px solid #333", background: "#16213e", color: "white" }} />
        <input placeholder="Location..." value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: "1px solid #333", background: "#16213e", color: "white" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        {jobs.map(job => (
          <div key={job._id} style={{
            background: "#16213e", borderRadius: "12px", padding: "1.5rem",
            border: "1px solid #0f3460", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ color: "#00d4ff", marginBottom: "0.5rem" }}>{job.title}</h3>
            <p style={{ color: "#aaa", marginBottom: "0.5rem" }}>📍 {job.location}</p>
            <p style={{ color: "#2ecc71", marginBottom: "0.5rem" }}>💰 {job.salary}</p>
            <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1rem" }}>{job.description.substring(0, 100)}...</p>
            <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginBottom: "1rem" }}>
              ⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}
            </p>
            {user && user.role === "worker" && (
              <button onClick={() => applyJob(job._id)}
                disabled={applied.includes(job._id)}
                style={{
                  width: "100%", padding: "0.7rem",
                  background: applied.includes(job._id) ? "#555" : "#00d4ff",
                  color: applied.includes(job._id) ? "#aaa" : "#1a1a2e",
                  border: "none", borderRadius: "8px",
                  cursor: applied.includes(job._id) ? "not-allowed" : "pointer",
                  fontWeight: "bold"
                }}>
                {applied.includes(job._id) ? "✅ Applied" : "Apply Now"}
              </button>
            )}
          </div>
        ))}
      </div>
      {jobs.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa", marginTop: "3rem" }}>No jobs found.</p>
      )}
    </div>
  );
}