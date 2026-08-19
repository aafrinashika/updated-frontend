import React from 'react';
import Sidebar from '../components/Sidebar';
import './AdminDashboardPage.css';

const phishingAlerts = [
  { email: 'security-update@paypal-login.xyz', risk: 98 },
  { email: 'verify-account@bank-secure.net', risk: 95 },
  { email: 'amazon-support@amazon-login.xyz', risk: 82 },
  { email: 'office365@secure-login.info', risk: 90 },
];

export default function PhishingAlertsPage() {
  return (
    <Sidebar role="organization">
      <div className="page-header">
        <h1>Phishing Alerts</h1>
        <p>Monitor suspicious emails detected across the organization.</p>
      </div>
      <div className="card animate-in">
        <div className="card-header"><h3><i className="fas fa-exclamation-triangle" style={{color:'var(--danger)',marginRight:8}}></i>Recent Phishing Alerts</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Email</th><th>Risk</th></tr></thead>
            <tbody>{phishingAlerts.map((a,i)=><tr key={i}>
              <td><span className="mono-sm">{a.email}</span></td>
              <td><span className={`badge ${a.risk>=90?'badge-danger':'badge-warning'}`}>{a.risk}%</span></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}
