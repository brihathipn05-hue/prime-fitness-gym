import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Dumbbell, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const userData = response.data.user;
      setUser(userData);

      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-custom min-vh-100 d-flex flex-column text-white">
      <Header user={null} />

      <main className="flex-grow-1 d-flex align-items-center py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="gym-card p-4 p-sm-5 shadow-lg">
                <div className="text-center mb-4">
                  <div className="bg-lime p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                    <Dumbbell size={32} className="text-dark" />
                  </div>
                  <h2 className="font-heading fw-bold text-white mb-1">MEMBER & ADMIN LOGIN</h2>
                  <p className="text-muted small">Access your Prime Fitness Gym portal</p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 py-2 border-0 bg-danger bg-opacity-25 text-danger">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control form-control-dark ps-5"
                        placeholder="e.g. member@primefitness.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label text-muted small fw-bold text-uppercase mb-0">Password</label>
                    </div>
                    <div className="position-relative">
                      <input
                        type="password"
                        className="form-control form-control-dark ps-5"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-lime w-100 py-3 font-heading fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
                  >
                    {loading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <span>Login to Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3 pt-3 border-top border-secondary small text-muted">
                  Don't have a gym membership account?{' '}
                  <Link to="/register" className="text-lime fw-bold text-decoration-none">
                    Register Here
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
