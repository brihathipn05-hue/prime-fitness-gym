import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, User, LogOut, LayoutDashboard, KeyRound, Palette } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top px-3 px-lg-5 py-3">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 font-heading fs-3 fw-bold text-white" to="/">
          <div className="bg-lime p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <Dumbbell size={24} className="text-dark" />
          </div>
          <span>PRIME<span className="text-lime">FITNESS</span></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-3">
            <li className="nav-item">
              <Link className={`nav-link text-white fw-semibold ${location.pathname === '/' ? 'text-lime' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="#services">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="#plans">
                Membership Plans
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="#trainers">
                Trainers
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="#about">
                About Us
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark-card dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={18} className="text-lime" />
                  <span>{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-card-custom border-secondary text-white mt-2 p-2 shadow-lg" aria-labelledby="userDropdown">
                  <li>
                    <Link
                      className="dropdown-item text-white rounded-2 d-flex align-items-center gap-2 py-2"
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    >
                      <LayoutDashboard size={16} className="text-lime" />
                      {user.role === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-white rounded-2 d-flex align-items-center gap-2 py-2"
                      to={user.role === 'admin' ? '/admin/settings' : '/dashboard/settings'}
                    >
                      <Palette size={16} className="text-lime" />
                      Theme Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white rounded-2 d-flex align-items-center gap-2 py-2" to="/change-password">
                      <KeyRound size={16} className="text-lime" />
                      Change Password
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider bg-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger rounded-2 d-flex align-items-center gap-2 py-2"
                      onClick={onLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-lime px-4">
                  Login
                </Link>
                <Link to="/register" className="btn btn-lime px-4">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
