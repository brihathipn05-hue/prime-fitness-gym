import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from './Loading';

const ProtectedRoute = ({ user, loading, requiredRole }) => {
  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect admin to /admin, member to /dashboard if role mismatch
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
