import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import "../../styles/auth.css";

function FreelancerRegister() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/register/freelancer", form);
            if (res.data.success) {
                navigate("/freelancer/login");
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h1>Freelancer Sign Up</h1>
            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input name="fullName" type="text" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
            </form>

            <p className="switch-link">
                Already have an account? <Link to="/freelancer/login">Log in</Link>
            </p>
            <p className="switch-link">
                <Link to="/">Back to role selection</Link>
            </p>
        </div>
    );
}

export default FreelancerRegister;
