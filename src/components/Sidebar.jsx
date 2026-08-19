import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const individualNavItems = [
  { icon: 'fa-table-cells', fallback: 'fa-home', label: 'Dashboard', path: '/dashboard' },
  { icon: 'fa-envelope', fallback: 'fa-upload', label: 'Analyze Email', path: '/upload' },
  { icon: 'fa-history', fallback: 'fa-history', label: 'History', path: '/history' },
  { icon: 'fa-chart-bar', fallback: 'fa-chart-bar', label: 'Reports', path: '/reports' },
];

const organizationNavItems = [
  { icon: 'fa-building', fallback: 'fa-building', label: 'Organization Dashboard', path: '/admin' },
  { icon: 'fa-history', fallback: 'fa-history', label: 'Recent Analysis', path: '/admin/analysis' },
  { icon: 'fa-exclamation-triangle', fallback: 'fa-exclamation-triangle', label: 'Phishing Alerts', path: '/admin/alerts' },
  { icon: 'fa-lock', fallback: 'fa-lock', label: 'Quarantine', path: '/admin/quarantine' },
  { icon: 'fa-chart-bar', fallback: 'fa-chart-bar', label: 'Reports', path: '/admin/reports' },
];

export default function Sidebar({ children, role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = role || localStorage.getItem('phishshield_role') || 'individual';
  const isOrganization = currentRole === 'organization' || currentRole === 'admin';
  const navItems = isOrganization ? organizationNavItems : individualNavItems;

  const handleLogout = () => {
    localStorage.removeItem('phishshield_role');
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-shield"><i className="fas fa-shield-halved"></i></span>
          <span className="s-name">PhishShield <b>AI</b></span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`s-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon} s-link-icon`} data-fallback={item.fallback}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="s-link logout-btn" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket s-link-icon"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="app-topbar">
          <div></div>
          <div className="topbar-actions">
            <button className="topbar-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
              <span className="notification-dot">3</span>
            </button>
            <button className="avatar-button" aria-label="Profile">
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>

        <div className="page-content">
          {children}
        </div>

        <footer className="app-footer">© 2026 PhishShield AI. All rights reserved.</footer>
      </main>
    </div>
  );
}
