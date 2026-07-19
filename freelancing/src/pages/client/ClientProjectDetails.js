import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import api from "../../api/axiosInstance";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { motion } from "framer-motion";
import "../../styles/dashboard.css";

function ClientProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const [projectRes, proposalsRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/proposals/project/${id}`)
                ]);
                
                if (projectRes.data.success) setProject(projectRes.data.project);
                if (proposalsRes.data.success) setProposals(proposalsRes.data.proposals);
            } catch (err) {
                setError("Failed to load project details or proposals.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleUpdateProposal = async (proposalId, status) => {
        try {
            const res = await api.put(`/proposals/${proposalId}/status`, { status });
            if (res.data.success) {
                // Update local state
                setProposals(proposals.map(p => p._id === proposalId ? { ...p, status } : p));
                if (status === 'accepted') {
                    setProject({ ...project, status: 'In Progress' });
                }
            }
        } catch (err) {
            alert("Failed to update proposal status.");
        }
    };

    if (loading) return <div style={{ padding: '64px', textAlign: 'center' }}><div className="loading-spinner"></div></div>;
    if (error) return <div className="error-banner">{error}</div>;
    if (!project) return <div>Project not found.</div>;

    return (
        <div className="dashboard-content-inner">
            <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate("/client/my-projects")} style={{ marginBottom: '24px' }}>
                Back to Projects
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginBottom: '32px' }}>
                {/* Project Details */}
                <Card padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <h1 style={{ fontSize: '24px', margin: 0 }}>{project.title}</h1>
                        <Badge variant="primary">{project.status}</Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                        {project.description}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Budget</span>
                            <strong style={{ fontSize: '16px' }}>${project.budget}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Deadline</span>
                            <strong style={{ fontSize: '16px' }}>{new Date(project.deadline).toLocaleDateString()}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Experience</span>
                            <strong style={{ fontSize: '16px' }}>{project.experienceLevel}</strong>
                        </div>
                    </div>
                </Card>

                {/* Sidebar Stats */}
                <Card padding="md">
                    <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Proposals Summary</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Received</span>
                        <strong style={{ fontSize: '18px' }}>{proposals.length}</strong>
                    </div>
                </Card>
            </div>

            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Submitted Proposals</h2>
            
            {proposals.length === 0 ? (
                <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <Briefcase size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <h3>No proposals yet</h3>
                    <p>Freelancers haven't submitted any bids for this project yet.</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {proposals.map(proposal => (
                        <motion.div key={proposal._id} whileHover={{ scale: 1.01 }}>
                            <Card padding="md" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, paddingRight: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <h3 style={{ margin: 0 }}>{proposal.freelancer?.fullName || "Freelancer"}</h3>
                                        {proposal.status !== 'pending' && (
                                            <Badge variant={proposal.status === 'accepted' ? 'success' : 'danger'}>
                                                {proposal.status.toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                                        {proposal.coverLetter}
                                    </p>
                                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                        <span>Bid: <strong style={{ color: 'white' }}>${proposal.bidAmount}</strong></span>
                                        <span>Est. Time: <strong style={{ color: 'white' }}>{proposal.estimatedTime}</strong></span>
                                    </div>
                                </div>
                                
                                {proposal.status === 'pending' && project.status === 'Open' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                                        <Button variant="primary" style={{ background: '#00FF88', color: '#0B0E14' }} onClick={() => handleUpdateProposal(proposal._id, 'accepted')}>
                                            <CheckCircle size={16} style={{ marginRight: '6px' }} /> Accept Bid
                                        </Button>
                                        <Button variant="outline" style={{ color: '#FF3366', borderColor: 'rgba(255, 51, 102, 0.3)' }} onClick={() => handleUpdateProposal(proposal._id, 'rejected')}>
                                            <XCircle size={16} style={{ marginRight: '6px' }} /> Reject
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClientProjectDetails;
