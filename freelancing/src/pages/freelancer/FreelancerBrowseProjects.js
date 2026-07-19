import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, DollarSign, Clock, Briefcase, ChevronRight, X, Send } from 'lucide-react';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import '../../styles/dashboard.css';

function FreelancerBrowseProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [selectedProject, setSelectedProject] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await api.get('/projects/open');
            if (res.data.success) {
                setProjects(res.data.projects);
            }
        } catch (err) {
            console.error('Failed to fetch projects', err);
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess(false);
        setSubmitting(true);

        try {
            const res = await api.post('/proposals/submit', {
                projectId: selectedProject._id,
                bidAmount: Number(bidAmount),
                estimatedTime,
                coverLetter
            });
            
            if (res.data.success) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    setSelectedProject(null);
                    setSubmitSuccess(false);
                    // Reset form
                    setBidAmount('');
                    setEstimatedTime('');
                    setCoverLetter('');
                }, 2000);
            }
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to submit proposal.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-content-inner">
            <div className="dashboard-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>Find Work</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Browse open projects and submit winning proposals.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                padding: '10px 16px 10px 40px', 
                                borderRadius: '8px', 
                                border: '1px solid var(--border-color)', 
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                width: '250px'
                            }} 
                        />
                    </div>
                </div>
            </div>

            {error && <div className="error-banner" style={{ marginBottom: '24px' }}>{error}</div>}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div className="loading-spinner"></div>
                </div>
            ) : filteredProjects.length === 0 ? (
                <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <Briefcase size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <h3>No projects found</h3>
                    <p>Try adjusting your search criteria or check back later.</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredProjects.map((project) => (
                        <motion.div key={project._id} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                            <Card padding="md" hover style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--primary)' }}>{project.title}</h3>
                                        {project.skillsRequired && project.skillsRequired.slice(0, 3).map((skill, idx) => (
                                            <Badge key={idx} variant="outline" size="sm">{skill}</Badge>
                                        ))}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {project.description}
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <DollarSign size={16} color="#00FF88" />
                                            <span>Est. Budget: <strong style={{ color: 'var(--text-primary)' }}>${project.budget}</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={16} color="#FFB800" />
                                            <span>Deadline: <strong style={{ color: 'var(--text-primary)' }}>{new Date(project.deadline).toLocaleDateString()}</strong></span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                    <Button variant="primary" onClick={() => setSelectedProject(project)}>
                                        Submit Bid <ChevronRight size={16} style={{ marginLeft: '6px' }} />
                                    </Button>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        Posted {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Proposal Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 24px 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}
                        >
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Submit Proposal</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>For: {selectedProject.title}</p>
                                </div>
                                <button onClick={() => setSelectedProject(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleBidSubmit} style={{ padding: '24px' }}>
                                {submitError && <div className="error-banner" style={{ marginBottom: '16px' }}>{submitError}</div>}
                                {submitSuccess && <div style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00FF88', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(0,255,136,0.3)' }}>Proposal submitted successfully!</div>}
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Bid Amount ($)</label>
                                        <input 
                                            type="number" 
                                            required 
                                            min="1"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'white' }}
                                            placeholder="e.g. 500"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Estimated Time</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={estimatedTime}
                                            onChange={(e) => setEstimatedTime(e.target.value)}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'white' }}
                                            placeholder="e.g. 2 weeks"
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Cover Letter</label>
                                    <textarea 
                                        required
                                        rows="6"
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'white', resize: 'vertical' }}
                                        placeholder="Explain why you are the best fit for this project..."
                                    ></textarea>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <Button variant="ghost" type="button" onClick={() => setSelectedProject(null)}>Cancel</Button>
                                    <Button variant="primary" type="submit" disabled={submitting || submitSuccess} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {submitting ? 'Submitting...' : 'Send Proposal'} <Send size={16} />
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default FreelancerBrowseProjects;
