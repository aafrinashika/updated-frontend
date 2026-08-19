import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'individual' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const selectedRole = form.role === 'admin' ? 'organization' : 'individual';
      localStorage.setItem('phishshield_role', selectedRole);
      if (selectedRole === 'organization') navigate('/admin');
      else navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">🛡️ PhishShield AI</div>
        <h2>Welcome back</h2>
        <p>Protecting your inbox with AI-powered precision</p>
        <div className="auth-features">
          <div className="af-item"><i className="fas fa-check-circle"></i> ML-powered detection</div>
          <div className="af-item"><i className="fas fa-check-circle"></i> SPF / DKIM / DMARC checks</div>
          <div className="af-item"><i className="fas fa-check-circle"></i> Real-time hop visualization</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card animate-in">
          <div className="auth-card-header">
            <h1>Sign In</h1>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label>Email Address</label>
              <div className="field-input-wrap">
                <i className="fas fa-envelope field-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className="field-input-wrap">
                <i className="fas fa-lock field-icon"></i>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  <i className={`fas fa-eye${showPw ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <div className="field-group">
              <label>Continue As</label>
              <div className="role-choice-grid">
                <button
                  type="button"
                  className={`role-choice ${form.role === 'individual' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: 'individual' })}
                >
                  <i className="fas fa-user"></i>
                  <span>Individual User</span>
                  <small>Personal email security</small>
                </button>
                <button
                  type="button"
                  className={`role-choice ${form.role === 'admin' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: 'admin' })}
                >
                  <i className="fas fa-building"></i>
                  <span>Organization User</span>
                  <small>Organization security monitoring</small>
                </button>
              </div>
            </div>

            <button type="submit" className={`auth-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Sign In</>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}