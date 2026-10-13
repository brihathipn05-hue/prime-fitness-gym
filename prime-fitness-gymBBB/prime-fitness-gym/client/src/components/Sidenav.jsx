import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  User,
  CreditCard,
  Calculator,
  Dumbbell,
  Utensils,
  KeyRound,
  LogOut,
  Palette,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
} from 'lucide-react';

const Sidenav = ({ role, user, onLogout }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/members', label: 'Members', icon: Users },
    { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/admin/memberships', label: 'Memberships', icon: CreditCard },
    { to: '/admin/reports', label: 'Reports / Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
    { to: '/admin/profile', label: 'Profile', icon: User },
  ];

  const memberLinks = [
    { to: '/dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    { to: '/dashboard/profile', label: 'My Profile', icon: User },
    { to: '/dashboard/membership', label: 'Membership Plan', icon: CreditCard },
    { to: '/dashboard/bmi', label: 'BMI Calculator', icon: Calculator },
    { to: '/dashboard/workouts', label: 'Workout Plans', icon: Dumbbell },
    { to: '/dashboard/diet', label: 'Diet Plans', icon: Utensils },
    { to: '/dashboard/attendance', label: 'My Attendance', icon: CalendarCheck },
    { to: '/dashboard/settings', label: 'Theme & Settings', icon: Palette },
  ];

  const links = role === 'admin' ? adminLinks : memberLinks;

  const toggleMobileNav = () => setIsOpenMobile(!isOpenMobile);
  const closeMobileNav = () => setIsOpenMobile(false);

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="d-md-none bg-card-custom border-bottom border-secondary p-3 d-flex align-items-center justify-content-between sticky-top z-3">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-lime p-2 rounded-3">
            <Dumbbell size={20} className="text-dark" />
          </div>
          <div>
            <span className="font-heading fw-bold fs-5 text-white lh-1">
              PRIME<span className="text-lime">FITNESS</span>
            </span>
            <span className="badge badge-lime text-uppercase ms-2" style={{ fontSize: '0.6rem' }}>
              {role === 'admin' ? 'Admin' : 'Member'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleMobileNav}
          className="btn btn-dark-card p-2 rounded-3 border-secondary"
          aria-label="Toggle Navigation Menu"
        >
          {isOpenMobile ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Main Sidebar Navigation Container */}
      <aside
        className={`bg-card-custom border-end border-secondary p-3 d-flex flex-column h-100 min-vh-100 ${
          isOpenMobile ? 'd-flex position-fixed top-0 start-0 w-100 h-100 z-3' : 'd-none d-md-flex'
        }`}
        style={{ transition: 'all 0.3s ease' }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 px-2 pb-3 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-lime p-2 rounded-3">
              <Dumbbell size={20} className="text-dark" />
            </div>
            <div>
              <span className="font-heading fw-bold fs-5 text-white d-block lh-1">
                PRIME<span className="text-lime">FITNESS</span>
              </span>
              <span className="badge badge-lime text-uppercase mt-1" style={{ fontSize: '0.65rem' }}>
                {role === 'admin' ? 'Administrator' : 'Member Portal'}
              </span>
            </div>
          </div>

          <button
            onClick={closeMobileNav}
            className="d-md-none btn btn-sm text-muted"
            aria-label="Close Mobile Nav"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Quick Info Card */}
        <div className="bg-dark-custom p-3 rounded-3 mb-4 border border-secondary d-flex align-items-center gap-3">
          <div
            className="bg-lime text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
            style={{ width: '40px', height: '40px' }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h6 className="mb-0 fw-bold text-white text-truncate">{user?.name || 'User'}</h6>
            <small className="text-muted text-truncate d-block">{user?.email}</small>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow-1 overflow-auto">
          <div
            className="text-uppercase text-muted fw-bold px-2 mb-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}
          >
            Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/dashboard'}
                onClick={closeMobileNav}
                className={({ isActive }) => `sidenav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Footer Actions */}
        <div className="pt-3 border-top border-secondary mt-auto">
          <NavLink
            to="/change-password"
            onClick={closeMobileNav}
            className="sidenav-link mb-2 text-muted"
          >
            <KeyRound size={18} />
            <span>Change Password</span>
          </NavLink>
          <button
            onClick={() => {
              closeMobileNav();
              onLogout();
            }}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 font-heading"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidenav;
