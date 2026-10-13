import React from 'react';
import { Link } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  Palette,
  Calendar,
  Lock,
  Sparkles,
} from 'lucide-react';

const AdminProfile = ({ user, onLogout }) => {
  const { theme } = useTheme();

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="admin" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h2 className="font-heading fw-bold mb-1 text-white">ADMINISTRATOR PROFILE</h2>
              <p className="text-muted small mb-0">System administrator credentials, privilege level, and security configuration</p>
            </div>

            <Link to="/change-password" className="btn btn-lime d-flex align-items-center gap-2">
              <KeyRound size={18} />
              <span>Change Password</span>
            </Link>
          </div>

          <div className="row g-4">
            {/* Main Profile Card */}
            <div className="col-lg-5">
              <div className="gym-card p-4 p-sm-5 text-center">
                <div className="bg-lime text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold display-4 mb-3" style={{ width: '100px', height: '100px' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>

                <h3 className="font-heading fw-bold mb-1 text-white">{user?.name}</h3>
                <div className="text-muted small mb-3">{user?.email}</div>

                <div className="mb-4">
                  <span className="badge badge-lime text-uppercase px-3 py-2 fs-6">
                    <ShieldCheck size={16} className="me-1" />
                    Administrator Privilege
                  </span>
                </div>

                <hr className="border-secondary my-4" />

                <ul className="list-unstyled text-start d-flex flex-column gap-3 small text-muted mb-0">
                  <li className="d-flex align-items-center gap-2">
                    <Mail size={18} className="text-lime" />
                    <span><strong>Email:</strong> {user?.email}</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <Lock size={18} className="text-lime" />
                    <span><strong>Security Role:</strong> {user?.role?.toUpperCase()}</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <Palette size={18} className="text-lime" />
                    <span><strong>Active Theme:</strong> <span className="text-capitalize">{theme}</span></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Privileges & System Status */}
            <div className="col-lg-7">
              <div className="gym-card p-4 p-sm-5 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h4 className="font-heading fw-bold mb-3 text-white d-flex align-items-center gap-2">
                    <ShieldCheck className="text-lime" size={22} />
                    <span>Administrator Permissions & Capabilities</span>
                  </h4>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                        <strong className="text-white d-block mb-1">Member Operations</strong>
                        <small className="text-muted">Full rights to add, edit, delete, and search all gym members.</small>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                        <strong className="text-white d-block mb-1">Attendance Control</strong>
                        <small className="text-muted">Mark manual check-ins and correct attendance dates.</small>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                        <strong className="text-white d-block mb-1">Theme Customization</strong>
                        <small className="text-muted">Switch seamlessly between Purple, Blue, Green, and White themes.</small>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                        <strong className="text-white d-block mb-1">Business Analytics</strong>
                        <small className="text-muted">Access financial metrics, revenue, and attendance reports.</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                  <div className="small text-muted">Need to update system security settings?</div>
                  <Link to="/admin/settings" className="btn btn-sm btn-outline-lime">
                    System Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
