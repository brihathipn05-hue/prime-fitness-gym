import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  Dumbbell,
  Calendar,
  Clock,
  Flame,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';

const Workouts = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/workouts');
      if (res.data.success) {
        setWorkoutPlan(res.data.workoutPlan);
        setFitnessGoal(res.data.fitnessGoal);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading 7-day workout plan..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div className="bg-lime p-3 rounded-3 text-dark">
          <Dumbbell size={28} />
        </div>
        <div>
          <h2 className="font-heading fw-bold mb-1 text-white">7-DAY PERSONALIZED WORKOUT PLAN</h2>
          <p className="text-muted small mb-0">Customized exercise schedule matching your confirmed goal: <span className="text-lime fw-bold">{fitnessGoal || 'Not Set'}</span></p>
        </div>
      </div>

      {error ? (
        <div className="gym-card p-5 text-center">
          <AlertTriangle size={48} className="mb-3 text-warning" />
          <h4 className="font-heading fw-bold text-white mb-2">Fitness Goal Not Confirmed</h4>
          <p className="text-muted max-w-md mx-auto mb-4">{error}</p>
          <Link to="/dashboard/bmi" className="btn btn-lime px-4 py-2 font-heading fw-bold">
            Calculate BMI & Confirm Goal Now
          </Link>
        </div>
      ) : !workoutPlan ? (
        <div className="text-muted">No workout schedule available.</div>
      ) : (
        <>
          {/* Day Navigation Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom border-secondary">
            {workoutPlan.schedule.map((dayItem, index) => (
              <button
                key={index}
                onClick={() => setActiveDayIndex(index)}
                className={`btn py-2 px-3 font-heading fw-bold rounded-3 transition-all ${
                  activeDayIndex === index
                    ? 'btn-lime'
                    : 'btn-dark-card text-muted hover-lime'
                }`}
              >
                {dayItem.day}
              </button>
            ))}
          </div>

          {/* Active Day Workout Schedule Details */}
          {workoutPlan.schedule[activeDayIndex] && (
            <div className="gym-card p-4 p-sm-5">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
                <div>
                  <span className="badge badge-lime text-uppercase mb-2">
                    {workoutPlan.schedule[activeDayIndex].day} Routine
                  </span>
                  <h3 className="font-heading fw-extrabold text-white mb-1">
                    {workoutPlan.schedule[activeDayIndex].title}
                  </h3>
                  {workoutPlan.schedule[activeDayIndex].guidance && (
                    <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                      <Info size={16} className="text-lime" />
                      <span>{workoutPlan.schedule[activeDayIndex].guidance}</span>
                    </p>
                  )}
                </div>

                <div className="bg-dark-custom px-3 py-2 rounded-3 border border-secondary text-lime small fw-bold">
                  Target Program: {fitnessGoal}
                </div>
              </div>

              {/* Exercises List */}
              <h5 className="font-heading fw-bold text-white mb-3">Prescribed Exercises & Rest Intervals</h5>

              <div className="row g-3">
                {workoutPlan.schedule[activeDayIndex].exercises.map((ex, exIdx) => (
                  <div key={exIdx} className="col-md-6">
                    <div className="bg-dark-custom p-4 rounded-3 border border-secondary h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="bg-lime text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}>
                            {exIdx + 1}
                          </span>
                          <h6 className="font-heading fw-bold text-white mb-0 fs-5">{ex.name}</h6>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary small">
                        <span className="text-lime fw-bold">Sets & Reps: {ex.setsReps}</span>
                        <span className="text-muted d-flex align-items-center gap-1">
                          <Clock size={14} />
                          <span>Rest: {ex.rest}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Workouts;
