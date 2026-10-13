import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidenav from '../components/Sidenav';

const UserDashboard = ({ user, onLogout }) => {
  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="member" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
