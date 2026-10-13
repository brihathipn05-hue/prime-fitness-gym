import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import { Check, Star, Dumbbell, Zap, HeartPulse, Trophy, Shield, Users } from 'lucide-react';

const Home = ({ user, onLogout }) => {
  const services = [
    {
      icon: Dumbbell,
      title: 'Heavy Strength & Powerlifting',
      desc: 'Olympic barbells, custom squat racks, dumbell range up to 50kg, and powerlifting platforms.',
    },
    {
      icon: HeartPulse,
      title: 'Advanced Cardio Zone',
      desc: 'Interactive treadmills, stairmasters, rowing machines, and spin bikes with live heart rate sync.',
    },
    {
      icon: Zap,
      title: 'HIIT & Functional Turf',
      desc: 'Sled tracks, kettlebells, battle ropes, plyo boxes, and explosive conditioning circuits.',
    },
    {
      icon: Trophy,
      title: 'Personalized Fitness Plans',
      desc: 'Automated 7-day workout schedules & custom diet guidelines based on your BMI calculations.',
    },
    {
      icon: Shield,
      title: 'Recovery & Locker Rooms',
      desc: 'Steam bath, infrared sauna, climate-controlled digital lockers, and protein smoothie bar.',
    },
    {
      icon: Users,
      title: 'Group Fitness Classes',
      desc: 'Daily energetic sessions for Zumba, CrossFit, BodyPump, Yoga flow, and Spin cycling.',
    },
  ];

  const plans = [
    {
      name: 'Standard',
      price: '₹1,499',
      period: '/ month',
      badge: 'Popular for Beginners',
      description: 'Essential gym access with complete equipment and basic workout support.',
      features: [
        'Full Gym & Cardio Floor Access',
        'Basic Fitness Assessment',
        'Locker & Shower Facility',
        'Standard Workout Schedule',
        'Attendance Tracking System',
      ],
      isPopular: false,
    },
    {
      name: 'Premium',
      price: '₹2,999',
      period: '/ month',
      badge: 'Most Popular',
      description: 'Comprehensive fitness experience with customized diet plans & group classes.',
      features: [
        'Everything in Standard Plan',
        'Personalized 7-Day Workout Plan',
        'Custom Nutrition & Diet Chart',
        'All Group Fitness & Yoga Classes',
        'Monthly BMI & Body Fat Analysis',
        'Steam & Sauna Bath Access',
      ],
      isPopular: true,
    },
    {
      name: 'VIP',
      price: '₹4,999',
      period: '/ month',
      badge: 'Ultimate Elite Access',
      description: 'VIP treatment with 1-on-1 dedicated personal trainer & priority perks.',
      features: [
        'Everything in Premium Plan',
        'Dedicated Personal Trainer (3x/wk)',
        'Priority Trainer Assistance',
        'Free Protein Shake per Session',
        'Guest Pass (2/month)',
        'VIP Locker & Gear Care',
      ],
      isPopular: false,
    },
  ];

  const trainers = [
    {
      name: 'Vikram Singh',
      role: 'Head Strength & Conditioning Coach',
      img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
      spec: 'Bodybuilding, Powerlifting & Hypertrophy',
    },
    {
      name: 'Ananya Roy',
      role: 'CrossFit & HIIT Specialist',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
      spec: 'Fat Loss, Endurance & Athletic Conditioning',
    },
    {
      name: 'Rohan Mehta',
      role: 'Nutritionist & Functional Coach',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
      spec: 'Dietetics, Calisthenics & Core Transformation',
    },
  ];

  const testimonials = [
    {
      quote: "Prime Fitness Gym completely transformed my lifestyle! Lost 14 kg in 4 months following their customized workout schedule and Indian vegetarian diet plan.",
      author: "Amit Sharma",
      role: "Member since 2025",
    },
    {
      quote: "The attendance check-in system and BMI progress tracker keep me accountable every day. State-of-the-art machines and super clean environment!",
      author: "Sneha Kapadia",
      role: "Premium Member",
    },
    {
      quote: "Best gym in the city for serious lifters and beginners alike. Trainers are extremely helpful and knowledgeable!",
      author: "Rajesh Kulkarni",
      role: "VIP Member",
    },
  ];

  return (
    <div className="bg-dark-custom min-vh-100 d-flex flex-column text-white">
      <Header user={user} onLogout={onLogout} />

      <main className="flex-grow-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <section id="services" className="py-5 bg-card-custom border-top border-bottom border-secondary">
          <div className="container py-4">
            <div className="text-center mb-5">
              <span className="badge badge-lime text-uppercase mb-2 px-3 py-2">World-Class Facilities</span>
              <h2 className="display-5 font-heading fw-bold">OUR GYM <span className="text-lime">SERVICES</span></h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
                We provide everything you need to reach peak physical condition with top-tier equipment and expert coaching.
              </p>
            </div>

            <div className="row g-4">
              {services.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div className="gym-card p-4 h-100 d-flex flex-column">
                      <div className="bg-lime p-3 rounded-3 d-inline-block text-dark mb-3 align-self-start">
                        <Icon size={26} />
                      </div>
                      <h4 className="font-heading fw-bold mb-2">{item.title}</h4>
                      <p className="text-muted mb-0 flex-grow-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-5">
          <div className="container py-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1000"
                    alt="Prime Fitness Gym Interior"
                    className="img-fluid rounded-4 shadow-lg border border-secondary"
                  />
                  <div className="position-absolute bottom-0 end-0 bg-lime text-dark p-4 rounded-4 m-3 font-heading fw-bold shadow-lg d-none d-sm-block">
                    <div className="fs-2 lh-1">10+ YEARS</div>
                    <small className="text-uppercase fw-extrabold">Of Fitness Excellence</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <span className="badge badge-lime text-uppercase mb-2 px-3 py-2">About Prime Fitness</span>
                <h2 className="display-5 font-heading fw-bold mb-4">
                  WHERE DISCIPLINE MEETS <span className="text-lime">RESULTS</span>
                </h2>
                <p className="text-muted mb-3 fs-6">
                  Founded with a vision to revolutionize fitness management, Prime Fitness Gym combines elite training infrastructure with intelligent digital management. Whether your goal is body fat reduction, muscle hypertrophy, or athletic conditioning, our structured approach ensures continuous progress.
                </p>
                <p className="text-muted mb-4 fs-6">
                  We empower our members with personalized 7-day workout plans, science-based diet guidance, instant daily check-in attendance tracking, and BMI-driven fitness goal updates.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="border-start border-3 border-lime ps-3">
                      <h4 className="font-heading fw-bold mb-0 text-lime">10,000+ sq.ft</h4>
                      <small className="text-muted">Spacious Gym Floor</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border-start border-3 border-lime ps-3">
                      <h4 className="font-heading fw-bold mb-0 text-lime">100% Digital</h4>
                      <small className="text-muted">Attendance & Tracking</small>
                    </div>
                  </div>
                </div>

                <Link to="/register" className="btn btn-lime px-4 py-3">
                  Become a Member Today
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Plans Section */}
        <section id="plans" className="py-5 bg-card-custom border-top border-bottom border-secondary">
          <div className="container py-4">
            <div className="text-center mb-5">
              <span className="badge badge-lime text-uppercase mb-2 px-3 py-2">Transparent Pricing</span>
              <h2 className="display-5 font-heading fw-bold">MEMBERSHIP <span className="text-lime">PLANS</span></h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Choose the plan that best fits your fitness goal. (Illustrative sample gym pricing)
              </p>
            </div>

            <div className="row g-4 justify-content-center">
              {plans.map((plan, index) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className={`gym-card p-4 h-100 d-flex flex-column position-relative ${plan.isPopular ? 'border-lime shadow-lg' : ''}`}>
                    {plan.isPopular && (
                      <div className="position-absolute top-0 end-0 bg-lime text-dark fw-bold px-3 py-1 rounded-bl-3 rounded-tr-3 font-heading small text-uppercase">
                        Most Popular
                      </div>
                    )}
                    <span className="text-muted small fw-bold text-uppercase">{plan.badge}</span>
                    <h3 className="font-heading fw-bold text-white mt-1 mb-3">{plan.name}</h3>

                    <div className="d-flex align-items-baseline mb-3">
                      <span className="display-5 font-heading fw-extrabold text-lime">{plan.price}</span>
                      <span className="text-muted ms-2">{plan.period}</span>
                    </div>

                    <p className="text-muted small mb-4">{plan.description}</p>

                    <ul className="list-unstyled d-flex flex-column gap-3 mb-4 flex-grow-1">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="d-flex align-items-center gap-2 small">
                          <Check size={18} className="text-lime flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/register"
                      className={`btn w-100 py-3 font-heading fw-bold mt-auto ${plan.isPopular ? 'btn-lime' : 'btn-outline-lime'}`}
                    >
                      Join {plan.name} Plan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trainers Section */}
        <section id="trainers" className="py-5">
          <div className="container py-4">
            <div className="text-center mb-5">
              <span className="badge badge-lime text-uppercase mb-2 px-3 py-2">Expert Team</span>
              <h2 className="display-5 font-heading fw-bold">MEET OUR <span className="text-lime">TRAINERS</span></h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Our certified personal coaches bring years of experience to help you train safely and effectively.
              </p>
            </div>

            <div className="row g-4">
              {trainers.map((trainer, tIdx) => (
                <div key={tIdx} className="col-md-4">
                  <div className="gym-card overflow-hidden h-100">
                    <img
                      src={trainer.img}
                      alt={trainer.name}
                      className="w-100"
                      style={{ height: '320px', objectFit: 'cover', objectPosition: 'top' }}
                    />
                    <div className="p-4 text-center">
                      <h4 className="font-heading fw-bold mb-1">{trainer.name}</h4>
                      <div className="text-lime small fw-bold mb-2">{trainer.role}</div>
                      <p className="text-muted small mb-0">{trainer.spec}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-5 bg-card-custom border-top border-secondary">
          <div className="container py-4">
            <div className="text-center mb-5">
              <span className="badge badge-lime text-uppercase mb-2 px-3 py-2">Success Stories</span>
              <h2 className="display-5 font-heading fw-bold">WHAT OUR <span className="text-lime">MEMBERS SAY</span></h2>
            </div>

            <div className="row g-4">
              {testimonials.map((test, idx) => (
                <div key={idx} className="col-md-4">
                  <div className="gym-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex gap-1 text-warning mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-muted fst-italic mb-4">"{test.quote}"</p>
                    </div>
                    <div className="border-top border-secondary pt-3">
                      <h6 className="font-heading fw-bold mb-0 text-white">{test.author}</h6>
                      <small className="text-lime">{test.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
