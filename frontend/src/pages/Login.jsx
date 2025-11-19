import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://eventify-6z70.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style = {{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",

    }}>
        <div className="auth-container">
        <h1 className="title">Eventify</h1>
        <h2 className="subtitle">Login</h2>

        <input
            className="input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" onClick={handleLogin}>
            Login
        </button>

        <p className="link" onClick={() => navigate("/register")}>
            Don’t have an account? <span>Register</span>
        </p>
        </div>
    </div>
  );
}
