import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function FreelancerLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login/freelancer", { identifier, password });
            if (res.data.success) {
                login(res.data.token, res.data.user);
                navigate(res.data.user.profileCompleted ? "/freelancer/dashboard" : "/freelancer/complete-profile");
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h1>Freelancer Login</h1>
            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            </form>

            <p className="switch-link">
                New here? <Link to="/freelancer/register">Create a freelancer account</Link>
            </p>
            <p className="switch-link">
                <Link to="/">Back to role selection</Link>
            </p>
        </div>
    );
}

export default FreelancerLogin;
