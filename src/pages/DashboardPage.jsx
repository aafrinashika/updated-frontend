import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';

const quickActions = [
  {
    icon: 'fa-upload',
    title: 'Analyze Email Header',
    desc: 'Upload or paste an email header for instant AI analysis.',
    btn: 'Start Analysis',
    path: '/upload',
    color: 'blue',
  },
  {
    icon: 'fa-history',
    title: 'Email History',
    desc: 'Browse and search through all your previous scan results.',
    btn: 'View History',
    path: '/history',
    color: 'green',
  },
  {
    icon: 'fa-chart-bar',
    title: 'Security Reports',
    desc: 'Generate and download detailed security reports.',
    btn: 'View Reports',
    path: '/reports',
    color: 'purple',
  },
];

const recentScans = [
  { sender: 'support@gmail.com',          date: '08 Aug 2026', risk: 8,  status: 'safe' },
  { sender: 'security@paypal-login.xyz',  date: '07 Aug 2026', risk: 95, status: 'phishing' },
  { sender: 'notification@amazon.in',     date: '07 Aug 2026', risk: 48, status: 'warning' },
  { sender: 'bank@canarabank.com',        date: '06 Aug 2026', risk: 5,  status: 'safe' },
  { sender: 'verify@microsoft-login.net', date: '05 Aug 2026', risk: 88, status: 'phishing' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const statusBadge = (status) => {
    const map = {
      safe: ['badge-safe', 'Safe'],
      phishing: ['badge-danger', 'Phishing'],
      warning: ['badge-warning', 'Medium Risk'],
    };
    const [cls, label] = map[status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const riskColor = (r) => r >= 70 ? '#e02424' : r >= 40 ? '#c27803' : '#057a55';

  return (
    <Sidebar>
      <div className="page-header">
        <h1>Welcome back 👋</h1>
        <p>Here's your email security overview for today.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card animate-in">
          <div className="stat-icon blue"><i className="fas fa-envelope"></i></div>
          <div className="stat-info"><h3>1,250</h3><p>Total Scans</p></div>
        </div>
        <div className="stat-card animate-in" style={{animationDelay:'0.05s'}}>
          <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
          <div className="stat-info"><h3>1,085</h3><p>Safe Emails</p></div>
        </div>
        <div className="stat-card animate-in" style={{animationDelay:'0.1s'}}>
          <div className="stat-icon red"><i className="fas fa-shield-virus"></i></div>
          <div className="stat-info"><h3>165</h3><p>Phishing Blocked</p></div>
        </div>
        <div className="stat-card animate-in" style={{animationDelay:'0.15s'}}>
          <div className="stat-icon yellow"><i className="fas fa-percentage"></i></div>
          <div className="stat-info"><h3>96%</h3><p>Detection Accuracy</p></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((a, i) => (
          <div key={i} className={`qa-card qa-${a.color} animate-in`} style={{animationDelay:`${i*0.08}s`}}>
            <div className="qa-icon"><i className={`fas ${a.icon}`}></i></div>
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
            <button className={`btn btn-qa-${a.color}`} onClick={() => navigate(a.path)}>
              {a.btn} <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Recent Scans */}
      <div className="card animate-in" style={{marginTop: '24px'}}>
        <div className="card-header">
          <h3><i className="fas fa-clock" style={{marginRight:8, color:'var(--primary)'}}></i>Recent Email Scans</h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/history')}>
            View All
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Date</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map((scan, i) => (
                <tr key={i}>
                  <td>
                    <span className="sender-cell">
                      <i className="fas fa-envelope-open" style={{color:'#94a3b8', marginRight:8}}></i>
                      {scan.sender}
                    </span>
                  </td>
                  <td style={{color:'var(--text-muted)'}}>{scan.date}</td>
                  <td>
                    <div className="risk-inline">
                      <div className="risk-bar-bg">
                        <div className="risk-bar-fill" style={{
                          width: `${scan.risk}%`,
                          background: riskColor(scan.risk)
                        }}></div>
                      </div>
                      <span style={{color: riskColor(scan.risk), fontWeight: 700}}>
                        {scan.risk}%
                      </span>
                    </div>
                  </td>
                  <td>{statusBadge(scan.status)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/result')}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}