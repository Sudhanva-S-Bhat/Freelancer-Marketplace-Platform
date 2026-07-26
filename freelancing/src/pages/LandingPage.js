import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MessageSquare, CheckCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import './LandingPage.css';

// Custom hook for scroll animations
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [options]);

  return [elementRef, isVisible];
}

const LandingPage = () => {
  const [heroRef, heroVisible] = useIntersectionObserver();
  const [statsRef, statsVisible] = useIntersectionObserver();
  const [featuresRef, featuresVisible] = useIntersectionObserver();
  const [ctaRef, ctaVisible] = useIntersectionObserver();
  const [salesOpen, setSalesOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.png" alt="Lumina" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Lumina</span>
          </div>
          <div className="nav-links">
            <Link to="/freelancers">Find Talent</Link>
            <Link to="/projects">Find Work</Link>
            <a href="#pricing-plans">Plans & Pricing</a>
            <Link to="/about">Why Us</Link>
          </div>
          <div className="nav-actions">
            <Link to="/RoleSelect?mode=login"><Button variant="ghost">Log In</Button></Link>
            <Link to="/RoleSelect?mode=register"><Button variant="primary">Sign Up</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section" ref={heroRef}>
        <div className={`hero-content scroll-animate ${heroVisible ? 'visible' : ''}`}>
          <div className="hero-badge">
            <Sparkles size={16} className="text-primary" />
            <span>AI-Powered Talent Matching Live</span>
          </div>
          <h1 style={{ background: "linear-gradient(135deg,#fff 60%,rgba(255,255,255,.55))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Find the perfect freelancer for your project
          </h1>
          <p>
            Connect with pre-vetted professionals, manage contracts, and scale your team securely with Lumina's premier freelancing ecosystem.
          </p>
          <div className="hero-actions">
            <Link to="/RoleSelect?mode=register"><Button variant="gradient" size="lg">Get Started</Button></Link>
            <Link to="/projects"><Button variant="outline" size="lg">Browse Projects</Button></Link>
          </div>
        </div>
      </header>

      {/* Trust Stats */}
      <section className="stats-section" ref={statsRef}>
        <div className={`stats-grid scroll-animate ${statsVisible ? 'visible' : ''}`}>
          <div className="stat-card">
            <h3>10k+</h3>
            <p>Active Freelancers</p>
          </div>
          <div className="stat-card">
            <h3>$15M+</h3>
            <p>Payments Secured</p>
          </div>
          <div className="stat-card">
            <h3>4.9/5</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section" ref={featuresRef}>
        <div className={`section-header scroll-animate ${featuresVisible ? 'visible' : ''}`}>
          <h2>Why Choose Lumina?</h2>
          <p>Everything you need to hire, manage, and scale your remote team.</p>
        </div>
        <div className={`features-grid scroll-animate delay-1 ${featuresVisible ? 'visible' : ''}`}>
          <Card hover>
            <Shield className="feature-icon text-primary" size={32} />
            <h3>Verified Professionals</h3>
            <p>Every freelancer passes our rigorous screening process before joining.</p>
          </Card>
          <Card hover>
            <CheckCircle className="feature-icon text-success" size={32} />
            <h3>Secure Payments</h3>
            <p>Escrow protection guarantees you only pay for approved work.</p>
          </Card>
          <Card hover>
            <MessageSquare className="feature-icon text-accent" size={32} />
            <h3>Live Messaging</h3>
            <p>Collaborate in real-time with integrated chat and file sharing.</p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-plans" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Badge variant="primary">Flexible Pricing</Badge>
          <h2 style={{ fontSize: 32, marginTop: 16, fontWeight: 800, color: '#fff' }}>Simple, Transparent Plans</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '12px auto 0' }}>Select a plan to start your 1st month free trial. Cancel anytime.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Basic Plan */}
          <Card hover style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 20, margin: '0 0 8px 0', color: '#fff' }}>Basic</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 24 }}>Essential tools to get started</p>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 24 }}>$0 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: 'var(--text-secondary)' }}>
              <li>✓ Submit up to 5 bids/month</li>
              <li>✓ Standard escrow security</li>
              <li>✓ Direct client messaging</li>
            </ul>
            <Link to="/RoleSelect?mode=register" style={{ marginTop: 'auto' }}>
              <Button variant="outline" style={{ width: '100%' }}>Get Started Free</Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card hover style={{ padding: 32, display: 'flex', flexDirection: 'column', border: '2px solid var(--primary)', position: 'relative', background: 'rgba(99,91,255,.05)', overflow: 'visible' }}>
            <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 99, background: 'linear-gradient(90deg,#635bff,#2fd8ee)', color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</span>
            <h3 style={{ fontSize: 20, margin: '0 0 8px 0', color: '#fff' }}>Professional</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 24 }}>Unlock premium reach & AI matching</p>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 24 }}>$19 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: 'var(--text-secondary)' }}>
              <li>✓ <strong>1st Month Free Trial</strong></li>
              <li>✓ Unlimited bid & project postings</li>
              <li>✓ Verified Pro badge & search priority</li>
              <li>✓ 24/7 dedicated support</li>
            </ul>
            <Link to="/RoleSelect?mode=register" style={{ marginTop: 'auto' }}>
              <Button variant="primary" style={{ width: '100%' }}>Start 1 Month Free</Button>
            </Link>
          </Card>

          {/* Enterprise Plan */}
          <Card hover style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 20, margin: '0 0 8px 0', color: '#fff' }}>Enterprise</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 24 }}>For power users & company teams</p>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 24 }}>$49 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: 'var(--text-secondary)' }}>
              <li>✓ Zero platform transaction fees</li>
              <li>✓ Custom branding & header logo</li>
              <li>✓ Dedicated hiring manager</li>
            </ul>
            <Button variant="outline" style={{ width: '100%', marginTop: 'auto' }} onClick={() => setSalesOpen(true)}>Contact Sales</Button>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" ref={ctaRef}>
        <div className={`cta-container scroll-animate ${ctaVisible ? 'visible' : ''}`}>
          <h2>Ready to elevate your work?</h2>
          <p>Join thousands of businesses and freelancers building the future of work.</p>
          <Link to="/RoleSelect?mode=register"><Button variant="gradient" size="lg">Join Lumina Today</Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'white' }}>
              <Sparkles size={28} color="white" />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Lumina</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '300px' }}>The premium destination for the world's top talent and best companies.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>For Clients</h4>
              <a href="/">How to Hire</a>
              <a href="/">Talent Marketplace</a>
              <a href="/">Project Catalog</a>
            </div>
            <div>
              <h4>For Freelancers</h4>
              <a href="/">How to Find Work</a>
              <a href="/">Create Profile</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="/">About Us</a>
              <a href="/">Careers</a>
              <a href="/">Contact Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Lumina. All rights reserved.</p>
        </div>
      </footer>

      {/* Contact Sales Modal */}
      <AnimatePresence>
        {salesOpen && (
          <ContactSalesModal onClose={() => setSalesOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Contact Sales Modal ───────────────────────── */
function ContactSalesModal({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    teamSize: '10-50',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,7,13,0.85)', backdropFilter: 'blur(12px)' }}
      />

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 480,
          background: 'linear-gradient(180deg, rgba(30,34,45,0.9), rgba(15,18,24,0.95))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 36, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          zIndex: 1
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(62,230,168,0.1)', border: '1px solid rgba(62,230,168,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color="var(--ok)" />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Message Received</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 24 }}>
              Thank you for contacting sales! One of our enterprise hiring directors will reach out to you at <strong>{formData.workEmail}</strong> within the next 4 business hours.
            </p>
            <Button variant="primary" style={{ width: '100%' }} onClick={onClose}>Close Window</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={20} color="var(--cyan)" />
              <span style={{ color: 'var(--cyan)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise Solutions</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Contact Sales</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 13.5, margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Scale your product team with pre-vetted senior developers and designers under a managed contract.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-strong)', borderRadius: 8, color: '#fff', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Work Email</label>
                <input 
                  required 
                  type="email" 
                  value={formData.workEmail}
                  onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-strong)', borderRadius: 8, color: '#fff', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Company Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-strong)', borderRadius: 8, color: '#fff', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Team Size</label>
                  <select 
                    value={formData.teamSize}
                    onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: '#1c1f26', border: '1px solid var(--border-strong)', borderRadius: 8, color: '#fff', outline: 'none', fontSize: 14, height: 46, fontFamily: 'var(--font-body)' }}
                  >
                    <option value="1-10">1 - 10</option>
                    <option value="10-50">10 - 50</option>
                    <option value="50-200">50 - 200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Requirements / Project Details</label>
                <textarea 
                  required 
                  rows={3} 
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-strong)', borderRadius: 8, color: '#fff', outline: 'none', fontSize: 14, resize: 'none', fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <Button 
              disabled={submitting} 
              type="submit" 
              variant="gradient" 
              style={{ width: '100%', marginTop: 24, padding: '14px 20px', fontWeight: 700 }}
            >
              {submitting ? 'Connecting...' : 'Request Consultation'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default LandingPage;
