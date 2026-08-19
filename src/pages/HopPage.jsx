import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './HopPage.css';

const hops = [
  {
    icon: 'https://img.icons8.com/color/96/gmail-new.png',
    label: 'Sender',
    value: 'abc@gmail.com',
    status: 'safe',
    detail: 'Origin point',
  },
  {
    icon: 'https://img.icons8.com/color/96/server.png',
    label: 'SMTP Server',
    value: 'smtp.gmail.com',
    status: 'safe',
    detail: 'Authorized sender',
  },
  {
    icon: 'https://img.icons8.com/color/96/cloud.png',
    label: 'Relay Server',
    value: 'mail.relay.net',
    status: 'warning',
    detail: 'Third-party relay',
  },
  {
    icon: 'https://img.icons8.com/color/96/hacker.png',
    label: 'Suspicious Server',
    value: 'unknown.host.xyz',
    status: 'danger',
    detail: '⚠ Unverified host',
  },
  {
    icon: 'https://img.icons8.com/color/96/laptop.png',
    label: 'Recipient',
    value: 'deepika@company.com',
    status: 'safe',
    detail: 'Delivered',
  },
];

const hopTable = [
  { hop: 1, server: 'smtp.gmail.com',        delay: '0ms',   status: 'safe' },
  { hop: 2, server: 'mail.relay.net',         delay: '120ms', status: 'warning' },
  { hop: 3, server: 'unknown.host.xyz',       delay: '840ms', status: 'danger' },
  { hop: 4, server: 'Recipient Mail Server',  delay: '55ms',  status: 'safe' },
];

const statusMap = {
  safe:    { cls: 'badge-safe',    label: 'Safe' },
  warning: { cls: 'badge-warning', label: 'Suspicious' },
  danger:  { cls: 'badge-danger',  label: 'Malicious' },
};

export default function HopPage() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <div className="page-header">
        <h1>Email Hop Visualization</h1>
        <p>Visual representation of the email transmission path from sender to recipient.</p>
      </div>

      {/* Hop Path */}
      <div className="card animate-in">
        <div className="card-header">
          <h3><i className="fas fa-route" style={{marginRight:8,color:'var(--primary)'}}></i>Email Route</h3>
          <span className="badge badge-danger">Suspicious Path Detected</span>
        </div>
        <div className="card-body">
          <div className="hop-path">
            {hops.map((hop, i) => (
              <React.Fragment key={i}>
                <div className={`hop-node hop-${hop.status} animate-in`} style={{animationDelay:`${i*0.1}s`}}>
                  <div className={`hop-status-bar hop-bar-${hop.status}`}></div>
                  <img src={hop.icon} alt={hop.label} className="hop-img" />
                  <div className="hop-label">{hop.label}</div>
                  <div className="hop-value">{hop.value}</div>
                  <div className="hop-detail">{hop.detail}</div>
                </div>
                {i < hops.length - 1 && (
                  <div className={`hop-arrow ${hops[i+1].status === 'danger' ? 'arrow-danger' : ''}`}>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Auth + Table */}
      <div className="hop-bottom animate-in" style={{animationDelay:'0.3s'}}>
        <div className="card">
          <div className="card-header"><h3>Route Details</h3></div>
          <div className="card-body">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Hop</th>
                    <th>Server</th>
                    <th>Delay</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hopTable.map((row, i) => (
                    <tr key={i}>
                      <td><strong>#{row.hop}</strong></td>
                      <td><span className="mono">{row.server}</span></td>
                      <td style={{color:'var(--text-muted)'}}>{row.delay}</td>
                      <td>
                        <span className={`badge ${statusMap[row.status].cls}`}>
                          {statusMap[row.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-item auth-pass">
            <i className="fas fa-check-circle ai-icon"></i>
            <div>
              <strong>SPF</strong>
              <span>PASS</span>
            </div>
          </div>
          <div className="auth-item auth-warn">
            <i className="fas fa-exclamation-circle ai-icon"></i>
            <div>
              <strong>DKIM</strong>
              <span>PASS (weak)</span>
            </div>
          </div>
          <div className="auth-item auth-fail">
            <i className="fas fa-times-circle ai-icon"></i>
            <div>
              <strong>DMARC</strong>
              <span>FAIL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hop-actions animate-in">
        <button className="btn btn-primary" onClick={() => navigate('/history')}>
          <i className="fas fa-history"></i> View History
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/result')}>
          <i className="fas fa-arrow-left"></i> Back to Result
        </button>
      </div>
    </Sidebar>
  );
}