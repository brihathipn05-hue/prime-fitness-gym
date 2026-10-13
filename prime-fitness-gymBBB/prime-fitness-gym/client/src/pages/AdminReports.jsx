import React, { useState, useEffect } from 'react';
import Sidenav from '../components/Sidenav';
import Loading from '../components/Loading';
import api from '../api/axios';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  DollarSign,
  CalendarCheck,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';

const AdminReports = ({ user, onLogout }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/members/reports');
      if (res.data.success) {
        setReportData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics reports');
    } finally {
      setLoading(false);
    }
  };

  const stats = reportData?.stats || {};
  const total = stats.totalMembers || 1;
  const activePct = Math.round(((stats.activeMembers || 0) / total) * 100);
  const inactivePct = Math.round(((stats.inactiveMembers || 0) / total) * 100);
  const expiredPct = Math.round(((stats.expiredMemberships || 0) / total) * 100);

  const planRevenue = reportData?.planRevenue || { Standard: 0, Premium: 0, VIP: 0 };
  const totalRev = (stats.totalRevenue || 0) || 1;

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="admin" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          {/* Top Bar */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h2 className="font-heading fw-bold mb-1 text-white">REPORTS & ANALYTICS</h2>
              <p className="text-muted small mb-0">Business performance metrics, revenue breakdowns, and gym attendance trends</p>
            </div>
            <button onClick={fetchReports} className="btn btn-outline-lime d-flex align-items-center gap-2">
              <TrendingUp size={18} />
              <span>Refresh Analytics</span>
            </button>
          </div>

          {loading ? (
            <Loading text="Compiling Gym Analytics..." />
          ) : error ? (
            <div className="alert alert-danger bg-danger bg-opacity-25 border-0 text-danger">{error}</div>
          ) : (
            <>
              {/* Executive Summary Cards */}
              <div className="row g-4 mb-4">
                <div className="col-sm-6 col-lg-3">
                  <div className="gym-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small text-uppercase fw-bold">Total Members</span>
                      <div className="bg-lime p-2 rounded-3 text-dark">
                        <Users size={20} />
                      </div>
                    </div>
                    <h2 className="font-heading fw-extrabold text-white mb-0">{stats.totalMembers || 0}</h2>
                    <small className="text-lime">{activePct}% Active Retention Rate</small>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="gym-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small text-uppercase fw-bold">Total Revenue</span>
                      <div className="bg-success bg-opacity-25 text-success p-2 rounded-3">
                        <DollarSign size={20} />
                      </div>
                    </div>
                    <h2 className="font-heading fw-extrabold text-lime mb-0">${stats.totalRevenue || 0}</h2>
                    <small className="text-muted">Calculated from Member Plans</small>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="gym-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small text-uppercase fw-bold">Monthly Recurring</span>
                      <div className="bg-primary bg-opacity-25 text-primary p-2 rounded-3">
                        <Activity size={20} />
                      </div>
                    </div>
                    <h2 className="font-heading fw-extrabold text-white mb-0">${stats.monthlyRevenue || 0}/mo</h2>
                    <small className="text-muted">Active Subscriptions</small>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="gym-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small text-uppercase fw-bold">Total Check-ins</span>
                      <div className="bg-info bg-opacity-25 text-info p-2 rounded-3">
                        <CalendarCheck size={20} />
                      </div>
                    </div>
                    <h2 className="font-heading fw-extrabold text-white mb-0">{reportData.totalAttendanceRecords || 0}</h2>
                    <small className="text-muted">Historical Check-in Log</small>
                  </div>
                </div>
              </div>

              {/* Graphical Visualizations */}
              <div className="row g-4 mb-5">
                {/* Revenue Share by Plan */}
                <div className="col-lg-6">
                  <div className="gym-card p-4 h-100">
                    <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
                      <PieChart size={20} className="text-lime" />
                      <span>Revenue Share by Plan</span>
                    </h5>
                    <p className="text-muted small mb-4">Total revenue breakdown across Standard ($49), Premium ($89), and VIP ($149) plans</p>

                    <div className="d-flex flex-column gap-3">
                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-info">Standard Plan (${planRevenue.Standard})</span>
                          <span>{Math.round((planRevenue.Standard / totalRev) * 100)}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '10px' }}>
                          <div className="progress-bar bg-info" style={{ width: `${Math.round((planRevenue.Standard / totalRev) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-lime">Premium Plan (${planRevenue.Premium})</span>
                          <span>{Math.round((planRevenue.Premium / totalRev) * 100)}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '10px' }}>
                          <div className="progress-bar bg-lime" style={{ width: `${Math.round((planRevenue.Premium / totalRev) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-bold text-warning">VIP Plan (${planRevenue.VIP})</span>
                          <span>{Math.round((planRevenue.VIP / totalRev) * 100)}%</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '10px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${Math.round((planRevenue.VIP / totalRev) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Registration Growth */}
                <div className="col-lg-6">
                  <div className="gym-card p-4 h-100">
                    <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
                      <BarChart3 size={20} className="text-lime" />
                      <span>Member Registration Growth</span>
                    </h5>
                    <p className="text-muted small mb-4">New member registration distribution by month</p>

                    <div className="row g-3 align-items-end" style={{ minHeight: '150px' }}>
                      {Object.entries(reportData.monthlyRegistrations || {}).map(([month, count]) => {
                        const maxCount = Math.max(...Object.values(reportData.monthlyRegistrations), 1);
                        const heightPct = Math.max(15, Math.round((count / maxCount) * 100));
                        return (
                          <div key={month} className="col text-center">
                            <div className="small fw-bold text-lime mb-1">{count}</div>
                            <div className="progress bg-dark flex-column justify-content-end" style={{ height: '120px' }}>
                              <div
                                className="progress-bar bg-lime rounded-top"
                                style={{ height: `${heightPct}%`, width: '100%' }}
                              ></div>
                            </div>
                            <div className="small text-muted mt-2" style={{ fontSize: '0.7rem' }}>
                              {month}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Report Data Table */}
              <div className="gym-card p-4">
                <h4 className="font-heading fw-bold mb-3">Key Performance Indicators</h4>
                <div className="table-responsive">
                  <table className="table table-dark-custom mb-0">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th>Business Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-bold text-white">Active Gym Members</td>
                        <td>{stats.activeMembers}</td>
                        <td><span className="badge badge-active">Optimal</span></td>
                        <td>Generates recurring monthly membership income</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-white">Expired Memberships</td>
                        <td>{stats.expiredMemberships}</td>
                        <td><span className="badge badge-expired">Needs Attention</span></td>
                        <td>Candidates for renewal promotional outreach</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-white">VIP Subscribers</td>
                        <td>{stats.vipMembers}</td>
                        <td><span className="badge badge-lime">High Margin</span></td>
                        <td>Top tier plan providing maximum revenue per member</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
