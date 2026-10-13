import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  Calculator,
  Scale,
  Ruler,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Target,
} from 'lucide-react';

const BMI = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCurrentBMI();
  }, []);

  const fetchCurrentBMI = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/profile');
      if (res.data.success && res.data.profile) {
        const p = res.data.profile;
        if (p.height) setHeight(p.height);
        if (p.weight) setWeight(p.weight);

        if (p.bmi) {
          setResult({
            bmi: p.bmi,
            category: getCategoryName(p.bmi),
            recommendedGoal: getGoalName(p.bmi),
            confirmedGoal: p.fitnessGoal || getGoalName(p.bmi),
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25.0) return 'Normal Weight';
    if (bmi >= 25.0 && bmi < 30.0) return 'Overweight';
    return 'Obese';
  };

  const getGoalName = (bmi) => {
    if (bmi < 18.5) return 'Weight Gain';
    if (bmi >= 18.5 && bmi < 25.0) return 'Fitness';
    return 'Weight Loss';
  };

  const handleCalculate = async (e, goalToConfirm = null) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!height || !weight || Number(height) <= 0 || Number(weight) <= 0) {
      setError('Please enter valid positive height and weight values');
      return;
    }

    setCalculating(true);
    try {
      const res = await api.post('/api/bmi', {
        height,
        weight,
        confirmGoal: goalToConfirm,
      });

      if (res.data.success) {
        setResult(res.data);
        if (goalToConfirm) {
          setSuccess(`Fitness goal '${goalToConfirm}' confirmed & saved to database! Workout and diet plans updated.`);
        } else {
          setSuccess('BMI calculated successfully! Confirm your goal below.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate BMI');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) return <Loading text="Loading BMI Calculator..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div className="bg-lime p-3 rounded-3 text-dark">
          <Calculator size={28} />
        </div>
        <div>
          <h2 className="font-heading fw-bold mb-1 text-white">BMI CALCULATOR & FITNESS GOAL</h2>
          <p className="text-muted small mb-0">Determine your Body Mass Index (BMI) & unlock custom workout/diet plans</p>
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

      <div className="row g-4">
        {/* Calculator Inputs Form */}
        <div className="col-lg-6">
          <div className="gym-card p-4 p-sm-5 h-100">
            <h4 className="font-heading fw-bold mb-4">Enter Body Measurements</h4>

            <form onSubmit={(e) => handleCalculate(e, null)}>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold text-uppercase">Height (Centimeters)</label>
                <div className="position-relative">
                  <input
                    type="number"
                    step="0.1"
                    className="form-control form-control-dark ps-5"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                  <Ruler size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold text-uppercase">Weight (Kilograms)</label>
                <div className="position-relative">
                  <input
                    type="number"
                    step="0.1"
                    className="form-control form-control-dark ps-5"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                  <Scale size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <button
                type="submit"
                disabled={calculating}
                className="btn btn-lime w-100 py-3 font-heading fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                <Calculator size={18} />
                <span>{calculating ? 'Calculating...' : 'Calculate BMI Score'}</span>
              </button>
            </form>

            <div className="bg-dark-custom p-3 rounded-3 border border-secondary text-muted small mt-4">
              <ShieldAlert size={18} className="text-warning mb-2" />
              <div>
                <strong>Medical Disclaimer:</strong> BMI is a general screening indicator for adult body mass, not a clinical diagnostic tool. Muscle mass and athletic density may affect score classifications.
              </div>
            </div>
          </div>
        </div>

        {/* Results & Goal Confirmation */}
        <div className="col-lg-6">
          <div className="gym-card p-4 p-sm-5 h-100 d-flex flex-column justify-content-between">
            <div>
              <h4 className="font-heading fw-bold mb-4">BMI Results & Recommendation</h4>

              {!result ? (
                <div className="text-center text-muted p-4 bg-dark-custom rounded-3 border border-secondary">
                  <Calculator size={36} className="mb-2 text-lime opacity-50" />
                  <p className="mb-0">Enter your height and weight on the left to view your BMI score.</p>
                </div>
              ) : (
                <>
                  <div className="bg-dark-custom p-4 rounded-3 border border-lime text-center mb-4 shadow-lg">
                    <div className="text-muted small text-uppercase fw-bold mb-1">Calculated Score</div>
                    <div className="display-4 font-heading fw-extrabold text-lime mb-1">{result.bmi}</div>
                    <div className="fs-5 font-heading fw-bold text-white mb-2">{result.category}</div>
                    <span className="badge badge-lime text-uppercase">Recommended Goal: {result.recommendedGoal}</span>
                  </div>

                  <div className="mb-4">
                    <h6 className="font-heading fw-bold text-white mb-2">Adult BMI Reference Ranges:</h6>
                    <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
                      <li className={result.category === 'Underweight' ? 'text-lime fw-bold' : ''}>
                        • Underweight: BMI less than 18.5
                      </li>
                      <li className={result.category === 'Normal Weight' ? 'text-lime fw-bold' : ''}>
                        • Normal Weight: BMI 18.5 to 24.9
                      </li>
                      <li className={result.category === 'Overweight' ? 'text-lime fw-bold' : ''}>
                        • Overweight: BMI 25.0 to 29.9
                      </li>
                      <li className={result.category === 'Obese' ? 'text-lime fw-bold' : ''}>
                        • Obese: BMI 30.0 or higher
                      </li>
                    </ul>
                  </div>

                  <div className="bg-dark-custom p-3 rounded-3 border border-secondary mb-4">
                    <div className="text-muted small mb-1">Confirmed Goal in Database:</div>
                    <div className="fw-bold text-white fs-6 d-flex align-items-center gap-2">
                      <Target size={18} className="text-lime" />
                      <span>{result.confirmedGoal}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {result && (
              <button
                onClick={() => handleCalculate(null, result.recommendedGoal)}
                disabled={calculating}
                className="btn btn-lime w-100 py-3 font-heading fw-bold d-flex align-items-center justify-content-center gap-2 mt-auto"
              >
                <CheckCircle size={20} />
                <span>Confirm Fitness Goal ({result.recommendedGoal})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMI;
