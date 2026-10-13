import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  User,
  CreditCard,
  Scale,
  Dumbbell,
  Utensils,
  CalendarCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';

const DashboardHome = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [member, setMember] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState('');

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    setLoading(true);
    try {
      const [profRes, attRes] = await Promise.all([
        api.get('/api/profile'),
        api.get('/api/attendance/my/stats'),
      ]);

      if (profRes.data.success) {
        setProfile(profRes.data.profile);
        setMember(profRes.data.member);
      }

      if (attRes.data.success) {
        setAttendanceStats(attRes.data);
      }

      // Try fetching workouts and diet if goal is set
      if (profRes.data.profile?.fitnessGoal && profRes.data.profile.fitnessGoal !== 'Not Set') {
        try {
          const wRes = await api.get('/api/workouts');
          if (wRes.data.success) setWorkoutPlan(wRes.data.workoutPlan);

          const dRes = await api.get('/api/diet');
          if (dRes.data.success) setDietPlan(dRes.data.dietPlan);
        } catch (e) {
          console.log('Workouts/Diet not configured yet');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheckIn = async () => {
    setCheckingIn(true);
    setCheckInMsg('');
    try {
      const res = await api.post('/api/attendance/check-in');
      if (res.data.success) {
        setCheckInMsg(res.data.message);
        // Refresh attendance stats
        const attRes = await api.get('/api/attendance/my/stats');
        if (attRes.data.success) setAttendanceStats(attRes.data);
      }
    } catch (err) {
      setCheckInMsg(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) return <Loading text="Loading your fitness portal..." />;

  // Days remaining calculation
  let daysRemaining = 0;
  if (member?.endDate) {
    const diff = new Date(member.endDate) - new Date();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="gym-card p-4 p-md-5 mb-4 position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-inline-flex align-items-center gap-2 badge badge-lime mb-3">
              <Flame size={16} />
              <span>Welcome Back to Prime Fitness</span>
            </div>
            <h1 className="font-heading fw-extrabold display-5 text-white mb-2">
              HELLO, <span className="text-lime">{user?.name?.toUpperCase()}</span>!
            </h1>
            <p className="text-muted mb-4 fs-6">
              Track your daily attendance, follow your 7-day workout schedule, and maintain your custom diet goals.
            </p>

            <div className="d-flex flex-wrap gap-3">
              {attendanceStats?.isCheckedInToday ? (
                <div className="btn bg-success bg-opacity-25 text-success border border-success fw-bold d-flex align-items-center gap-2 py-2 px-3">
                  <CheckCircle size={18} />
                  <span>Checked In Today</span>
                </div>
              ) : (
                <button
                  onClick={handleQuickCheckIn}
                  disabled={checkingIn}
                  className="btn btn-lime font-heading fw-bold d-flex align-items-center gap-2 px-4 py-2"
                >
                  <CalendarCheck size={18} />
                  <span>{checkingIn ? 'Checking In...' : 'Quick Check In Today'}</span>
                </button>
              )}
            </div>

            {checkInMsg && (
              <div className="small text-lime fw-semibold mt-2">{checkInMsg}</div>
            )}
          </div>

          <div className="col-md-4 text-center mt-4 mt-md-0">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={user.name}
                className="rounded-circle border border-lime p-1 shadow-lg"
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-lime text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-1 shadow-lg" style={{ width: '130px', height: '130px' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Key Overview Cards */}
      <div className="row g-4 mb-4">
        {/* Membership Status Card */}
        <div className="col-md-6 col-xl-4">
          <div className="gym-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-lime p-3 rounded-3 text-dark">
                  <CreditCard size={22} />
                </div>
                <span className={`badge ${member?.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                  {member?.status || 'No Plan'}
                </span>
              </div>
              <h5 className="font-heading fw-bold mb-1 text-white">{member?.membershipPlan || 'Standard'} Plan</h5>
              <p className="text-muted small mb-3">Access to gym facilities and features</p>

              <div className="bg-dark-custom p-3 rounded-3 border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Days Remaining:</span>
                  <span className="font-heading fw-bold text-lime fs-5">{daysRemaining} Days</span>
                </div>
              </div>
            </div>

            <Link to="/dashboard/membership" className="text-lime fw-semibold small d-inline-flex align-items-center gap-1 hover-lime">
              <span>View Membership Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* BMI & Goal Card */}
        <div className="col-md-6 col-xl-4">
          <div className="gym-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-info bg-opacity-25 text-info p-3 rounded-3">
                  <Scale size={22} />
                </div>
                <span className="badge badge-lime">Goal Set</span>
              </div>
              <h5 className="font-heading fw-bold mb-1 text-white">BMI & Fitness Goal</h5>
              <p className="text-muted small mb-3">Current screening & target program</p>

              <div className="bg-dark-custom p-3 rounded-3 border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">BMI Score:</span>
                  <span className="fw-bold text-white">{profile?.bmi ? `${profile.bmi}` : 'Not Set'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Confirmed Goal:</span>
                  <span className="fw-bold text-lime">{profile?.fitnessGoal || 'Not Set'}</span>
                </div>
              </div>
            </div>

            <Link to="/dashboard/bmi" className="text-lime fw-semibold small d-inline-flex align-items-center gap-1 hover-lime">
              <span>Calculate or Update BMI</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Monthly Attendance Summary */}
        <div className="col-md-12 col-xl-4">
          <div className="gym-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-success bg-opacity-25 text-success p-3 rounded-3">
                  <CalendarCheck size={22} />
                </div>
                <span className="badge badge-lime">Monthly Visits</span>
              </div>
              <h5 className="font-heading fw-bold mb-1 text-white">Gym Attendance</h5>
              <p className="text-muted small mb-3">Your check-in frequency this month</p>

              <div className="bg-dark-custom p-3 rounded-3 border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">Visits This Month:</span>
                  <span className="font-heading fw-bold text-lime fs-5">{attendanceStats?.monthVisits || 0} Days</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Total Lifetime Check-ins:</span>
                  <span className="fw-bold text-white">{attendanceStats?.totalVisits || 0}</span>
                </div>
              </div>
            </div>

            <Link to="/dashboard/attendance" className="text-lime fw-semibold small d-inline-flex align-items-center gap-1 hover-lime">
              <span>Open Attendance Calendar</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Workout & Diet Snapshots */}
      <div className="row g-4 mb-4">
        {/* Today's Workout Snapshot */}
        <div className="col-lg-6">
          <div className="gym-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-heading fw-bold mb-0 d-flex align-items-center gap-2">
                <Dumbbell className="text-lime" size={20} />
                <span>Workout Plan Snapshot</span>
              </h5>
              <Link to="/dashboard/workouts" className="btn btn-sm btn-outline-lime">
                Full 7-Day Plan
              </Link>
            </div>

            {!workoutPlan ? (
              <div className="bg-dark-custom p-4 rounded-3 text-center text-muted border border-secondary">
                <p className="mb-2">No active workout plan loaded.</p>
                <Link to="/dashboard/bmi" className="btn btn-sm btn-lime">
                  Calculate BMI to Unlock
                </Link>
              </div>
            ) : (
              <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                <div className="text-lime fw-bold mb-2">Target Goal: {workoutPlan.fitnessGoal}</div>
                <h6 className="fw-bold text-white">{workoutPlan.schedule[0]?.title}</h6>
                <p className="small text-muted mb-2">{workoutPlan.schedule[0]?.guidance}</p>
                <div className="small text-white fw-semibold">Key Exercises:</div>
                <ul className="list-unstyled small text-muted mb-0">
                  {workoutPlan.schedule[0]?.exercises.slice(0, 3).map((ex, i) => (
                    <li key={i}>• {ex.name} ({ex.setsReps})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Diet Plan Snapshot */}
        <div className="col-lg-6">
          <div className="gym-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-heading fw-bold mb-0 d-flex align-items-center gap-2">
                <Utensils className="text-lime" size={20} />
                <span>Diet Plan Snapshot</span>
              </h5>
              <Link to="/dashboard/diet" className="btn btn-sm btn-outline-lime">
                Full Nutrition Chart
              </Link>
            </div>

            {!dietPlan ? (
              <div className="bg-dark-custom p-4 rounded-3 text-center text-muted border border-secondary">
                <p className="mb-2">No active diet plan loaded.</p>
                <Link to="/dashboard/bmi" className="btn btn-sm btn-lime">
                  Calculate BMI to Unlock
                </Link>
              </div>
            ) : (
              <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-lime fw-bold">Goal: {dietPlan.fitnessGoal}</span>
                  <span className="badge badge-lime">{dietPlan.calorieTarget} kcal / day</span>
                </div>
                <div className="small text-muted mb-2">
                  <strong>Protein Target:</strong> {dietPlan.proteinTarget} | <strong>Hydration:</strong> {dietPlan.waterTarget}
                </div>
                <div className="small text-white fw-semibold">Sample Meals:</div>
                <ul className="list-unstyled small text-muted mb-0">
                  {dietPlan.meals.slice(0, 2).map((m, idx) => (
                    <li key={idx}>• <strong>{m.name}:</strong> {m.items.join(', ')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
