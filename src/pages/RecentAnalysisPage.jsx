import React from 'react';
import Sidebar from '../components/Sidebar';
import './AdminDashboardPage.css';

const recentEmails = [
  { date: '08 Aug 2026', sender: 'security@paypal-login.xyz', status: 'phishing', risk: 96 },
  { date: '08 Aug 2026', sender: 'support@gmail.com', status: 'safe', risk: 8 },
  { date: '07 Aug 2026', sender: 'admin@amazon.in', status: 'warning', risk: 48 },
  { date: '07 Aug 2026', sender: 'bank@canarabank.com', status: 'safe', risk: 5 },
];

export default function RecentAnalysisPage() {
  const statusBadge = (status) => {
    if (status === 'phishing') return <span className="badge badge-danger">Phishing</span>;
    if (status === 'safe') return <span className="badge badge-safe">Safe</span>;
    return <span className="badge badge-warning">Medium</span>;
  };

  return (
    <Sidebar role="organization">
      <div className="page-header">
        <h1>Recent Analysis</h1>
        <p>Review recent organization-wide email analysis results.</p>
      </div>
      <div className="card animate-in">
        <div className="card-header"><h3>Recent Email Analysis</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Sender</th><th>Status</th><th>Risk</th></tr></thead>
            <tbody>{recentEmails.map((r,i)=><tr key={i}>
              <td style={{color:'var(--text-muted)',fontSize:'0.83rem'}}>{r.date}</td>
              <td><span className="mono-sm">{r.sender}</span></td>
              <td>{statusBadge(r.status)}</td>
              <td style={{fontWeight:700,color:r.risk>=70?'var(--danger)':r.risk>=40?'var(--warning)':'var(--success)'}}>{r.risk}%</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}
