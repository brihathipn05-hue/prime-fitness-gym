import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidenav from '../components/Sidenav';
import api from '../api/axios';
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

const ChangePassword = ({ user, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill out all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setSuccess(response.data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-custom min-vh-100 d-flex flex-column text-white">
      {user ? (
        <div className="container-fluid flex-grow-1 p-0">
          <div className="row g-0 min-vh-100">
            <div className="col-md-3 col-lg-2">
              <Sidenav role={user.role} user={user} onLogout={onLogout} />
            </div>

            <div className="col-md-9 col-lg-10 p-4 p-md-5">
              <div className="max-w-2xl mx-auto" style={{ maxWidth: '600px' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="bg-lime p-3 rounded-3 text-dark">
                    <KeyRound size={28} />
                  </div>
                  <div>
                    <h2 className="font-heading fw-bold mb-1">CHANGE ACCOUNT PASSWORD</h2>
                    <p className="text-muted small mb-0">Update your security credentials for Prime Fitness Gym</p>
                  </div>
                </div>

                <div className="gym-card p-4 p-sm-5 shadow-lg">
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 py-2 border-0 bg-danger bg-opacity-25 text-danger">
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success d-flex align-items-center gap-2 small mb-4 py-2 border-0 bg-success bg-opacity-25 text-success">
                      <CheckCircle size={18} className="flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold text-uppercase">Current Password</label>
                      <input
                        type="password"
                        className="form-control form-control-dark"
                        placeholder="Verify existing password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold text-uppercase">New Password</label>
                      <input
                        type="password"
                        className="form-control form-control-dark"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control form-control-dark"
                        placeholder="Re-enter new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-lime w-100 py-3 font-heading fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      <ShieldCheck size={20} />
                      <span>{loading ? 'Updating Password...' : 'Update Security Password'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Header user={null} />
          <div className="container py-5 flex-grow-1 text-center">
            <h3>Please login to change your password.</h3>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default ChangePassword;
