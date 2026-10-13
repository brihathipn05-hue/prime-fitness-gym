import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Dumbbell, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      const userData = response.data.user;
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
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
            <div className="col-md-8 col-lg-6">
              <div className="gym-card p-4 p-sm-5 shadow-lg">
                <div className="text-center mb-4">
                  <div className="bg-lime p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                    <Dumbbell size={32} className="text-dark" />
                  </div>
                  <h2 className="font-heading fw-bold text-white mb-1">MEMBER REGISTRATION</h2>
                  <p className="text-muted small">Join Prime Fitness Gym & start your fitness journey</p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4 py-2 border-0 bg-danger bg-opacity-25 text-danger">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Full Name</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-dark ps-5"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
                    <div className="position-relative">
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-dark ps-5"
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Password</label>
                      <div className="position-relative">
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-dark ps-5"
                          placeholder="At least 6 chars"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Confirm Password</label>
                      <div className="position-relative">
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control form-control-dark ps-5"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <CheckCircle size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-lime w-100 py-3 font-heading fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3 pt-3 border-top border-secondary small text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-lime fw-bold text-decoration-none">
                    Log In
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

export default Register;
