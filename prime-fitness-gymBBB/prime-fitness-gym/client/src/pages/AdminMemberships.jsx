import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Loading from '../components/Loading';
import api from '../api/axios';
import {
  CreditCard,
  ShieldCheck,
  Award,
  Crown,
  CheckCircle,
  Users,
  Search,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

const AdminMemberships = ({ user, onLogout }) => {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    standardMembers: 0,
    premiumMembers: 0,
    vipMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('All');

  useEffect(() => {
    fetchData();
  }, [selectedPlan, search]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/members', {
        params: {
          search,
          plan: selectedPlan,
        },
      });
      if (res.data.success) {
        setMembers(res.data.members);
        setStats(res.data.stats || {});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch membership data');
    } finally {
      setLoading(false);
    }
  };

  const planCards = [
    {
      name: 'Standard Plan',
      planKey: 'Standard',
      price: '$49',
      period: '/ month',
      subscribers: stats.standardMembers || 0,
      estimatedMonthlyRevenue: (stats.standardMembers || 0) * 49,
      icon: ShieldCheck,
      colorClass: 'text-info',
      borderClass: 'border-info',
      bgOpacity: 'bg-info bg-opacity-10',
      features: [
        'Full Gym & Cardio Floor Access',
        'Basic Fitness Assessment',
        'Locker & Shower Facility',
        'Attendance System Check-in',
      ],
    },
    {
      name: 'Premium Plan',
      planKey: 'Premium',
      price: '$89',
      period: '/ month',
      subscribers: stats.premiumMembers || 0,
      estimatedMonthlyRevenue: (stats.premiumMembers || 0) * 89,
      icon: Award,
      colorClass: 'text-lime',
      borderClass: 'border-lime',
      bgOpacity: 'bg-lime bg-opacity-10',
      features: [
        'Everything in Standard Plan',
        'Personalized 7-Day Workout Plan',
        'Custom Nutrition & Diet Chart',
        'Group Fitness Classes',
      ],
    },
    {
      name: 'VIP Plan',
      planKey: 'VIP',
      price: '$149',
      period: '/ month',
      subscribers: stats.vipMembers || 0,
      estimatedMonthlyRevenue: (stats.vipMembers || 0) * 149,
      icon: Crown,
      colorClass: 'text-warning',
      borderClass: 'border-warning',
      bgOpacity: 'bg-warning bg-opacity-10',
      features: [
        'Everything in Premium Plan',
        'Dedicated Personal Trainer (3x/wk)',
        'Free Protein Shake per Session',
        'Guest Passes (2/month)',
      ],
    },
  ];

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="admin" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          {/* Header Bar */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h2 className="font-heading fw-bold mb-1 text-white">MEMBERSHIP PLANS MANAGEMENT</h2>
              <p className="text-muted small mb-0">Overview of gym membership packages, active subscribers, and plan distributions</p>
            </div>
            <div className="bg-card-custom px-4 py-2 rounded-3 border border-secondary text-end">
              <span className="small text-muted d-block">Monthly Recurring Revenue</span>
              <span className="font-heading fw-extrabold text-lime fs-4">${stats.monthlyRevenue || 0}</span>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-4">{error}</div>}

          {/* Membership Plan Cards Grid */}
          <div className="row g-4 mb-5">
            {planCards.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPlan === p.planKey;
              return (
                <div key={p.planKey} className="col-lg-4">
                  <div
                    className={`gym-card p-4 h-100 d-flex flex-column justify-content-between position-relative ${
                      isSelected ? 'border-2 border-lime shadow-lg' : ''
                    }`}
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className={`p-3 rounded-3 ${p.bgOpacity}`}>
                          <Icon size={24} className={p.colorClass} />
                        </div>
                        <span className="badge badge-lime">{p.subscribers} Active Subscribers</span>
                      </div>

                      <h4 className="font-heading fw-bold text-white mb-1">{p.name}</h4>
                      <div className="d-flex align-items-baseline gap-1 mb-3">
                        <span className="display-6 font-heading fw-extrabold text-white">{p.price}</span>
                        <span className="text-muted small">{p.period}</span>
                      </div>

                      <div className="bg-dark-custom p-3 rounded-3 border border-secondary mb-4">
                        <div className="d-flex justify-content-between small">
                          <span className="text-muted">Monthly Plan Revenue</span>
                          <strong className="text-lime">${p.estimatedMonthlyRevenue}</strong>
                        </div>
                      </div>

                      <h6 className="text-muted small text-uppercase fw-bold mb-3">Included Benefits:</h6>
                      <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-4">
                        {p.features.map((f, idx) => (
                          <li key={idx} className="d-flex align-items-center gap-2">
                            <CheckCircle size={15} className="text-lime flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedPlan(selectedPlan === p.planKey ? 'All' : p.planKey)}
                      className={`btn w-100 ${isSelected ? 'btn-lime' : 'btn-outline-lime'}`}
                    >
                      {isSelected ? 'Filter Active' : `Filter ${p.planKey} Members`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Member Plan Subscribers List */}
          <div className="gym-card p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h4 className="font-heading fw-bold mb-0">Plan Subscribers ({members.length})</h4>
                <p className="text-muted small mb-0">Members currently subscribed to {selectedPlan} plan(s)</p>
              </div>

              <div className="d-flex gap-3">
                <div className="position-relative" style={{ width: '250px' }}>
                  <input
                    type="text"
                    className="form-control form-control-dark ps-5"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>

                <select
                  className="form-select form-select-dark"
                  style={{ width: '180px' }}
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="All">All Plans</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loading text="Loading subscribers list..." />
            ) : members.length === 0 ? (
              <div className="p-4 text-center text-muted">No members found for selected criteria.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark-custom mb-0">
                  <thead>
                    <tr>
                      <th>Member Name</th>
                      <th>Email</th>
                      <th>Membership Plan</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m._id}>
                        <td className="fw-bold text-white">{m.fullName}</td>
                        <td>{m.email}</td>
                        <td>
                          <span className="badge badge-lime">{m.membershipPlan}</span>
                        </td>
                        <td>{new Date(m.startDate).toLocaleDateString()}</td>
                        <td>{new Date(m.endDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              m.status === 'Active' ? 'badge-active' : 'badge-inactive'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link to={`/admin/members/${m._id}`} className="btn btn-sm btn-dark-card">
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMemberships;
