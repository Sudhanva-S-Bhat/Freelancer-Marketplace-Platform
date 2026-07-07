import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import "../../styles/dashboard.css";

function ClientDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const NAV_ITEMS = ["Dashboard", "Profile", "Post a Project", "Messaging"];
    
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/projects/client/my-projects");
                if (res.data.success) {
                    setProjects(res.data.projects);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load projects");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "Open": return "active";
            case "In Progress": return "review";
            case "Completed": return "completed";
            case "Cancelled": return "review";
            default: return "active";
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await api.delete(`/projects/${id}`);
            if (res.data.success) {
                setProjects(projects.filter(p => p._id !== id));
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete project");
        }
    };

    return (
        <>
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.fullName}</h1>
                    <p>Manage your projects and connect with freelancers.</p>
                </div>

                <button className="primary-btn" onClick={() => navigate("/client/post-project")}>
                    + Post New Project
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="stats-grid">
                <div className="stat-card">
                    <h2>{projects.length}</h2>
                    <span>Projects Posted</span>
                </div>

                <div className="stat-card">
                    <h2>0</h2>
                    <span>Proposals (Coming Soon)</span>
                </div>

                <div className="stat-card">
                    <h2>0</h2>
                    <span>Active Contracts</span>
                </div>

                <div className="stat-card">
                    <h2>0</h2>
                    <span>Messages</span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
                    <h3>My Projects</h3>

                    {loading ? (
                        <p>Loading your projects...</p>
                    ) : projects.length === 0 ? (
                        <div className="page-placeholder">
                            <p>You haven't posted any projects yet.</p>
                            <button className="primary-btn" style={{ marginTop: "16px" }} onClick={() => navigate("/client/post-project")}>
                                Post your first project
                            </button>
                        </div>
                    ) : (
                        <div>
                            {projects.map((project) => (
                                <div className="project-item" key={project._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{project.title}</strong>
                                        <p style={{ margin: '4px 0' }}>Budget: ₹{project.budget} • Category: {project.category}</p>
                                        <span className={`status ${getStatusClass(project.status)}`}>{project.status}</span>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                                            Posted: {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent' }}
                                        >
                                            View
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(project._id)}
                                            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ClientDashboard;