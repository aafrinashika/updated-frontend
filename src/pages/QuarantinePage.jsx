import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './AdminDashboardPage.css';

const initialQuarantine = [
  { id: 'Q001', sender: 'support@paypal-login.xyz', reason: 'DMARC Failed', status: 'quarantined' },
  { id: 'Q002', sender: 'security@microsoft-login.xyz', reason: 'SPF Failed', status: 'pending' },
  { id: 'Q003', sender: 'bank@secure-bank.info', reason: 'High Risk Score', status: 'quarantined' },
];

export default function QuarantinePage() {
  const [items, setItems] = useState(initialQuarantine);
  const release = id => setItems(prev => prev.filter(item => item.id !== id));
  const remove = id => setItems(prev => prev.filter(item => item.id !== id));

  return (
    <Sidebar role="organization">
      <div className="page-header">
        <h1>Quarantine</h1>
        <p>Review and manage emails isolated by organization security rules.</p>
      </div>
      <div className="card animate-in">
        <div className="card-header"><h3><i className="fas fa-lock" style={{color:'var(--text-muted)',marginRight:8}}></i>Quarantined Emails</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Sender</th><th>Reason</th><th>Action</th></tr></thead>
            <tbody>{items.length ? items.map(q=><tr key={q.id}>
              <td><strong>{q.id}</strong></td>
              <td><span className="mono-sm">{q.sender}</span></td>
              <td style={{color:'var(--text-muted)',fontSize:'0.82rem'}}>{q.reason}</td>
              <td><div style={{display:'flex',gap:4}}><button className="btn btn-success btn-sm" onClick={()=>release(q.id)}>Release</button><button className="btn btn-danger btn-sm" onClick={()=>remove(q.id)}>Delete</button></div></td>
            </tr>) : <tr><td colSpan="4" style={{textAlign:'center',color:'var(--text-muted)'}}>No quarantined emails.</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}
