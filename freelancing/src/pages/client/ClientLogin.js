import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function ClientLogin() {
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
            const res = await api.post("/auth/login/client", { identifier, password });
            if (res.data.success) {
                login(res.data.token, res.data.user);
                navigate(res.data.user.profileCompleted ? "/client/dashboard" : "/client/complete-profile");
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
            <h1>Client Login</h1>
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
                New here? <Link to="/client/register">Create a client account</Link>
            </p>
            <p className="switch-link">
                <Link to="/">Back to role selection</Link>
            </p>
        </div>
    );
}

export default ClientLogin;
