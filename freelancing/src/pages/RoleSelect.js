import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function RoleSelect() {
    return (
        <div className="auth-card role-select-card">
            <h1>Freelancer Marketplace</h1>
            <p className="subtitle">Continue as a client looking to hire, or a freelancer looking for work.</p>

            <div className="role-options">
                <div className="role-option">
                    <h3>I'm a Client</h3>
                    <p>I want to hire freelancers for my projects.</p>
                    <Link to="/client/login" className="btn-link">Client Login</Link>
                    <Link to="/client/register" className="btn-link secondary">Create Client Account</Link>
                </div>

                <div className="role-option">
                    <h3>I'm a Freelancer</h3>
                    <p>I want to find work and offer my services.</p>
                    <Link to="/freelancer/login" className="btn-link">Freelancer Login</Link>
                    <Link to="/freelancer/register" className="btn-link secondary">Create Freelancer Account</Link>
                </div>
            </div>
        </div>
    );
}

export default RoleSelect;
