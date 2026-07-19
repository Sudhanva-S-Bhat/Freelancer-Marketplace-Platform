import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import "../../styles/auth.css";

function FreelancerRegister() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "", email: "", username: "",
        password: "", confirmPassword: "", identityNumber: "",
    });
    const [error, setError]   = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirmPassword) return setError("Passwords do not match");
        if (form.password.length < 8) return setError("Password must be at least 8 characters");
        setLoading(true);
        try {
            const res = await api.post("/auth/register/freelancer", form);
            if (res.data.success) {
                setSuccess("Account created! Redirecting to login…");
                setTimeout(() => navigate("/freelancer/login"), 1500);
            } else setError(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally { setLoading(false); }
    };

    const GradientBtn = ({ children, disabled }) => (
        <button
            type="submit"
            disabled={disabled}
            style={{
                width: "100%", padding: "14px 24px", borderRadius: 999, border: "none",
                background: disabled ? "rgba(255,255,255,0.05)" : "linear-gradient(90deg,#2fd8ee,#8b6bf5)",
                color: disabled ? "var(--text-faint)" : "#04070d",
                fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                marginTop: 8, transition: "box-shadow .25s, transform .25s",
            }}
            onMouseOver={e => { if (!disabled) e.currentTarget.style.boxShadow = "0 8px 30px -8px rgba(47,216,238,.55)"; }}
            onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
        >{children}</button>
    );

    return (
        <div className="auth-shell">
            <div className="auth-card" style={{ maxWidth: 520 }}>
                <h2 className="auth-title">Create Freelancer Account</h2>
                <p className="auth-sub">Join Lumina and start finding great projects</p>

                {error   && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <input name="fullName" type="text" placeholder="Full Name"
                            value={form.fullName} onChange={handleChange} required />
                        <label>Full Name</label>
                    </div>
                    <div className="field">
                        <input name="email" type="email" placeholder="Email Address"
                            value={form.email} onChange={handleChange} required />
                        <label>Email Address</label>
                    </div>
                    <div className="field">
                        <input name="username" type="text" placeholder="Username"
                            value={form.username} onChange={handleChange} required />
                        <label>Username</label>
                    </div>
                    <div className="field">
                        <input name="identityNumber" type="text" placeholder="Govt ID / Freelancer ID"
                            pattern="[a-zA-Z0-9]+" title="Alphanumeric only" minLength={6}
                            value={form.identityNumber} onChange={handleChange} required />
                        <label>Identity Number</label>
                    </div>
                    <div className="field">
                        <input name="password" type="password" placeholder="Password (min 8 chars)"
                            value={form.password} onChange={handleChange} required />
                        <label>Password</label>
                    </div>
                    <div className="field">
                        <input name="confirmPassword" type="password" placeholder="Confirm Password"
                            value={form.confirmPassword} onChange={handleChange} required />
                        <label>Confirm Password</label>
                    </div>
                    <GradientBtn disabled={loading}>
                        {loading && <span style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(4,7,13,.3)", borderTopColor:"#04070d", animation:"spin .7s linear infinite", display:"inline-block" }} />}
                        {loading ? "Creating Account…" : "Create Account"}
                    </GradientBtn>
                </form>

                <p className="auth-links">Already have an account? <Link to="/freelancer/login">Log in</Link></p>
                <a className="back-link" href="/">← Back to home</a>
            </div>
        </div>
    );
}

export default FreelancerRegister;
