import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import HopPage from './pages/HopPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import RecentAnalysisPage from './pages/RecentAnalysisPage';
import PhishingAlertsPage from './pages/PhishingAlertsPage';
import QuarantinePage from './pages/QuarantinePage';
import OrganizationReportsPage from './pages/OrganizationReportsPage';

function ProtectedRoute({ children, role }) {
  const currentRole = localStorage.getItem('phishshield_role');
  if (!currentRole) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) {
    return <Navigate to={currentRole === 'organization' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<ProtectedRoute role="individual"><DashboardPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute role="individual"><UploadPage /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute role="individual"><ResultPage /></ProtectedRoute>} />
        <Route path="/hop/:scanId" element={<ProtectedRoute role="individual"><HopPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute role="individual"><HistoryPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute role="individual"><ReportsPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute role="organization"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/analysis" element={<ProtectedRoute role="organization"><RecentAnalysisPage /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute role="organization"><PhishingAlertsPage /></ProtectedRoute>} />
        <Route path="/admin/quarantine" element={<ProtectedRoute role="organization"><QuarantinePage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="organization"><OrganizationReportsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
