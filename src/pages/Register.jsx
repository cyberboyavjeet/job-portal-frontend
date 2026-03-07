import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", skills: "", experience: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const payload = { ...form, skills: form.skills.split(",").map(s => s.trim()) };
      const res = await axios.post("https://job-portal-backend-ah72.onrender.com/api/auth/register", payload);
      login(res.data.user, res.data.token);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "0.8rem", borderRadius: "8px",
    border: "1px solid #333", background: "#1a1a2e", color: "white",
    fontSize: "1rem", marginBottom: "1rem", boxSizing: "border-box"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: "#16213e", padding: "2.5rem", borderRadius: "12px",
        width: "100%", maxWidth: "450px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem" }}>
          Create Account 🚀
        </h2>
        {error && <p style={{ color: "#e74c3c", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
        {[
          { key: "name", placeholder: "Full Name", type: "text" },
          { key: "email", placeholder: "Email", type: "email" },
          { key: "password", placeholder: "Password", type: "password" },
          { key: "phone", placeholder: "Phone Number", type: "text" },
          { key: "skills", placeholder: "Skills (comma separated: React, Node, Python)", type: "text" },
          { key: "experience", placeholder: "Experience (e.g. 2 years)", type: "text" },
        ].map(field => (
          <input key={field.key} style={inputStyle} type={field.type}
            placeholder={field.placeholder} value={form[field.key]}
            onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
        ))}
        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "0.9rem", background: "#00d4ff", color: "#1a1a2e",
          border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold",
          cursor: "pointer", marginBottom: "1rem"
        }}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{ color: "#aaa", textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ color: "#00d4ff" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}