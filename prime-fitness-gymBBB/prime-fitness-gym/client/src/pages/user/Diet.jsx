import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  Utensils,
  Flame,
  Droplet,
  Clock,
  AlertTriangle,
  CheckCircle,
  Leaf,
  ShieldAlert,
} from 'lucide-react';

const Diet = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const fetchDietPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/diet');
      if (res.data.success) {
        setDietPlan(res.data.dietPlan);
        setFitnessGoal(res.data.fitnessGoal);
        setDisclaimer(res.data.disclaimer);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load diet plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading nutrition diet plan..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div className="bg-lime p-3 rounded-3 text-dark">
          <Utensils size={28} />
        </div>
        <div>
          <h2 className="font-heading fw-bold mb-1 text-white">PERSONALIZED NUTRITION & DIET PLAN</h2>
          <p className="text-muted small mb-0">Customized meal targets for goal: <span className="text-lime fw-bold">{fitnessGoal || 'Not Set'}</span></p>
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
      ) : !dietPlan ? (
        <div className="text-muted">No diet plan available.</div>
      ) : (
        <>
          {/* Nutrition Summary Bar */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="gym-card p-4 d-flex align-items-center gap-3">
                <div className="bg-lime p-3 rounded-3 text-dark">
                  <Flame size={24} />
                </div>
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Daily Calorie Target</div>
                  <h3 className="font-heading fw-bold text-white mb-0">{dietPlan.calorieTarget} kcal</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="gym-card p-4 d-flex align-items-center gap-3">
                <div className="bg-info bg-opacity-25 text-info p-3 rounded-3">
                  <Utensils size={24} />
                </div>
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Daily Protein Target</div>
                  <h3 className="font-heading fw-bold text-white mb-0">{dietPlan.proteinTarget}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="gym-card p-4 d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-25 text-primary p-3 rounded-3">
                  <Droplet size={24} />
                </div>
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Daily Water Target</div>
                  <h3 className="font-heading fw-bold text-white mb-0">{dietPlan.waterTarget}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Cards */}
          <h4 className="font-heading fw-bold text-white mb-3">Daily Meal Schedule</h4>

          <div className="row g-4 mb-4">
            {dietPlan.meals.map((meal, idx) => (
              <div key={idx} className="col-md-6">
                <div className="gym-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="font-heading fw-bold text-white mb-0">{meal.name}</h5>
                      <span className="badge badge-lime d-flex align-items-center gap-1">
                        <Clock size={12} />
                        <span>{meal.timing}</span>
                      </span>
                    </div>

                    <div className="bg-dark-custom p-3 rounded-3 border border-secondary mb-3">
                      <div className="text-muted small mb-2 fw-bold text-uppercase">Suggested Foods:</div>
                      <ul className="list-unstyled mb-0 d-flex flex-column gap-1 small text-white">
                        {meal.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="d-flex align-items-start gap-2">
                            <span className="text-lime">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {meal.vegAlternative && (
                      <div className="bg-success bg-opacity-10 p-3 rounded-3 border border-success mb-3 small text-success">
                        <div className="fw-bold d-flex align-items-center gap-1 mb-1">
                          <Leaf size={14} />
                          <span>Vegetarian Alternative:</span>
                        </div>
                        <div>{meal.vegAlternative}</div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary small text-muted">
                    <span>Approx. Energy: <strong className="text-lime">{meal.calories} kcal</strong></span>
                    <span>Protein: <strong className="text-white">{meal.protein}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer Box */}
          <div className="gym-card p-4 border-warning bg-warning bg-opacity-10 text-warning small">
            <div className="d-flex align-items-start gap-2">
              <ShieldAlert size={20} className="flex-shrink-0 mt-1" />
              <div>
                <strong>Wellness Disclaimer:</strong> {disclaimer || 'Sample general wellness plan. Consult a medical professional before starting any dietary regimen.'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Diet;
