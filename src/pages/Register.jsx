import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API = "https://job-portal-backend-ah72.onrender.com";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", skills: "", experience: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!form.email) return setError("Enter email first!");
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await axios.post(`${API}/api/auth/send-otp`, { email: form.email });
      setSuccess(res.data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const payload = {
        ...form,
        otp,
        skills: form.skills.split(",").map(s => s.trim())
      };
      const res = await axios.post(`${API}/api/auth/register`, payload);
      login(res.data.user, res.data.token);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "0.8rem 1.2rem", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white", fontSize: "0.95rem", marginBottom: "1rem",
    boxSizing: "border-box", outline: "none"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0533 0%, #0d1b4b 50%, #1a0533 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px", padding: "2.5rem",
        width: "100%", maxWidth: "450px"
      }}>
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem", fontWeight: "800" }}>
          Create Account 🚀
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Join JobPortal today
        </p>

        {error && (
          <p style={{ color: "#f87171", textAlign: "center", marginBottom: "1rem", background: "rgba(239,68,68,0.1)", padding: "0.7rem", borderRadius: "8px" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "#4ade80", textAlign: "center", marginBottom: "1rem", background: "rgba(74,222,128,0.1)", padding: "0.7rem", borderRadius: "8px" }}>
            {success}
          </p>
        )}

        {[
          { key: "name", placeholder: "Full Name", type: "text" },
          { key: "phone", placeholder: "Phone Number", type: "text" },
          { key: "skills", placeholder: "Skills (e.g. React, Node)", type: "text" },
          { key: "experience", placeholder: "Experience (e.g. 2 years)", type: "text" },
          { key: "password", placeholder: "Password (min 8, 1 uppercase, 1 number)", type: "password" },
        ].map(field => (
          <input key={field.key} style={inputStyle} type={field.type}
            placeholder={field.placeholder} value={form[field.key]}
            onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
        ))}

        {/* Email + Send OTP */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <button onClick={sendOTP} disabled={loading} style={{
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            color: "white", border: "none", padding: "0 1rem",
            borderRadius: "12px", cursor: "pointer", fontWeight: "600",
            fontSize: "0.85rem", whiteSpace: "nowrap"
          }}>{loading ? "..." : "Send OTP"}</button>
        </div>

        {otpSent && (
          <input style={inputStyle} type="text"
            placeholder="Enter 6-digit OTP"
            value={otp} onChange={e => setOtp(e.target.value)} />
        )}

        <button onClick={handleSubmit} disabled={!otpSent || loading} style={{
          width: "100%", padding: "0.9rem",
          background: otpSent ? "linear-gradient(135deg, #7c3aed, #3b82f6)" : "rgba(255,255,255,0.1)",
          color: "white", border: "none", borderRadius: "12px",
          fontSize: "1rem", fontWeight: "700",
          cursor: otpSent ? "pointer" : "not-allowed",
          marginBottom: "1rem"
        }}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#a78bfa" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}