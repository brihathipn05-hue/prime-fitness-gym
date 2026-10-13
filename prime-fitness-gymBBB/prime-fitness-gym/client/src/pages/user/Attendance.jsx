import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  Flame,
  Award,
} from 'lucide-react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    isCheckedInToday: false,
    todayCheckInTime: null,
    totalVisits: 0,
    monthVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get('/api/attendance/my'),
        api.get('/api/attendance/my/stats'),
      ]);

      if (listRes.data.success) {
        setAttendance(listRes.data.attendance);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/api/attendance/check-in');
      if (res.data.success) {
        setSuccess(res.data.message || 'Check-in successful!');
        fetchMyAttendance();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) return <Loading text="Loading your attendance records..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div className="bg-lime p-3 rounded-3 text-dark">
          <CalendarCheck size={28} />
        </div>
        <div>
          <h2 className="font-heading fw-bold mb-1 text-white">MY ATTENDANCE LOG</h2>
          <p className="text-muted small mb-0">Daily check-in tracking & visit history in Asia/Kolkata timezone</p>
        </div>
      </div>

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

      {/* Check-In Action Card */}
      <div className="gym-card p-4 p-sm-5 mb-4 position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-md-7">
            <span className="badge badge-lime text-uppercase mb-2 px-3 py-2">Gym Facilities Check-In</span>
            <h2 className="font-heading fw-extrabold text-white mb-2">TODAY'S ATTENDANCE STATUS</h2>
            <p className="text-muted small mb-4">
              Click the button below to register your attendance for today's workout session.
            </p>

            {stats.isCheckedInToday ? (
              <div className="bg-success bg-opacity-25 border border-success p-3 rounded-3 text-success d-inline-flex align-items-center gap-2">
                <CheckCircle size={22} />
                <div>
                  <div className="fw-bold">Checked In Successfully Today</div>
                  <div className="small">
                    Timestamp: {stats.todayCheckInTime ? new Date(stats.todayCheckInTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : 'Recorded'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="btn btn-lime btn-lg font-heading fw-bold d-inline-flex align-items-center gap-2 px-4 py-3"
              >
                <CalendarCheck size={22} />
                <span>{checkingIn ? 'Recording Check-in...' : 'Check In For Today'}</span>
              </button>
            )}
          </div>

          <div className="col-md-5 mt-4 mt-md-0">
            <div className="row g-3">
              <div className="col-6">
                <div className="bg-dark-custom p-3 rounded-3 border border-secondary text-center">
                  <Flame size={24} className="text-lime mb-1" />
                  <div className="text-muted small">This Month</div>
                  <div className="font-heading fw-extrabold fs-4 text-white">{stats.monthVisits} Days</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-dark-custom p-3 rounded-3 border border-secondary text-center">
                  <Award size={24} className="text-lime mb-1" />
                  <div className="text-muted small">Total Lifetime</div>
                  <div className="font-heading fw-extrabold fs-4 text-white">{stats.totalVisits} Visits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="gym-card p-4">
        <h4 className="font-heading fw-bold text-white mb-3 d-flex align-items-center gap-2">
          <CalendarIcon className="text-lime" size={20} />
          <span>Complete Attendance History</span>
        </h4>

        {attendance.length === 0 ? (
          <div className="p-4 text-center text-muted bg-dark-custom rounded-3 border border-secondary">
            <CalendarCheck size={36} className="mb-2 text-lime opacity-50" />
            <p className="mb-0">No attendance records recorded yet. Check in above for your first visit!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-custom mb-0">
              <thead>
                <tr>
                  <th>Gym Business Date</th>
                  <th>Check-In Time (IST)</th>
                  <th>Recording Method</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((rec) => (
                  <tr key={rec._id}>
                    <td className="fw-bold text-white">{rec.attendanceDate}</td>
                    <td className="fw-bold text-lime">
                      {new Date(rec.checkInTime).toLocaleTimeString('en-US', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td>
                      <span className="badge badge-lime text-uppercase" style={{ fontSize: '0.7rem' }}>
                        {rec.method}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
