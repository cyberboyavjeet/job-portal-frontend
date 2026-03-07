import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("https://job-portal-backend-ah72.onrender.com/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "admin" ? "/admin" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "0.8rem", borderRadius: "8px",
    border: "1px solid #333", background: "#1a1a2e", color: "white",
    fontSize: "1rem", marginBottom: "1rem", boxSizing: "border-box"
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f1a",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#16213e", padding: "2.5rem", borderRadius: "12px",
        width: "100%", maxWidth: "420px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem" }}>
          Welcome Back 👋
        </h2>
        {error && <p style={{ color: "#e74c3c", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
        <input style={inputStyle} type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "0.9rem", background: "#00d4ff", color: "#1a1a2e",
          border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold",
          cursor: "pointer", marginBottom: "1rem"
        }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ color: "#aaa", textAlign: "center" }}>
          Don't have an account? <Link to="/register" style={{ color: "#00d4ff" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}