import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ExternalLink, Send, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import '../../styles/dashboard.css';

/* ── Shared field styles ─────────────────────── */
const inp = {
  width: '100%', padding: '13px 16px', borderRadius: 'var(--r-sm)',
  border: '1px solid var(--border-strong)', background: 'rgba(255,255,255,.025)',
  color: 'var(--text)', fontSize: 14.5, fontFamily: 'var(--font-body)',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color .25s, box-shadow .25s',
};
const focusIn  = e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 4px rgba(47,216,238,.1)'; };
const focusOut = e => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; };

export default function FreelancerContracts() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Update Modal
    const [selectedContract, setSelectedContract] = useState(null);
    const [updateText, setUpdateText] = useState('');
    const [fileLink, setFileLink] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/proposals/my-contracts');
            if (res.data.success) {
                setContracts(res.data.contracts);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load contracts.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post(`/projects/${selectedContract.project._id}/progress`, {
                text: updateText,
                fileLink
            });
            if (res.data.success) {
                // Refresh list
                await fetchContracts();
                setSelectedContract(null);
                setUpdateText('');
                setFileLink('');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit update');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="dashboard-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div className="spinner" />
        </div>
    );

    return (
        <div className="dashboard-page">
            <div className="dashboard-header-flex">
                <div>
                    <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>Active Contracts</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your ongoing projects and submit progress updates.</p>
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {contracts.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Briefcase size={28} color="var(--text-muted)" />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0' }}>No active contracts</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>When a client accepts your bid, it will appear here.</p>
                        <Button variant="primary" onClick={() => navigate('/freelancer/browse-projects')}>Find Work</Button>
                    </div>
                ) : (
                    contracts.map(contract => (
                        <Card key={contract._id} style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text)' }}>
                                            {contract.project.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                Client: {contract.project.clientId?.fullName || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                        <Badge variant={contract.project.status === 'Completed' ? 'success' : 'primary'}>
                                            {contract.project.status}
                                        </Badge>
                                        <Badge variant={contract.project.paymentStatus === 'Paid' ? 'success' : contract.project.paymentStatus === 'Escrow' ? 'warning' : 'neutral'}>
                                            Payment: {contract.project.paymentStatus || 'Unknown'}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agreed Amount</div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>${contract.bidAmount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{contract.estimatedTime}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            disabled={contract.project.status === 'Completed'}
                                            onClick={() => setSelectedContract(contract)}
                                            style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
                                        >
                                            <Send size={14} style={{ marginRight: 6 }} /> Add Update
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Update Modal */}
            <AnimatePresence>
                {selectedContract && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            style={{ background: 'linear-gradient(135deg,rgba(13,17,32,.99),rgba(8,11,20,1))', width: '100%', maxWidth: '600px', borderRadius: 'var(--r-xl)', border: '1px solid var(--border-strong)', boxShadow: '0 32px 80px rgba(0,0,0,.85), 0 0 0 1px rgba(47,216,238,.12)', overflow: 'hidden' }}
                        >
                            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>Submit Progress Update</h3>
                                    <p style={{ margin: 0, color: 'var(--cyan)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>For: {selectedContract.project.title}</p>
                                </div>
                                <button onClick={() => setSelectedContract(null)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--border-strong)', color: 'var(--text-dim)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
                                >
                                    <X size={15} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdateSubmit} style={{ padding: '24px 28px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Update Details <span style={{ color: 'var(--cyan)', marginLeft: 4 }}>*</span></label>
                                    <textarea 
                                        required
                                        rows="4"
                                        value={updateText}
                                        onChange={(e) => setUpdateText(e.target.value)}
                                        style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }}
                                        onFocus={focusIn} onBlur={focusOut}
                                        placeholder="What have you completed? E.g. Finished the home page design..."
                                    ></textarea>
                                </div>
                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Deliverable Link (Optional)</label>
                                    <div style={{ position: 'relative' }}>
                                        <ExternalLink size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                                        <input 
                                            type="url" 
                                            value={fileLink}
                                            onChange={(e) => setFileLink(e.target.value)}
                                            style={{ ...inp, paddingLeft: 40 }}
                                            onFocus={focusIn} onBlur={focusOut}
                                            placeholder="Google Drive, Figma, GitHub, etc."
                                        />
                                    </div>
                                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>Provide a sharable link to your project files or software management tool.</p>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <Button variant="ghost" type="button" onClick={() => setSelectedContract(null)}>Cancel</Button>
                                    <Button variant="primary" type="submit" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {submitting ? 'Submitting...' : 'Send Update'} <Send size={16} />
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
