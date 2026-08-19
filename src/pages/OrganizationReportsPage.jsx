import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './ReportsPage.css';

const monthlyData = [
  { month: 'January', total: 1120, safe: 980, phishing: 140, accuracy: 95 },
  { month: 'February', total: 1185, safe: 1030, phishing: 155, accuracy: 96 },
  { month: 'March', total: 1250, safe: 1085, phishing: 165, accuracy: 96 },
];

const generatedReports = [
  { date: '08 Aug 2026', name: 'Weekly Organization Security Report', status: 'ready' },
  { date: '01 Aug 2026', name: 'Monthly Organization Email Report', status: 'ready' },
  { date: '25 Jul 2026', name: 'Organization Threat Analysis Report', status: 'pending' },
];

export default function OrganizationReportsPage() {
  const navigate = useNavigate();
  return (
    <Sidebar role="organization">
      <div className="page-header">
        <h1>Organization Security Reports</h1>
        <p>View, generate, and download organization-wide email security reports.</p>
      </div>
      <div className="stat-grid">
        <div className="stat-card animate-in"><div className="stat-icon blue"><i className="fas fa-envelope"></i></div><div className="stat-info"><h3>1,250</h3><p>Total Emails</p></div></div>
        <div className="stat-card animate-in"><div className="stat-icon green"><i className="fas fa-check-circle"></i></div><div className="stat-info"><h3>1,085</h3><p>Safe Emails</p></div></div>
        <div className="stat-card animate-in"><div className="stat-icon red"><i className="fas fa-shield-virus"></i></div><div className="stat-info"><h3>165</h3><p>Phishing Emails</p></div></div>
        <div className="stat-card animate-in"><div className="stat-icon yellow"><i className="fas fa-percentage"></i></div><div className="stat-info"><h3>96%</h3><p>Avg. Accuracy</p></div></div>
      </div>
      <div className="card animate-in">
        <div className="card-header"><h3><i className="fas fa-calendar-alt" style={{marginRight:8,color:'var(--primary)'}}></i>Monthly Organization Security Report</h3></div>
        <div className="table-wrap"><table><thead><tr><th>Month</th><th>Total</th><th>Safe</th><th>Phishing</th><th>Safe Rate</th><th>Accuracy</th></tr></thead>
          <tbody>{monthlyData.map((row,i)=><tr key={i}><td><strong>{row.month}</strong></td><td>{row.total.toLocaleString()}</td><td style={{color:'var(--success)',fontWeight:600}}>{row.safe.toLocaleString()}</td><td style={{color:'var(--danger)',fontWeight:600}}>{row.phishing}</td><td><div className="mini-bar-wrap"><div className="mini-bar success-bar" style={{width:`${(row.safe/row.total*100).toFixed(0)}%`}}></div><span>{(row.safe/row.total*100).toFixed(1)}%</span></div></td><td><span className="badge badge-safe">{row.accuracy}%</span></td></tr>)}</tbody>
        </table></div>
      </div>
      <div className="reports-bottom animate-in" style={{animationDelay:'0.15s'}}>
        <div className="card"><div className="card-header"><h3><i className="fas fa-download" style={{marginRight:8,color:'var(--success)'}}></i>Export Options</h3></div><div className="card-body export-buttons">
          <button className="btn export-btn export-pdf"><i className="fas fa-file-pdf"></i> Download PDF</button><button className="btn export-btn export-csv"><i className="fas fa-file-csv"></i> Export CSV</button><button className="btn export-btn export-print" onClick={()=>window.print()}><i className="fas fa-print"></i> Print Report</button>
        </div></div>
        <div className="card"><div className="card-header"><h3><i className="fas fa-file-alt" style={{marginRight:8,color:'var(--text-muted)'}}></i>Recent Organization Reports</h3></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Report Name</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {generatedReports.map((r,i)=><tr key={i}><td style={{color:'var(--text-muted)',fontSize:'0.83rem'}}>{r.date}</td><td><strong>{r.name}</strong></td><td>{r.status==='ready'?<span className="badge badge-safe">Ready</span>:<span className="badge badge-warning">Pending</span>}</td><td>{r.status==='ready'?<button className="btn btn-primary btn-sm"><i className="fas fa-eye"></i> View</button>:<button className="btn btn-outline btn-sm" disabled><i className="fas fa-spinner fa-spin"></i> Processing</button>}</td></tr>)}
        </tbody></table></div></div>
      </div>
      <div style={{textAlign:'center',marginTop:8}}><button className="btn btn-outline" onClick={()=>navigate('/admin')}><i className="fas fa-building"></i> Back to Organization Dashboard</button></div>
    </Sidebar>
  );
}
