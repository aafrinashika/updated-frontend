import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './HistoryPage.css';

const allScans = [
  { id: 1, date: '08 Aug 2026', sender: 'support@gmail.com',           risk: 8,  status: 'safe' },
  { id: 2, date: '07 Aug 2026', sender: 'security@paypal-login.xyz',   risk: 95, status: 'phishing' },
  { id: 3, date: '07 Aug 2026', sender: 'notification@amazon.in',      risk: 48, status: 'warning' },
  { id: 4, date: '06 Aug 2026', sender: 'bank@canarabank.com',         risk: 5,  status: 'safe' },
  { id: 5, date: '05 Aug 2026', sender: 'verify@microsoft-login.net',  risk: 88, status: 'phishing' },
  { id: 6, date: '04 Aug 2026', sender: 'noreply@github.com',          risk: 3,  status: 'safe' },
  { id: 7, date: '03 Aug 2026', sender: 'alert@apple-security.xyz',    risk: 91, status: 'phishing' },
  { id: 8, date: '02 Aug 2026', sender: 'invoice@quickbooks.com',      risk: 12, status: 'safe' },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = allScans.filter(s => {
    const matchSearch = s.sender.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const riskColor = (r) => r >= 70 ? '#e02424' : r >= 40 ? '#c27803' : '#057a55';

  const statusBadge = (status) => {
    const map = {
      safe:     ['badge-safe',    'Safe'],
      phishing: ['badge-danger',  'Phishing'],
      warning:  ['badge-warning', 'Medium Risk'],
    };
    const [cls, label] = map[status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const counts = {
    all:      allScans.length,
    safe:     allScans.filter(s => s.status === 'safe').length,
    phishing: allScans.filter(s => s.status === 'phishing').length,
    warning:  allScans.filter(s => s.status === 'warning').length,
  };

  return (
    <Sidebar>
      <div className="page-header">
        <h1>Email History</h1>
        <p>Browse and search through all your previous analysis results.</p>
      </div>

      {/* Summary tabs */}
      <div className="filter-tabs">
        {[
          { key: 'all',      label: 'All',      color: 'tab-blue' },
          { key: 'safe',     label: 'Safe',     color: 'tab-green' },
          { key: 'phishing', label: 'Phishing', color: 'tab-red' },
          { key: 'warning',  label: 'Medium',   color: 'tab-yellow' },
        ].map(t => (
          <button
            key={t.key}
            className={`filter-tab ${filter === t.key ? `active ${t.color}` : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
            <span className="tab-count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div className="card animate-in">
        {/* Search bar */}
        <div className="card-header" style={{gap: 12}}>
          <div className="search-wrap">
            <i className="fas fa-search search-icon-f"></i>
            <input
              type="text"
              placeholder="Search by sender email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <span className="result-count">{filtered.length} results</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Sender</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((scan) => (
                <tr key={scan.id}>
                  <td style={{color:'var(--text-muted)', fontWeight:600}}>{scan.id}</td>
                  <td style={{color:'var(--text-muted)'}}>{scan.date}</td>
                  <td>
                    <span className="sender-mono">{scan.sender}</span>
                  </td>
                  <td>
                    <div className="risk-cell">
                      <div className="risk-bg">
                        <div className="risk-fg" style={{
                          width: `${scan.risk}%`,
                          background: riskColor(scan.risk)
                        }}></div>
                      </div>
                      <span style={{color: riskColor(scan.risk), fontWeight:700, fontSize:'0.88rem', minWidth:36}}>
                        {scan.risk}%
                      </span>
                    </div>
                  </td>
                  <td>{statusBadge(scan.status)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/result')}>
                      <i className="fas fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="empty-row">
                    <i className="fas fa-inbox"></i>
                    <p>No results found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-row">
          <span className="page-info">Showing {filtered.length} of {allScans.length} entries</span>
          <div className="page-btns">
            <button className="page-btn">‹ Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">Next ›</button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}