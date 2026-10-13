import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Loading from '../components/Loading';
import api from '../api/axios';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  CalendarCheck,
  UserPlus,
  ArrowUpRight,
  Activity,
  Crown,
  Award,
  ShieldCheck,
  PieChart,
  BarChart3,
  UserMinus,
  DollarSign,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    cancelledMembers: 0,
    expiredMemberships: 0,
    standardMembers: 0,
    premiumMembers: 0,
    vipMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  const [attendanceStats, setAttendanceStats] = useState({
    todayCheckIns: 0,
    uniqueMembersPresentToday: 0,
  });

  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [adminRes, attRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/attendance/admin/stats'),
      ]);

      if (adminRes.data.success) {
        setStats(adminRes.data.stats || {});
        setRecentMembers(adminRes.data.recentMembers || []);
      }

      if (attRes.data.success) {
        setAttendanceStats(attRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      count: stats.totalMembers || 0,
      icon: Users,
      colorClass: 'text-primary',
      bgColorClass: 'bg-primary bg-opacity-10',
      link: '/admin/members',
    },
    {
      title: 'Active Members',
      count: stats.activeMembers || 0,
      icon: UserCheck,
      colorClass: 'text-lime',
      bgColorClass: 'bg-lime bg-opacity-10',
      link: '/admin/members?status=Active',
    },
    {
      title: 'Monthly Revenue',
      count: `$${stats.monthlyRevenue || 0}`,
      icon: DollarSign,
      colorClass: 'text-success',
      bgColorClass: 'bg-success bg-opacity-10',
      link: '/admin/memberships',
    },
    {
      title: 'Total Revenue',
      count: `$${stats.totalRevenue || 0}`,
      icon: TrendingUp,
      colorClass: 'text-lime',
      bgColorClass: 'bg-lime bg-opacity-10',
      link: '/admin/reports',
    },
    {
      title: 'Expired Memberships',
      count: stats.expiredMemberships || 0,
      icon: AlertTriangle,
      colorClass: 'text-warning',
      bgColorClass: 'bg-warning bg-opacity-10',
      link: '/admin/members?status=Expired',
    },
    {
      title: 'Standard Members',
      count: stats.standardMembers || 0,
      icon: ShieldCheck,
      colorClass: 'text-info',
      bgColorClass: 'bg-info bg-opacity-10',
      link: '/admin/members?plan=Standard',
    },
    {
      title: 'Premium Members',
      count: stats.premiumMembers || 0,
      icon: Award,
      colorClass: 'text-purple',
      bgColorClass: 'bg-primary bg-opacity-10',
      link: '/admin/members?plan=Premium',
    },
    {
      title: 'VIP Members',
      count: stats.vipMembers || 0,
      icon: Crown,
      colorClass: 'text-warning',
      bgColorClass: 'bg-warning bg-opacity-10',
      link: '/admin/members?plan=VIP',
    },
  ];

  // Calculate percentages for visualization bars
  const total = stats.totalMembers || 1;
  const activePct = Math.round((stats.activeMembers / total) * 100);
  const inactivePct = Math.round((stats.inactiveMembers / total) * 100);
  const cancelledPct = Math.round((stats.cancelledMembers / total) * 100);
  const expiredPct = Math.round((stats.expiredMemberships / total) * 100);

  const standardPct = Math.round((stats.standardMembers / total) * 100);
  const premiumPct = Math.round((stats.premiumMembers / total) * 100);
  const vipPct = Math.round((stats.vipMembers / total) * 100);

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="admin" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          {/* Top Header Bar */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h2 className="font-heading fw-bold mb-1 text-white">ADMINISTRATOR DASHBOARD</h2>
              <p className="text-muted small mb-0">
                Today is <strong className="text-lime">{currentDateStr}</strong> — Real-time gym analytics & management
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Link to="/admin/members" className="btn btn-lime btn-sm d-flex align-items-center gap-2">
                <UserPlus size={16} />
                <span>Add / Manage Members</span>
              </Link>
              <Link to="/admin/attendance" className="btn btn-outline-lime btn-sm d-flex align-items-center gap-2">
                <CalendarCheck size={16} />
                <span>Attendance Log</span>
              </Link>
              <Link to="/admin/reports" className="btn btn-dark-card btn-sm d-flex align-items-center gap-2">
                <BarChart3 size={16} className="text-lime" />
                <span>Reports</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <Loading text="Fetching Gym Statistics..." />
          ) : error ? (
            <div className="alert alert-danger bg-danger bg-opacity-25 border-0 text-danger">{error}</div>
          ) : (
            <>
              {/* Stat Cards Grid (8 Cards as requested) */}
              <div className="row g-3 mb-4">
                {statCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="col-sm-6 col-lg-3">
                      <div className="gym-card p-3 h-100 position-relative">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className={`p-2 rounded-3 ${card.bgColorClass}`}>
                            <Icon size={22} className={card.colorClass} />
                          </div>
                          <Link to={card.link} className="text-muted hover-lime" aria-label={`Filter by ${card.title}`}>
                            <ArrowUpRight size={18} />
                          </Link>
                        </div>
                        <h6 className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
                          {card.title}
                        </h6>
                        <h3 className="font-heading fw-extrabold text-white mb-0">{card.count}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attendance Quick Banner Cards */}
              <div className="row g-3 mb-5">
                <div className="col-md-6">
                  <div className="gym-card p-3 d-flex align-items-center justify-content-between border-start border-4 border-info">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info">
                        <CalendarCheck size={26} />
                      </div>
                      <div>
                        <h6 className="text-muted small text-uppercase fw-bold mb-0">Today's Check-ins</h6>
                        <h2 className="font-heading fw-bold text-white mb-0">{attendanceStats.todayCheckIns}</h2>
                      </div>
                    </div>
                    <Link to="/admin/attendance" className="btn btn-sm btn-outline-lime">
                      View Log
                    </Link>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="gym-card p-3 d-flex align-items-center justify-content-between border-start border-4 border-success">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
                        <Activity size={26} />
                      </div>
                      <div>
                        <h6 className="text-muted small text-uppercase fw-bold mb-0">Unique Members Present Today</h6>
                        <h2 className="font-heading fw-bold text-white mb-0">{attendanceStats.uniqueMembersPresentToday}</h2>
                      </div>
                    </div>
                    <Link to="/admin/attendance" className="btn btn-sm btn-outline-lime">
                      Verify Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Visualizations Section */}
              <div className="row g-4 mb-5">
                {/* 1. Membership Status Distribution */}
                <div className="col-lg-6">
                  <div className="gym-card p-4 h-100">
                    <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
                      <PieChart size={20} className="text-lime" />
                      <span>Membership Status Breakdown</span>
                    </h5>
                    <p className="text-muted small mb-4">Proportion of active, inactive, cancelled, and expired accounts</p>

                    <div className="d-flex flex-column gap-3">
                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-success">Active ({stats.activeMembers})</span>
                          <span>{activePct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${activePct}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-warning">Expired ({stats.expiredMemberships})</span>
                          <span>{expiredPct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${expiredPct}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-secondary">Inactive ({stats.inactiveMembers})</span>
                          <span>{inactivePct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-secondary" style={{ width: `${inactivePct}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-danger">Cancelled ({stats.cancelledMembers})</span>
                          <span>{cancelledPct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-danger" style={{ width: `${cancelledPct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Membership Plan Distribution */}
                <div className="col-lg-6">
                  <div className="gym-card p-4 h-100">
                    <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
                      <BarChart3 size={20} className="text-lime" />
                      <span>Membership Plan Distribution</span>
                    </h5>
                    <p className="text-muted small mb-4">Distribution of members across Standard, Premium, and VIP plans</p>

                    <div className="d-flex flex-column gap-3">
                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-info">Standard Plan ({stats.standardMembers})</span>
                          <span>{standardPct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-info" style={{ width: `${standardPct}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-primary">Premium Plan ({stats.premiumMembers})</span>
                          <span>{premiumPct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-primary" style={{ width: `${premiumPct}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-warning">VIP Plan ({stats.vipMembers})</span>
                          <span>{vipPct}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '8px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${vipPct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Members Table */}
              <div className="gym-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="font-heading fw-bold mb-0">Recently Registered Members</h4>
                  <Link to="/admin/members" className="btn btn-sm btn-outline-lime">
                    View All Members
                  </Link>
                </div>

                {recentMembers.length === 0 ? (
                  <p className="text-muted my-4 text-center">No members found in database.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark-custom mb-0">
                      <thead>
                        <tr>
                          <th>Member Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Plan</th>
                          <th>Status</th>
                          <th>End Date</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMembers.map((m) => (
                          <tr key={m._id}>
                            <td className="fw-bold text-white">{m.fullName}</td>
                            <td>{m.email}</td>
                            <td>{m.phone || 'N/A'}</td>
                            <td>
                              <span className="badge badge-lime">{m.membershipPlan}</span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  m.status === 'Active'
                                    ? 'badge-active'
                                    : m.status === 'Inactive'
                                    ? 'badge-inactive'
                                    : 'badge-expired'
                                }`}
                              >
                                {m.status}
                              </span>
                            </td>
                            <td>{new Date(m.endDate).toLocaleDateString()}</td>
                            <td className="text-end">
                              <Link to={`/admin/members/${m._id}`} className="btn btn-sm btn-dark-card">
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
