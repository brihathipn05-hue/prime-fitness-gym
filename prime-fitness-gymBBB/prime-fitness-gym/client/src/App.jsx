import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import api from './api/axios';

// Component & Page Imports
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import AdminAttendance from './pages/Attendance';
import AdminMemberships from './pages/AdminMemberships';
import AdminReports from './pages/AdminReports';
import AdminProfile from './pages/AdminProfile';

// Member Dashboard Pages
import UserDashboard from './pages/UserDashboard';
import DashboardHome from './pages/user/DashboardHome';
import Profile from './pages/user/Profile';
import Membership from './pages/user/Membership';
import BMI from './pages/user/BMI';
import Workouts from './pages/user/Workouts';
import Diet from './pages/user/Diet';
import MemberAttendance from './pages/user/Attendance';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Initializing Prime Fitness Gym..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Login setUser={setUser} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register setUser={setUser} />}
      />

      {/* Authenticated Common Routes */}
      <Route element={<ProtectedRoute user={user} loading={loading} />}>
        <Route path="/change-password" element={<ChangePassword user={user} onLogout={handleLogout} />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute user={user} loading={loading} requiredRole="admin" />}>
        <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
        <Route path="/admin/members" element={<Members user={user} onLogout={handleLogout} />} />
        <Route path="/admin/members/:id" element={<MemberDetail user={user} onLogout={handleLogout} />} />
        <Route path="/admin/attendance" element={<AdminAttendance user={user} onLogout={handleLogout} />} />
        <Route path="/admin/memberships" element={<AdminMemberships user={user} onLogout={handleLogout} />} />
        <Route path="/admin/reports" element={<AdminReports user={user} onLogout={handleLogout} />} />
        <Route path="/admin/profile" element={<AdminProfile user={user} onLogout={handleLogout} />} />
        <Route path="/admin/settings" element={<Settings user={user} onLogout={handleLogout} />} />
      </Route>

      {/* Member Protected Routes */}
      <Route element={<ProtectedRoute user={user} loading={loading} requiredRole="member" />}>
        <Route path="/dashboard" element={<UserDashboard user={user} onLogout={handleLogout} />}>
          <Route index element={<DashboardHome user={user} />} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="membership" element={<Membership user={user} />} />
          <Route path="bmi" element={<BMI user={user} />} />
          <Route path="workouts" element={<Workouts user={user} />} />
          <Route path="diet" element={<Diet user={user} />} />
          <Route path="attendance" element={<MemberAttendance user={user} />} />
          <Route path="settings" element={<Settings user={user} onLogout={handleLogout} />} />
        </Route>
      </Route>

      {/* 404 Catch-All Page */}
      <Route
        path="*"
        element={
          <div className="min-vh-100 bg-dark-custom text-white d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <h1 className="display-1 font-heading fw-extrabold text-lime mb-0">404</h1>
            <h3 className="font-heading fw-bold mb-3">Page Not Found</h3>
            <p className="text-muted mb-4">The page you requested does not exist or has been moved.</p>
            <button onClick={() => navigate('/')} className="btn btn-lime font-heading fw-bold px-4 py-2">
              Return to Homepage
            </button>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
