import React from 'react';
import Card from '../../components/ui/Card';
import { Users } from 'lucide-react';
import '../../styles/dashboard.css';

function ClientSearchFreelancers() {
    return (
        <div className="dashboard-content-inner">
            <div className="dashboard-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>Find Freelancers</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Browse the marketplace for top talent.</p>
            </div>

            <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3>Talent Directory Coming Soon</h3>
                <p>We are currently indexing freelancer profiles to bring you the best matches.</p>
            </Card>
        </div>
    );
}

export default ClientSearchFreelancers;
