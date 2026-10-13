import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Loading from '../components/Loading';
import api from '../api/axios';
import {
  User,
  ArrowLeft,
  CalendarCheck,
  CreditCard,
  Activity,
  Phone,
  Scale,
  Clock,
  Flame,
  Award,
} from 'lucide-react';

const MemberDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/members/${id}`);
      if (res.data.success) {
        setMemberData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch member details');
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingDays = (endDateStr) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="admin" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          <div className="mb-4">
            <Link to="/admin/members" className="btn btn-outline-lime btn-sm d-inline-flex align-items-center gap-2 mb-3">
              <ArrowLeft size={16} />
              <span>Back to Members List</span>
            </Link>
            <h2 className="font-heading fw-bold mb-1 text-white">MEMBER PROFILE OVERVIEW</h2>
          </div>

          {loading ? (
            <Loading text="Loading Member Details..." />
          ) : error ? (
            <div className="alert alert-danger bg-danger bg-opacity-25 border-0 text-danger">{error}</div>
          ) : !memberData ? (
            <div className="text-muted">Member not found.</div>
          ) : (
            <div className="row g-4">
              {/* Profile Card */}
              <div className="col-lg-4">
                <div className="gym-card p-4 text-center">
                  <div className="position-relative d-inline-block mb-3">
                    {memberData.profile?.photoUrl ? (
                      <img
                        src={memberData.profile.photoUrl}
                        alt={memberData.member.fullName}
                        className="rounded-circle border border-lime p-1"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-lime text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-1" style={{ width: '120px', height: '120px' }}>
                        {memberData.member.fullName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h3 className="font-heading fw-bold mb-1 text-white">{memberData.member.fullName}</h3>
                  <div className="text-muted small mb-3">{memberData.member.email}</div>

                  <div className="mb-3">
                    <span className="badge badge-lime me-2">{memberData.member.membershipPlan} Plan</span>
                    <span className={`badge ${memberData.member.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {memberData.member.status}
                    </span>
                  </div>

                  <hr className="border-secondary my-3" />

                  <ul className="list-unstyled text-start d-flex flex-column gap-2 small text-muted mb-0">
                    <li className="d-flex align-items-center gap-2">
                      <Phone size={16} className="text-lime" />
                      <span>Phone: {memberData.member.phone || 'Not provided'}</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <User size={16} className="text-lime" />
                      <span>Age & Gender: {memberData.member.age || 'N/A'} yrs / {memberData.member.gender}</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <Activity size={16} className="text-lime" />
                      <span>Blood Group: {memberData.member.bloodGroup || 'Not specified'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Membership & Fitness Details */}
              <div className="col-lg-8">
                <div className="row g-4 mb-4">
                  {/* Membership Tenure & Remaining Days */}
                  <div className="col-sm-6">
                    <div className="gym-card p-4 h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-lime p-3 rounded-3 text-dark">
                          <CreditCard size={22} />
                        </div>
                        <div>
                          <h6 className="text-muted small text-uppercase mb-0">Membership Tenure</h6>
                          <div className="fw-bold fs-5 text-white">{memberData.member.durationMonths} Month(s)</div>
                        </div>
                      </div>
                      <div className="small text-muted mb-2">
                        <div><strong>Start Date:</strong> {new Date(memberData.member.startDate).toLocaleDateString()}</div>
                        <div><strong>End Date:</strong> {new Date(memberData.member.endDate).toLocaleDateString()}</div>
                      </div>
                      <div className="p-2 rounded bg-dark-custom border border-secondary text-center">
                        <small className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: '0.7rem' }}>Remaining Days</small>
                        <span className="fw-bold text-lime fs-5">
                          {calculateRemainingDays(memberData.member.endDate)} Days Left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BMI & Goal */}
                  <div className="col-sm-6">
                    <div className="gym-card p-4 h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-lime p-3 rounded-3 text-dark">
                          <Scale size={22} />
                        </div>
                        <div>
                          <h6 className="text-muted small text-uppercase mb-0">BMI & Goal</h6>
                          <div className="fw-bold fs-5 text-white">
                            {memberData.profile?.bmi ? `${memberData.profile.bmi} BMI` : 'Not calculated'}
                          </div>
                        </div>
                      </div>
                      <div className="small text-muted">
                        <div><strong>Category:</strong> {memberData.profile?.bmiCategory || 'N/A'}</div>
                        <div><strong>Confirmed Goal:</strong> {memberData.profile?.fitnessGoal || 'Not set'}</div>
                        <div><strong>Height / Weight:</strong> {memberData.member.height || 0} cm / {memberData.member.weight || 0} kg</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance History */}
                <div className="gym-card p-4">
                  <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
                    <CalendarCheck className="text-lime" size={20} />
                    <span>Recent Attendance Log</span>
                  </h5>

                  {memberData.recentAttendance.length === 0 ? (
                    <p className="text-muted small mb-0">No check-in history found for this member.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark-custom mb-0">
                        <thead>
                          <tr>
                            <th>Date (IST)</th>
                            <th>Check-in Time</th>
                            <th>Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberData.recentAttendance.map((att) => (
                            <tr key={att._id}>
                              <td className="fw-bold text-white">{att.attendanceDate}</td>
                              <td>
                                {new Date(att.checkInTime).toLocaleTimeString('en-US', {
                                  timeZone: 'Asia/Kolkata',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td>
                                <span className="badge badge-lime text-uppercase" style={{ fontSize: '0.7rem' }}>
                                  {att.method}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
