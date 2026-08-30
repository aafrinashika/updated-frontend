import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './ReportsPage.css';

// Static placeholder content below - the backend has no endpoints yet for
// PDF/CSV export or generated report history, so these stay as visual/mock
// sections until that's built. Everything else on this page (stat cards,
// Overall Summary, Monthly Security Report) is wired to real data.
const generatedReports = [
  { date: '08 Aug 2026', name: 'Weekly Security Report',  status: 'ready' },
  { date: '01 Aug 2026', name: 'Monthly Email Report',    status: 'ready' },
  { date: '25 Jul 2026', name: 'Threat Analysis Report',  status: 'pending' },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('phishshield_token');

      try {
        const [reportRes, monthlyRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/scans/reports', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5000/api/scans/reports/monthly', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (reportRes.status === 401 || monthlyRes.status === 401) {
          setError('Your session has expired. Please log in again.');
          setLoading(false);
          return;
        }

        const reportData = await reportRes.json();
        const monthlyData = await monthlyRes.json();

        if (!reportRes.ok) {
          setError(reportData.error || 'Could not load report data.');
          setLoading(false);
          return;
        }
        if (!monthlyRes.ok) {
          setError(monthlyData.error || 'Could not load monthly report data.');
          setLoading(false);
          return;
        }

        setReport(reportData);
        setMonths(monthlyData.months);
      } catch (err) {
        setError('Could not connect to server. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const safeRate = report && report.totalScans > 0
    ? ((report.safeScans / report.totalScans) * 100).toFixed(1)
    : '0.0';

  // Builds a CSV from the same data already on screen (report + months) and
  // triggers a browser download. No backend call - runs entirely client-side.
  const handleExportCSV = () => {
    if (!report) return;

    const rows = [];
    rows.push(['PhishShield AI - Security Report']);
    rows.push([`Generated: ${new Date().toLocaleString()}`]);
    rows.push([]);

    rows.push(['Overall Summary']);
    rows.push(['Total Scans', 'Safe Scans', 'Phishing Scans', 'Safe Rate (%)', 'Phishing Rate (%)', 'Avg. Risk Score']);
    rows.push([report.totalScans, report.safeScans, report.phishingScans, safeRate, report.riskPercentage, report.averageRiskScore]);
    rows.push([]);

    rows.push(['Monthly Breakdown']);
    rows.push(['Month', 'Total', 'Safe', 'Phishing', 'Safe Rate (%)', 'Avg. Risk Score']);
    if (months.length > 0) {
      months.forEach(m => {
        rows.push([`${m.month} ${m.year}`, m.totalScans, m.safeScans, m.phishingScans, m.safeRate, m.averageRiskScore]);
      });
    } else {
      rows.push(['No monthly data yet']);
    }

    // Wrap every cell in quotes and escape any embedded quotes, so commas
    // or quote characters inside a value can't break the CSV structure.
    const csvContent = rows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishshield-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Sidebar>
      {/* PRINT VIEW - only this block is visible when printing (see @media print
          rules in ReportsPage.css). Plain layout, no colors/icons/badges. */}
      {report && (
        <div className="print-only">
          <h1>PHISHSHIELD AI</h1>
          <h2>Security Report</h2>
          <p className="print-generated">
            Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <h3>Overall Summary</h3>
          <hr />
          <table className="print-table">
            <tbody>
              <tr><td>Total Scans</td><td>{report.totalScans}</td></tr>
              <tr><td>Safe Scans</td><td>{report.safeScans}</td></tr>
              <tr><td>Phishing Scans</td><td>{report.phishingScans}</td></tr>
              <tr><td>Safe Rate</td><td>{safeRate}%</td></tr>
              <tr><td>Phishing Rate</td><td>{report.riskPercentage}%</td></tr>
              <tr><td>Avg Risk Score</td><td>{report.averageRiskScore}</td></tr>
            </tbody>
          </table>

          <h3>Monthly Security Report</h3>
          <hr />
          <table className="print-table print-monthly">
            <thead>
              <tr>
                <th>Month</th><th>Total</th><th>Safe</th><th>Phishing</th><th>Safe Rate</th><th>Avg Risk</th>
              </tr>
            </thead>
            <tbody>
              {months.length > 0 ? months.map((m, i) => (
                <tr key={i}>
                  <td>{m.month} {m.year}</td>
                  <td>{m.totalScans}</td>
                  <td>{m.safeScans}</td>
                  <td>{m.phishingScans}</td>
                  <td>{m.safeRate}%</td>
                  <td>{m.averageRiskScore}</td>
                </tr>
              )) : (
                <tr><td colSpan={6}>No monthly data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN VIEW - hidden entirely when printing */}
      <div className="screen-only">
      <div className="page-header">
        <h1>Security Reports</h1>
        <p>View comprehensive email security statistics from your scan history.</p>
      </div>

      {loading ? (
        <div className="card animate-in">
          <div className="card-body empty-state" style={{textAlign:'center', padding:48}}>
            <i className="fas fa-spinner fa-spin" style={{fontSize:'1.6rem', marginBottom:8}}></i>
            <p>Loading report data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card animate-in">
          <div className="card-body empty-state" style={{textAlign:'center', padding:48, color:'var(--danger)'}}>
            <i className="fas fa-exclamation-triangle" style={{fontSize:'1.6rem', marginBottom:8}}></i>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards - real totals from GET /api/scans/reports */}
          <div className="stat-grid">
            <div className="stat-card animate-in">
              <div className="stat-icon blue"><i className="fas fa-envelope"></i></div>
              <div className="stat-info"><h3>{report.totalScans.toLocaleString()}</h3><p>Total Scans</p></div>
            </div>
            <div className="stat-card animate-in" style={{animationDelay:'0.05s'}}>
              <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
              <div className="stat-info"><h3>{report.safeScans.toLocaleString()}</h3><p>Safe Emails</p></div>
            </div>
            <div className="stat-card animate-in" style={{animationDelay:'0.1s'}}>
              <div className="stat-icon red"><i className="fas fa-shield-virus"></i></div>
              <div className="stat-info"><h3>{report.phishingScans.toLocaleString()}</h3><p>Phishing Emails</p></div>
            </div>
            <div className="stat-card animate-in" style={{animationDelay:'0.15s'}}>
              <div className="stat-icon yellow"><i className="fas fa-percentage"></i></div>
              <div className="stat-info"><h3>{report.averageRiskScore}</h3><p>Avg. Risk Score</p></div>
            </div>
          </div>

          {/* Overall summary - the backend returns aggregate totals only
              (no per-month breakdown), so this replaces the old fake
              monthly table with a single real "Overall" row. */}
          <div className="card animate-in">
            <div className="card-header">
              <h3><i className="fas fa-chart-pie" style={{marginRight:8,color:'var(--primary)'}}></i>Overall Summary</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Total</th>
                    <th>Safe</th>
                    <th>Phishing</th>
                    <th>Safe Rate</th>
                    <th>Phishing Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>All time</strong></td>
                    <td>{report.totalScans.toLocaleString()}</td>
                    <td style={{color:'var(--success)', fontWeight:600}}>{report.safeScans.toLocaleString()}</td>
                    <td style={{color:'var(--danger)', fontWeight:600}}>{report.phishingScans.toLocaleString()}</td>
                    <td>
                      <div className="mini-bar-wrap">
                        <div className="mini-bar success-bar" style={{width: `${safeRate}%`}}></div>
                        <span>{safeRate}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-danger">{report.riskPercentage}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Security Report - real data from GET /api/scans/reports/monthly */}
          <div className="card animate-in">
            <div className="card-header">
              <h3><i className="fas fa-calendar-alt" style={{marginRight:8,color:'var(--primary)'}}></i>Monthly Security Report</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total</th>
                    <th>Safe</th>
                    <th>Phishing</th>
                    <th>Safe Rate</th>
                    <th>Avg. Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {months.length > 0 ? months.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.month} {row.year}</strong></td>
                      <td>{row.totalScans.toLocaleString()}</td>
                      <td style={{color:'var(--success)', fontWeight:600}}>{row.safeScans.toLocaleString()}</td>
                      <td style={{color:'var(--danger)', fontWeight:600}}>{row.phishingScans}</td>
                      <td>
                        <div className="mini-bar-wrap">
                          <div className="mini-bar success-bar" style={{width: `${row.safeRate}%`}}></div>
                          <span>{row.safeRate}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-safe">{row.averageRiskScore}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} style={{textAlign:'center', padding:24, color:'var(--text-muted)'}}>
                        No scans yet - run some analyses to see monthly trends.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download + Generated - static, no backend support yet */}
          <div className="reports-bottom animate-in" style={{animationDelay:'0.15s'}}>
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-download" style={{marginRight:8,color:'var(--success)'}}></i>Export Options</h3>
              </div>
              <div className="card-body export-buttons">
                <button className="btn export-btn export-pdf" disabled title="Not built yet">
                  <i className="fas fa-file-pdf"></i> Download PDF
                </button>
                <button className="btn export-btn export-csv" onClick={handleExportCSV}>
                  <i className="fas fa-file-csv"></i> Export CSV
                </button>
                <button className="btn export-btn export-print" onClick={() => window.print()}>
                  <i className="fas fa-print"></i> Print Report
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-file-alt" style={{marginRight:8,color:'var(--text-muted)'}}></i>Recent Reports</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Date</th><th>Report Name</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {generatedReports.map((r, i) => (
                      <tr key={i}>
                        <td style={{color:'var(--text-muted)',fontSize:'0.83rem'}}>{r.date}</td>
                        <td><strong>{r.name}</strong></td>
                        <td>
                          {r.status === 'ready'
                            ? <span className="badge badge-safe">Ready</span>
                            : <span className="badge badge-warning">Pending</span>
                          }
                        </td>
                        <td>
                          {r.status === 'ready'
                            ? <button className="btn btn-primary btn-sm"><i className="fas fa-eye"></i> View</button>
                            : <button className="btn btn-outline btn-sm" disabled><i className="fas fa-spinner fa-spin"></i> Processing</button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      </div>

      <div className="screen-only" style={{textAlign:'center', marginTop:8}}>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-home"></i> Back to Dashboard
        </button>
      </div>
    </Sidebar>
  );
}