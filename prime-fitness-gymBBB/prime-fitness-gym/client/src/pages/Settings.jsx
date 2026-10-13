import React from 'react';
import Sidenav from '../components/Sidenav';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Palette, Check, Sparkles, Sun, Moon, Shield, User } from 'lucide-react';

const Settings = ({ user, onLogout }) => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      id: THEMES.GREEN,
      name: 'Green Theme',
      tagline: 'Fresh & energetic fitness appearance',
      accentColor: '#84cc16',
      bgColor: '#0a0a0c',
      cardColor: '#121318',
      textColor: '#f8fafc',
    },
    {
      id: THEMES.PURPLE,
      name: 'Purple Theme',
      tagline: 'Modern premium gym appearance',
      accentColor: '#a855f7',
      bgColor: '#0f0c1b',
      cardColor: '#19152b',
      textColor: '#f8fafc',
    },
    {
      id: THEMES.WHITE,
      name: 'White / Light Theme',
      tagline: 'Clean, crisp light appearance',
      accentColor: '#16a34a',
      bgColor: '#f1f5f9',
      cardColor: '#ffffff',
      textColor: '#0f172a',
    },
    {
      id: THEMES.BLUE,
      name: 'Blue Theme',
      tagline: 'Professional athletic blue appearance',
      accentColor: '#3b82f6',
      bgColor: '#0b1329',
      cardColor: '#121e3d',
      textColor: '#f8fafc',
    },
  ];

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role={user?.role} user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h2 className="font-heading fw-bold mb-1 text-white">APPLICATION SETTINGS</h2>
              <p className="text-muted small mb-0">Customize your visual interface theme and preferences</p>
            </div>
            <div>
              <span className="badge badge-lime text-uppercase px-3 py-2 fs-6">
                Active Theme: <span className="text-capitalize fw-bold">{theme}</span>
              </span>
            </div>
          </div>

          {/* Theme Selector Section */}
          <div className="gym-card p-4 mb-4">
            <h4 className="font-heading fw-bold mb-2 d-flex align-items-center gap-2">
              <Palette className="text-lime" size={22} />
              <span>Multiple Selectable UI Themes</span>
            </h4>
            <p className="text-muted small mb-4">
              Choose a theme to transform the entire application appearance including navigation, buttons, cards, table headers, and status badges. Your selection is automatically saved in your browser.
            </p>

            <div className="row g-4">
              {themeOptions.map((opt) => {
                const isSelected = theme === opt.id;
                return (
                  <div key={opt.id} className="col-md-6 col-xl-3">
                    <div
                      onClick={() => setTheme(opt.id)}
                      className={`gym-card p-4 h-100 position-relative cursor-pointer transition-all ${
                        isSelected ? 'border-lime shadow-lg' : ''
                      }`}
                      style={{
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.02)' : 'none',
                        borderWidth: isSelected ? '2px' : '1px',
                      }}
                    >
                      {/* Selection Check Badge */}
                      {isSelected && (
                        <div
                          className="position-absolute top-0 end-0 m-3 bg-lime text-dark rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '28px', height: '28px' }}
                        >
                          <Check size={18} />
                        </div>
                      )}

                      {/* Color Preview Swatch */}
                      <div
                        className="rounded-3 p-3 mb-3 border d-flex justify-content-between align-items-center"
                        style={{
                          backgroundColor: opt.bgColor,
                          borderColor: opt.accentColor,
                        }}
                      >
                        <div
                          className="rounded-circle"
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: opt.accentColor,
                            boxShadow: `0 0 12px ${opt.accentColor}`,
                          }}
                        />
                        <div
                          className="px-2 py-1 rounded small fw-bold"
                          style={{
                            backgroundColor: opt.cardColor,
                            color: opt.textColor,
                            fontSize: '0.75rem',
                          }}
                        >
                          Preview
                        </div>
                      </div>

                      <h5 className="font-heading fw-bold mb-1 text-white">{opt.name}</h5>
                      <p className="text-muted small mb-3">{opt.tagline}</p>

                      <button
                        className={`btn w-100 btn-sm ${
                          isSelected ? 'btn-lime' : 'btn-dark-card'
                        }`}
                      >
                        {isSelected ? 'Active Theme' : 'Apply Theme'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Profile Quick Info */}
          <div className="gym-card p-4">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
              {user?.role === 'admin' ? <Shield className="text-lime" size={20} /> : <User className="text-lime" size={20} />}
              <span>Account Credentials & Role Information</span>
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                  <small className="text-muted d-block mb-1">User Full Name</small>
                  <strong className="text-white fs-6">{user?.name}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                  <small className="text-muted d-block mb-1">Registered Email</small>
                  <strong className="text-white fs-6">{user?.email}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                  <small className="text-muted d-block mb-1">System Security Role</small>
                  <strong className="text-lime fs-6 text-uppercase">{user?.role}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
