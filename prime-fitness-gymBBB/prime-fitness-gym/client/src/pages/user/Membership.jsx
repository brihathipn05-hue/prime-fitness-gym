import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  CreditCard,
  Check,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const Membership = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/profile');
      if (res.data.success) {
        setMember(res.data.member);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading membership details..." />;

  let daysRemaining = 0;
  if (member?.endDate) {
    const diff = new Date(member.endDate) - new Date();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const benefitsMap = {
    Standard: [
      'Full Gym & Cardio Floor Access',
      'Basic Fitness Assessment',
      'Locker & Shower Facility',
      'Standard Workout Schedule',
      'Attendance Tracking System',
    ],
    Premium: [
      'Everything in Standard Plan',
      'Personalized 7-Day Workout Plan',
      'Custom Nutrition & Diet Chart',
      'All Group Fitness & Yoga Classes',
      'Monthly BMI & Body Fat Analysis',
      'Steam & Sauna Bath Access',
    ],
    VIP: [
      'Everything in Premium Plan',
      'Dedicated Personal Trainer (3x/wk)',
      'Priority Trainer Assistance',
      'Free Protein Shake per Session',
      'Guest Pass (2/month)',
      'VIP Locker & Gear Care',
    ],
  };

  const currentPlan = member?.membershipPlan || 'Standard';
  const benefits = benefitsMap[currentPlan] || benefitsMap.Standard;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div className="bg-lime p-3 rounded-3 text-dark">
          <CreditCard size={28} />
        </div>
        <div>
          <h2 className="font-heading fw-bold mb-1 text-white">MY GYM MEMBERSHIP</h2>
          <p className="text-muted small mb-0">Active plan status, renewal details, and included features</p>
        </div>
      </div>

      {!member ? (
        <div className="gym-card p-5 text-center text-muted">
          <AlertTriangle size={40} className="mb-3 text-warning" />
          <h5>No Membership Assigned</h5>
          <p className="small mb-0">Please contact gym administration to assign a membership plan to your account.</p>
        </div>
      ) : (
        <div className="row g-4">
          {/* Active Plan Card */}
          <div className="col-lg-7">
            <div className="gym-card p-4 p-sm-5 border-lime shadow-lg position-relative overflow-hidden">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className="badge badge-lime text-uppercase px-3 py-2">
                  <Sparkles size={14} className="me-1" />
                  Active Gym Plan
                </span>
                <span className={`badge ${member.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                  {member.status}
                </span>
              </div>

              <h2 className="display-5 font-heading fw-extrabold text-white mb-2">{member.membershipPlan} Plan</h2>
              <p className="text-muted mb-4">Official Prime Fitness Member Subscription</p>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                    <div className="text-muted small">Start Date</div>
                    <div className="fw-bold text-white fs-6">
                      {new Date(member.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-dark-custom p-3 rounded-3 border border-secondary">
                    <div className="text-muted small">End Expiry Date</div>
                    <div className="fw-bold text-white fs-6">
                      {new Date(member.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="bg-dark-custom p-3 rounded-3 border border-secondary d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Subscription Remaining</div>
                      <div className="font-heading fw-extrabold text-lime fs-4">{daysRemaining} Days Left</div>
                    </div>
                    <Clock size={28} className="text-lime opacity-75" />
                  </div>
                </div>
              </div>

              {daysRemaining <= 7 && (
                <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning small mb-0">
                  <AlertTriangle size={18} className="me-2" />
                  Your membership is expiring soon. Visit the front desk to extend your duration!
                </div>
              )}
            </div>
          </div>

          {/* Included Features */}
          <div className="col-lg-5">
            <div className="gym-card p-4 p-sm-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 className="font-heading fw-bold mb-3 text-white">Included Plan Benefits</h4>
                <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                  {benefits.map((b, i) => (
                    <li key={i} className="d-flex align-items-center gap-2">
                      <div className="bg-lime p-1 rounded-circle text-dark flex-shrink-0">
                        <Check size={14} />
                      </div>
                      <span className="small text-white">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-dark-custom p-3 rounded-3 border border-secondary text-muted small mt-auto">
                <strong>Note:</strong> Membership plans, benefits, and tenure are managed directly by gym administration.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
