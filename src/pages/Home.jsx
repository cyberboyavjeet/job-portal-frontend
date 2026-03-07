import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", color: "white", textAlign: "center", padding: "2rem"
    }}>
      <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Find Your <span style={{ color: "#00d4ff" }}>Dream Job</span>
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#aaa", maxWidth: "600px", marginBottom: "2.5rem" }}>
        Connect with top employers. Apply for jobs, chat with admin, and track your applications all in one place.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/jobs" style={{
          background: "#00d4ff", color: "#1a1a2e", padding: "0.8rem 2rem",
          borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem"
        }}>Browse Jobs</Link>
        <Link to="/register" style={{
          border: "2px solid #00d4ff", color: "#00d4ff", padding: "0.8rem 2rem",
          borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem"
        }}>Get Started</Link>
      </div>

      <div style={{ display: "flex", gap: "3rem", marginTop: "4rem" }}>
        {[
          { icon: "💼", label: "Jobs Posted", value: "100+" },
          { icon: "👷", label: "Workers", value: "500+" },
          { icon: "✅", label: "Hired", value: "200+" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem" }}>{stat.icon}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#00d4ff" }}>{stat.value}</div>
            <div style={{ color: "#aaa" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}