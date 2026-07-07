import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrowseJobs from "./BrowseJobs";
import FreelancerProfile from "./FreelancerProfile";
import BidReview from "./BidReview";
import "../../styles/dashboard.css";

const NAV_ITEMS = ["Dashboard", "Profile", "Browse Jobs", "Messaging", "Bid Review"];

function FreelancerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Dashboard");

    const handleLogout = () => {
        logout();
        navigate("/freelancer/login");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return (
                    <div>
                        <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                            <div>
                                <h1>Welcome, {user?.fullName}</h1>
                                <p>Find work, manage contracts, and track your earnings.</p>
                            </div>
                        </div>
                        <h2 style={{ marginBottom: '24px' }}>Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h2>0</h2>
                                <span>Active Bids</span>
                            </div>
                            <div className="stat-card">
                                <h2>0</h2>
                                <span>Active Contracts</span>
                            </div>
                            <div className="stat-card">
                                <h2>₹0</h2>
                                <span>Total Earnings</span>
                            </div>
                            <div className="stat-card">
                                <h2>0</h2>
                                <span>Unread Messages</span>
                            </div>
                        </div>
                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <h3>Recent Notifications</h3>
                                <div className="page-placeholder" style={{ padding: '20px' }}>
                                    No new notifications.
                                </div>
                            </div>
                            <div className="dashboard-card">
                                <h3>Active Contracts</h3>
                                <div className="page-placeholder" style={{ padding: '20px' }}>
                                    You don't have any active contracts yet.
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "Browse Jobs":
                return <BrowseJobs />;
            case "Profile":
                return <FreelancerProfile />;
            case "Bid Review":
                return <BidReview />;
            default:
                return (
                    <div className="page-placeholder">
                        {activeTab} — this section is a placeholder for future functionality.
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Freelancer Portal</h2>
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
                {renderContent()}
            </main>
        </div>
    );
}

export default FreelancerDashboard;
