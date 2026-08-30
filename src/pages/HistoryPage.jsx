import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './HistoryPage.css';
 
export default function HistoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('phishshield_token');
        const response = await fetch('http://127.0.0.1:5000/api/scans/history', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
 
        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setLoading(false);
          return;
        }
 
        const data = await response.json();
 
        if (!response.ok) {
          setError(data.error || 'Could not load scan history.');
          setLoading(false);
          return;
        }
 
        // Newest-first order already comes from the backend - map straight through.
        const mapped = data.scans.map((scan) => ({
          id: scan.id,
          date: new Date(scan.timestamp).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
          }),
          sender: scan.analysis_result?.sender || 'Unknown',
          risk: scan.risk_score,
          status: scan.verdict, // 'safe' | 'phishing' - backend only returns these two
          result: scan.analysis_result, // full payload, passed to ResultPage on "View"
        }));
 
        setScans(mapped);
      } catch (err) {
        setError('Could not connect to server. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
 
    fetchHistory();
  }, []);
 
  const filtered = scans.filter(s => {
    const matchSearch = s.sender.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });
 
  const riskColor = (r) => r >= 70 ? '#e02424' : r >= 40 ? '#c27803' : '#057a55';
 
  const statusBadge = (status) => {
    const map = {
      safe:     ['badge-safe',   'Safe'],
      phishing: ['badge-danger', 'Phishing'],
    };
    const [cls, label] = map[status] || ['badge-warning', status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };
 
  const counts = {
    all:      scans.length,
    safe:     scans.filter(s => s.status === 'safe').length,
    phishing: scans.filter(s => s.status === 'phishing').length,
  };
 
  return (
    <Sidebar>
      <div className="page-header">
        <h1>Email History</h1>
        <p>Browse and search through all your previous analysis results.</p>
      </div>
 
      {/* Summary tabs - "Medium" tier removed: the backend's rule-based
          verdict is binary (safe/phishing), it doesn't produce a third state. */}
      <div className="filter-tabs">
        {[
          { key: 'all',      label: 'All',      color: 'tab-blue' },
          { key: 'safe',     label: 'Safe',     color: 'tab-green' },
          { key: 'phishing', label: 'Phishing', color: 'tab-red' },
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading scan history...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((scan, idx) => (
                <tr key={scan.id}>
                  <td style={{color:'var(--text-muted)', fontWeight:600}}>{idx + 1}</td>
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
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate('/result', { state: scan.result })}
                    >
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
 
        <div className="pagination-row">
          <span className="page-info">Showing {filtered.length} of {scans.length} entries</span>
        </div>
      </div>
    </Sidebar>
  );
}
 
