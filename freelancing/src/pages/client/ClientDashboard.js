import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard.css";

const NAV_ITEMS = ["Dashboard Home", "Profile", "Post a Project", "Messaging"];

function ClientDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Dashboard Home");

    const handleLogout = () => {
        logout();
        navigate("/client/login");
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Client Portal</h2>
                <nav>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item}
                            className={activeTab === item ? "nav-item active" : "nav-item"}
                            onClick={() => setActiveTab(item)}
                        >
                            {item}
                        </button>
                    ))}
                    <button className="nav-item logout" onClick={handleLogout}>Logout</button>
                </nav>
            </aside>

            <main className="dashboard-content">
                <h1>Welcome, {user?.fullName}</h1>
                <p className="page-placeholder">{activeTab} — this section is a placeholder for future functionality.</p>
            </main>
        </div>
    );
}

export default ClientDashboard;
