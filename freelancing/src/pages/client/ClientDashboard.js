import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, MessageSquare, Clock, FileCheck, Plus, Eye, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../../styles/dashboard.css";

function ClientDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ activeContracts: 0, pendingProposals: 0, unreadMessages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch projects — this is the critical call
                const projectsRes = await api.get("/projects/client/my-projects");
                if (projectsRes.data.success) setProjects(projectsRes.data.projects);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load projects");
            } finally {
                setLoading(false);
            }

            // Fetch stats separately — a failure here won't break the dashboard
            try {
                const statsRes = await api.get("/client/stats");
                if (statsRes.data.success) setStats({
                    activeContracts: statsRes.data.activeContracts,
                    pendingProposals: statsRes.data.pendingProposals,
                    unreadMessages: statsRes.data.unreadMessages,
                });
            } catch {
                // Stats are non-critical — silently ignore if they fail
            }
        };

        fetchData();
    }, []);

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Open": return "primary";
            case "In Progress": return "warning";
            case "Completed": return "success";
            case "Cancelled": return "danger";
            default: return "neutral";
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div 
            className="dashboard-page"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="dashboard-header-flex" variants={itemVariants}>
                <div>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back, {user?.fullName}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Here is what's happening with your projects today.</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate("/client/post-project")}>
                    Post New Project
                </Button>
            </motion.div>

            {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="error-banner">{error}</motion.div>}

            <div className="bento-grid">
                {/* Main Content Column */}
                <div className="bento-main">
                    <motion.div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} variants={containerVariants}>
                        <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Card hover padding="md" className="stat-widget">
                            <div className="neon-icon-wrapper cyan">
                                <Briefcase size={24} />
                            </div>
                            <h2 style={{ fontSize: '32px', margin: '0 0 4px 0' }}>{projects.length}</h2>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Projects Posted</span>
                        </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Card hover padding="md" className="stat-widget">
                            <div className="neon-icon-wrapper yellow">
                                <Clock size={24} />
                            </div>
                            <h2 style={{ fontSize: '32px', margin: '0 0 4px 0' }}>{stats.pendingProposals}</h2>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Pending Proposals</span>
                        </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Card hover padding="md" className="stat-widget">
                            <div className="neon-icon-wrapper green">
                                <FileCheck size={24} />
                            </div>
                            <h2 style={{ fontSize: '32px', margin: '0 0 4px 0' }}>{stats.activeContracts}</h2>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Active Contracts</span>
                        </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Card hover padding="md" className="stat-widget">
                            <div className="neon-icon-wrapper purple">
                                <MessageSquare size={24} />
                            </div>
                            <h2 style={{ fontSize: '32px', margin: '0 0 4px 0' }}>{stats.unreadMessages}</h2>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Unread Messages</span>
                        </Card>
                        </motion.div>
                    </motion.div>

                    {/* Chart Section */}
                    <motion.div variants={itemVariants}>
                        <Card className="dashboard-chart-section">
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '18px', margin: 0 }}>Hiring Activity Overview</h3>
                            </div>
                            <div style={{ padding: '24px', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={[
                                            { name: 'Jan', posts: 1 },
                                            { name: 'Feb', posts: 2 },
                                            { name: 'Mar', posts: 1 },
                                            { name: 'Apr', posts: 4 },
                                            { name: 'May', posts: 3 },
                                            { name: 'Jun', posts: 5 },
                                            { name: 'Jul', posts: projects.length }
                                        ]}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="posts" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPosts)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

            <motion.div variants={itemVariants}>
            <Card className="dashboard-projects-section">
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', margin: 0 }}>Recent Projects</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/client/my-projects")}>View All</Button>
                </div>

                {loading ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div className="spinner" style={{ margin: '0 auto 16px auto', borderTopColor: 'var(--primary)' }}></div>
                        <p>Loading your projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                        <div style={{ background: 'var(--bg-main)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                            <Briefcase size={32} color="var(--text-muted)" />
                        </div>
                        <h3 style={{ marginBottom: '8px' }}>No projects yet</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Get started by posting your first project to hire top talent.</p>
                        <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate("/client/post-project")}>
                            Post a Project
                        </Button>
                    </div>
                ) : (
                    <div className="modern-table-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Project Details</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Budget</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody component={motion.tbody}>
                                <AnimatePresence>
                                {projects.slice(0, 5).map((project) => (
                                    <motion.tr 
                                        key={project._id} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }} 
                                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-main)'} 
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '20px 24px' }}>
                                            <p style={{ fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{project.title}</p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Posted: {new Date(project.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td style={{ padding: '20px 24px', fontWeight: '500' }}>
                                            ₹{project.budget.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <Button variant="outline" size="sm" icon={<Eye size={16} />} onClick={() => navigate(`/client/project/${project._id}`)}>
                                                    View
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(project._id)} style={{ color: 'var(--accent)' }}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
            </motion.div>
                </div> {/* End Main Content Column */}

                {/* Sidebar Column */}
                <div className="bento-sidebar">
                    <motion.div variants={itemVariants}>
                        <Card className="dashboard-activity-section">
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '18px', margin: 0 }}>Live Activity</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div className="activity-feed">
                                    <div className="activity-item">
                                        <div className="activity-dot" style={{ borderColor: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }}></div>
                                        <div className="activity-content">
                                            <p><strong>System</strong> initialized your dashboard configuration.</p>
                                            <span>Just now</span>
                                        </div>
                                    </div>
                                    {projects.length > 0 && (
                                        <div className="activity-item">
                                            <div className="activity-dot" style={{ borderColor: '#FFB800', boxShadow: '0 0 10px #FFB800' }}></div>
                                            <div className="activity-content">
                                                <p>You posted a new project: <strong>{projects[0].title}</strong></p>
                                                <span>{new Date(projects[0].createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="activity-item">
                                        <div className="activity-dot" style={{ borderColor: '#00FF88', boxShadow: '0 0 10px #00FF88' }}></div>
                                        <div className="activity-content">
                                            <p>Your client profile was successfully verified by the moderation team.</p>
                                            <span>2 days ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div> {/* End Sidebar Column */}
            </div> {/* End Bento Grid */}
        </motion.div>
    );
}

export default ClientDashboard;