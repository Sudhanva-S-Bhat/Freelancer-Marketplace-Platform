import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import '../../styles/dashboard.css';

const fade = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.07, type: 'spring', stiffness: 300, damping: 24 }
    })
};

const statusConfig = {
    pending:  { icon: AlertCircle, color: '#f5b95c', label: 'Pending',  bg: 'rgba(245,185,92,0.12)',  border: 'rgba(245,185,92,0.3)'  },
    accepted: { icon: CheckCircle, color: '#3ee6a8', label: 'Accepted', bg: 'rgba(62,230,168,0.12)',  border: 'rgba(62,230,168,0.3)'  },
    rejected: { icon: XCircle,     color: '#f47b7b', label: 'Rejected', bg: 'rgba(244,123,123,0.12)', border: 'rgba(244,123,123,0.3)' },
};

function FreelancerBids() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const navigate = useNavigate();

    useEffect(() => { fetchProposals(); }, []);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/proposals/my-proposals');
            if (res.data.success) setProposals(res.data.proposals);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load your bids. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <motion.div variants={fade} custom={0} initial="hidden" animate="visible"
                style={{ marginBottom: 32 }}
            >
                <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>My Bids</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: 14.5 }}>
                    Track every proposal you've sent and its status.
                </p>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div variants={fade} custom={1} initial="hidden" animate="visible"
                    style={{
                        background: 'rgba(244,123,123,0.1)',
                        border: '1px solid rgba(244,123,123,0.3)',
                        color: '#f47b7b',
                        padding: '12px 18px',
                        borderRadius: 10,
                        fontSize: 14,
                        marginBottom: 24
                    }}
                >
                    {error}
                </motion.div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', gap: 16, color: 'var(--text-dim)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(47,216,238,0.2)', borderTopColor: '#2fd8ee', animation: 'spin .7s linear infinite' }} />
                    Loading your bids...
                </div>
            ) : proposals.length === 0 ? (
                /* Empty state — copied from lumina.html */
                <motion.div variants={fade} custom={2} initial="hidden" animate="visible"
                    style={{
                        background: 'linear-gradient(180deg, #101526, #0a0d18)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 22,
                        padding: '60px 24px',
                        textAlign: 'center'
                    }}
                >
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'rgba(47,216,238,0.08)',
                        border: '1px solid rgba(47,216,238,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        animation: 'breathe 2.6s ease-in-out infinite'
                    }}>
                        <FileText size={22} color="#2fd8ee" />
                    </div>
                    <h4 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No bids yet</h4>
                    <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: 340, margin: '0 auto 22px', lineHeight: 1.6 }}>
                        Submit a proposal from Browse Projects and it'll show up here with its status.
                    </p>
                    <button
                        onClick={() => navigate('/freelancer/browse-projects')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '10px 22px', borderRadius: 999,
                            color: '#2fd8ee', background: 'transparent',
                            border: '1px solid rgba(47,216,238,0.4)',
                            fontWeight: 600, fontSize: 14, cursor: 'pointer'
                        }}
                    >
                        Browse Projects →
                    </button>
                </motion.div>
            ) : (
                /* Bid list */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {proposals.map((proposal, i) => {
                        const s = statusConfig[proposal.status] || statusConfig.pending;
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={proposal._id}
                                custom={i}
                                variants={fade}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -4, borderColor: 'rgba(47,216,238,0.35)' }}
                                style={{
                                    position: 'relative', overflow: 'hidden',
                                    background: 'linear-gradient(180deg, #101526, #0a0d18)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 22,
                                    padding: '26px 28px',
                                    display: 'flex', alignItems: 'flex-end',
                                    justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
                                    transition: 'border-color .3s, transform .3s, box-shadow .3s',
                                }}
                            >
                                {/* Left neon bar */}
                                <div style={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                    background: 'linear-gradient(180deg, #2fd8ee, #8b6bf5)'
                                }} />

                                <div style={{ flex: 1, paddingLeft: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#2fd8ee' }}>
                                            {proposal.project?.title || 'Unknown Project'}
                                        </h3>
                                        {/* Status badge */}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '4px 12px', borderRadius: 999,
                                            fontSize: 12, fontWeight: 600,
                                            fontFamily: 'var(--font-mono)',
                                            background: s.bg, color: s.color, border: `1px solid ${s.border}`
                                        }}>
                                            <Icon size={13} />
                                            {s.label}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 14px', color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6,
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>
                                        {proposal.coverLetter}
                                    </p>
                                    <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--text-dim)' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            <DollarSign size={14} color="#3ee6a8" />
                                            Bid: <b style={{ color: 'var(--text)', fontWeight: 600 }}>${proposal.bidAmount}</b>
                                        </span>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            <Clock size={14} color="#f5b95c" />
                                            Est: <b style={{ color: 'var(--text)', fontWeight: 600 }}>{proposal.estimatedTime}</b>
                                        </span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
                                            {new Date(proposal.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default FreelancerBids;
