import React, { useState, useEffect } from 'react';
import Sidenav from '../components/Sidenav';
import Loading from '../components/Loading';
import api from '../api/axios';
import {
  CalendarCheck,
  Search,
  Plus,
  Edit2,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
} from 'lucide-react';

const Attendance = ({ user, onLogout }) => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    todayCheckIns: 0,
    uniqueMembersPresentToday: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters & Pagination
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // All members list for manual marking dropdown
  const [allMembers, setAllMembers] = useState([]);

  // Modals
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mark Form State
  const [markForm, setMarkForm] = useState({
    memberId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    attendanceDate: '',
    checkInTime: '',
    method: 'admin-manual',
  });

  useEffect(() => {
    fetchAttendanceData();
    fetchStats();
    fetchAllMembers();
  }, [selectedDate, search, planFilter, page]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/attendance/admin', {
        params: {
          date: selectedDate,
          search,
          plan: planFilter,
          page,
          limit: 15,
        },
      });
      if (res.data.success) {
        setAttendance(res.data.attendance);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance log');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/attendance/admin/stats');
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllMembers = async () => {
    try {
      const res = await api.get('/api/members?limit=200');
      if (res.data.success) {
        setAllMembers(res.data.members);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!markForm.memberId) {
      setError('Please select a member');
      return;
    }
    try {
      const res = await api.post('/api/attendance/admin/mark', markForm);
      if (res.data.success) {
        setSuccess(res.data.message || 'Attendance marked successfully');
        setShowMarkModal(false);
        fetchAttendanceData();
        fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark manual attendance');
    }
  };

  const handleEditOpen = (rec) => {
    setSelectedRecord(rec);
    setEditForm({
      attendanceDate: rec.attendanceDate,
      checkInTime: new Date(rec.checkInTime).toISOString().slice(0, 16),
      method: rec.method,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.put(`/api/attendance/admin/${selectedRecord._id}`, editForm);
      if (res.data.success) {
        setSuccess('Attendance record corrected successfully');
        setShowEditModal(false);
        fetchAttendanceData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update attendance record');
    }
  };

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
              <h2 className="font-heading fw-bold mb-1 text-white">ATTENDANCE MANAGEMENT</h2>
              <p className="text-muted small mb-0">Track daily gym check-ins, filter by date, and mark manual entries</p>
            </div>

            <button onClick={() => setShowMarkModal(true)} className="btn btn-lime d-flex align-items-center gap-2">
              <Plus size={18} />
              <span>Mark Manual Attendance</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-4 bg-danger bg-opacity-25 border-0 text-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 small mb-4 bg-success bg-opacity-25 border-0 text-success">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="gym-card p-4 d-flex align-items-center gap-3">
                <div className="bg-lime p-3 rounded-3 text-dark">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Today's Check-ins</div>
                  <h3 className="font-heading fw-bold text-white mb-0">{stats.todayCheckIns}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="gym-card p-4 d-flex align-items-center gap-3">
                <div className="bg-info bg-opacity-25 text-info p-3 rounded-3">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Unique Members Present</div>
                  <h3 className="font-heading fw-bold text-white mb-0">{stats.uniqueMembersPresentToday}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="gym-card p-4 d-flex align-items-center gap-3">
                <div className="bg-secondary bg-opacity-25 text-white p-3 rounded-3">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Business Timezone</div>
                  <h5 className="font-heading fw-bold text-lime mb-0">Asia/Kolkata (IST)</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="gym-card p-3 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <label className="form-label text-muted small fw-bold text-uppercase mb-1">Attendance Date</label>
                <input
                  type="date"
                  className="form-control form-control-dark"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label text-muted small fw-bold text-uppercase mb-1">Search Member</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-dark ps-5"
                    placeholder="Search by member name or email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label text-muted small fw-bold text-uppercase mb-1">Membership Plan</label>
                <select
                  className="form-select form-select-dark"
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="All">All Plans</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Loading text="Loading Attendance Logs..." />
          ) : attendance.length === 0 ? (
            <div className="gym-card p-5 text-center my-4 text-muted">
              <CalendarCheck size={40} className="mb-3 text-lime opacity-50" />
              <h5>No Attendance Records Found</h5>
              <p className="small mb-0">No check-in entries found for date: {selectedDate}</p>
            </div>
          ) : (
            <div className="gym-card p-4">
              <div className="table-responsive">
                <table className="table table-dark-custom mb-0">
                  <thead>
                    <tr>
                      <th>Member Name</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Attendance Date</th>
                      <th>Check-in Time</th>
                      <th>Recording Method</th>
                      <th>Marked By</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((rec) => (
                      <tr key={rec._id}>
                        <td className="fw-bold text-white">{rec.member?.fullName || 'Deleted Member'}</td>
                        <td>{rec.member?.email || 'N/A'}</td>
                        <td>
                          <span className="badge badge-lime">{rec.member?.membershipPlan || 'Standard'}</span>
                        </td>
                        <td>{rec.attendanceDate}</td>
                        <td className="fw-bold text-lime">
                          {new Date(rec.checkInTime).toLocaleTimeString('en-US', {
                            timeZone: 'Asia/Kolkata',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              rec.method === 'member-check-in' ? 'badge-active' : 'badge-expired'
                            }`}
                          >
                            {rec.method}
                          </span>
                        </td>
                        <td>{rec.markedBy?.name || 'System'}</td>
                        <td className="text-end">
                          <button onClick={() => handleEditOpen(rec)} className="btn btn-sm btn-outline-lime">
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">
                  <span className="small text-muted">Page {page} of {totalPages}</span>
                  <div className="d-flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="btn btn-sm btn-dark-card"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="btn btn-sm btn-dark-card"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Manual Mark Modal */}
      {showMarkModal && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-card-custom border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-heading fw-bold">Mark Manual Attendance</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMarkModal(false)}></button>
              </div>
              <form onSubmit={handleMarkSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Select Member *</label>
                    <select
                      className="form-select form-select-dark"
                      value={markForm.memberId}
                      onChange={(e) => setMarkForm({ ...markForm, memberId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Member --</option>
                      {allMembers.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.fullName} ({m.email}) - {m.membershipPlan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Attendance Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      className="form-control form-control-dark"
                      value={markForm.date}
                      onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Check-in Time</label>
                    <input
                      type="time"
                      className="form-control form-control-dark"
                      value={markForm.time}
                      onChange={(e) => setMarkForm({ ...markForm, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowMarkModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-lime">
                    Save Attendance Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && selectedRecord && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-card-custom border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-heading fw-bold">Correct Attendance Record</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <p className="small text-muted mb-3">
                    Editing record for <strong>{selectedRecord.member?.fullName}</strong>
                  </p>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Attendance Date</label>
                    <input
                      type="date"
                      className="form-control form-control-dark"
                      value={editForm.attendanceDate}
                      onChange={(e) => setEditForm({ ...editForm, attendanceDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Check-in Timestamp</label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-dark"
                      value={editForm.checkInTime}
                      onChange={(e) => setEditForm({ ...editForm, checkInTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-lime">
                    Update Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
