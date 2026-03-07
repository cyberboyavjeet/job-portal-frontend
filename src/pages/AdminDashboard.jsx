import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState("jobs");
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "", category: "", deadline: "" });
  const [editId, setEditId] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => { fetchJobs(); fetchApplications(); }, []);

  const fetchJobs = async () => {
    const res = await axios.get("https://job-portal-backend-ah72.onrender.com/api/jobs");
    setJobs(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("https://job-portal-backend-ah72.onrender.com/api/applications/all",
      { headers: { Authorization: `Bearer ${token}` } });
    setApplications(res.data);
  };

  const handleJobSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`https://job-portal-backend-ah72.onrender.com/api/jobs/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setEditId(null);
      } else {
        await axios.post("https://job-portal-backend-ah72.onrender.com/api/jobs", form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ title: "", description: "", location: "", salary: "", category: "", deadline: "" });
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteJob = async (id) => {
    if (!confirm("Delete this job?")) return;
    await axios.delete(`https://job-portal-backend-ah72.onrender.com/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  const updateAppStatus = async (id, status) => {
    await axios.put(`https://job-portal-backend-ah72.onrender.com/api/applications/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchApplications();
  };

  const inputStyle = {
    width: "100%", padding: "0.7rem", borderRadius: "8px",
    border: "1px solid #333", background: "#1a1a2e", color: "white",
    fontSize: "0.95rem", marginBottom: "0.8rem", boxSizing: "border-box"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", padding: "2rem", color: "white" }}>
      <h2 style={{ color: "#00d4ff", fontSize: "2rem", marginBottom: "1.5rem" }}>🛠️ Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Jobs", value: jobs.length, color: "#00d4ff" },
          { label: "Applications", value: applications.length, color: "#2ecc71" },
          { label: "Pending", value: applications.filter(a => a.status === "pending").length, color: "#f39c12" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#16213e", padding: "1.2rem 2rem", borderRadius: "10px",
            flex: 1, textAlign: "center", border: `1px solid ${stat.color}33`
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
            <div style={{ color: "#aaa" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {["jobs", "post", "applications"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none",
            background: tab === t ? "#00d4ff" : "#16213e",
            color: tab === t ? "#1a1a2e" : "white", cursor: "pointer",
            fontWeight: "bold", textTransform: "capitalize"
          }}>{t === "post" ? "Post Job" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "jobs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {jobs.map(job => (
            <div key={job._id} style={{ background: "#16213e", padding: "1.2rem", borderRadius: "10px" }}>
              <h3 style={{ color: "#00d4ff" }}>{job.title}</h3>
              <p style={{ color: "#aaa" }}>📍 {job.location} | 💰 {job.salary}</p>
              <p style={{ color: job.status === "open" ? "#2ecc71" : "#e74c3c" }}>Status: {job.status}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
                <button onClick={() => { setForm(job); setEditId(job._id); setTab("post"); }} style={{
                  flex: 1, padding: "0.5rem", background: "#f39c12", border: "none",
                  borderRadius: "6px", cursor: "pointer", color: "white"
                }}>Edit</button>
                <button onClick={() => deleteJob(job._id)} style={{
                  flex: 1, padding: "0.5rem", background: "#e74c3c", border: "none",
                  borderRadius: "6px", cursor: "pointer", color: "white"
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "post" && (
        <div style={{ background: "#16213e", padding: "2rem", borderRadius: "12px", maxWidth: "600px" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "#00d4ff" }}>{editId ? "Edit Job" : "Post New Job"}</h3>
          {[
            { key: "title", placeholder: "Job Title" },
            { key: "location", placeholder: "Location" },
            { key: "salary", placeholder: "Salary (e.g. $500/month)" },
            { key: "category", placeholder: "Category (e.g. Construction, IT)" },
          ].map(f => (
            <input key={f.key} style={inputStyle} placeholder={f.placeholder}
              value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
          ))}
          <textarea placeholder="Job Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, height: "100px", resize: "vertical" }} />
          <input style={inputStyle} type="date" value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })} />
          <button onClick={handleJobSubmit} style={{
            width: "100%", padding: "0.9rem", background: "#00d4ff", color: "#1a1a2e",
            border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer"
          }}>{editId ? "Update Job" : "Post Job"}</button>
        </div>
      )}

      {tab === "applications" && (
        <div>
          {applications.map(app => (
            <div key={app._id} style={{
              background: "#16213e", padding: "1.2rem", borderRadius: "10px",
              marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <p style={{ color: "#00d4ff" }}>{app.worker?.name} applied for <strong>{app.job?.title}</strong></p>
                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>📧 {app.worker?.email}</p>
                <p style={{ color: app.status === "pending" ? "#f39c12" : app.status === "accepted" ? "#2ecc71" : "#e74c3c" }}>
                  Status: {app.status}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => updateAppStatus(app._id, "accepted")} style={{
                  padding: "0.5rem 1rem", background: "#2ecc71", border: "none",
                  borderRadius: "6px", cursor: "pointer", color: "white"
                }}>Accept</button>
                <button onClick={() => updateAppStatus(app._id, "rejected")} style={{
                  padding: "0.5rem 1rem", background: "#e74c3c", border: "none",
                  borderRadius: "6px", cursor: "pointer", color: "white"
                }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}