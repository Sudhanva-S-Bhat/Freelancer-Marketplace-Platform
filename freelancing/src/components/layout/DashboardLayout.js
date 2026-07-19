import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clientLinks = [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Post Project', path: '/client/post-project', icon: Briefcase },
    { name: 'My Projects', path: '/client/my-projects', icon: FileText },
    { name: 'Find Freelancers', path: '/client/search-freelancers', icon: Users },
    { name: 'Messages', path: '/client/messages', icon: MessageSquare },
  ];

  const freelancerLinks = [
    { name: 'Dashboard', path: '/freelancer/dashboard', icon: LayoutDashboard },
    { name: 'Browse Projects', path: '/freelancer/browse-projects', icon: Briefcase },
    { name: 'My Bids', path: '/freelancer/my-bids', icon: FileText },
    { name: 'Messages', path: '/freelancer/messages', icon: MessageSquare },
  ];

  const links = role === 'CLIENT' ? clientLinks : freelancerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Overlay (Mobile) */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={28} color="var(--primary)" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lumina</span>
          </div>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.includes(link.path);
              return (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="header-search">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          
          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2fd8ee, #8b6bf5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono, monospace)', fontWeight: 700,
                fontSize: 14, color: '#04070d', flexShrink: 0,
                boxShadow: '0 0 12px rgba(47,216,238,0.35)'
              }}>
                {((user?.fullName || user?.name || 'U')[0]).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.fullName || user?.name || 'User'}</span>
                <span className="user-role">{role === 'CLIENT' ? 'Client' : 'Freelancer'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
