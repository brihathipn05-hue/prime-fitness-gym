import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Flame, Users, CalendarCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-wrapper text-white py-5">
      <div className="container py-lg-5">
        <div className="row align-items-center">
          <div className="col-lg-8 col-xl-7">
            <div className="d-inline-flex align-items-center gap-2 bg-card-custom px-3 py-2 rounded-pill mb-4 border border-secondary">
              <Flame size={18} className="text-lime" />
              <span className="small text-uppercase fw-bold text-lime">Transform Your Body & Mind</span>
            </div>

            <h1 className="display-3 fw-extrabold font-heading text-uppercase mb-3 lh-1">
              BUILD YOUR <span className="text-lime">ULTIMATE</span> BODY AT PRIME FITNESS
            </h1>

            <p className="lead text-muted mb-4 pe-lg-4">
              Experience world-class gym facilities, personalized 7-day workout schedules, custom nutritionist diet plans, instant daily attendance tracking, and dedicated coaching.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <Link to="/register" className="btn btn-lime btn-lg px-4 py-3 fs-6">
                Join Gym Now
              </Link>
              <Link to="/login" className="btn btn-outline-lime btn-lg px-4 py-3 fs-6">
                Member Login
              </Link>
            </div>

            <div className="row g-3 pt-3 border-top border-secondary">
              <div className="col-4">
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={24} className="text-lime" />
                  <div>
                    <h6 className="mb-0 fw-bold">100% Certified</h6>
                    <small className="text-muted">Master Trainers</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center gap-2">
                  <Users size={24} className="text-lime" />
                  <div>
                    <h6 className="mb-0 fw-bold">1,500+</h6>
                    <small className="text-muted">Active Members</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center gap-2">
                  <CalendarCheck size={24} className="text-lime" />
                  <div>
                    <h6 className="mb-0 fw-bold">Smart Attendance</h6>
                    <small className="text-muted">Instant Check-in</small>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
