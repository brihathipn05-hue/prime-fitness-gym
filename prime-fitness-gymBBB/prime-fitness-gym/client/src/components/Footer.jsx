import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-custom text-white border-top border-secondary pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-lime p-2 rounded-3">
                <Dumbbell size={24} className="text-dark" />
              </div>
              <span className="font-heading fs-3 fw-bold">
                PRIME<span className="text-lime">FITNESS</span>
              </span>
            </div>
            <p className="text-muted pe-lg-3">
              Prime Fitness Gym is a premier fitness center dedicated to helping you achieve your health, strength, and transformation goals with state-of-the-art facilities, certified trainers, and personalized programs.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="bg-card-custom p-2 rounded-circle text-lime hover-grow" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-card-custom p-2 rounded-circle text-lime hover-grow" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-card-custom p-2 rounded-circle text-lime hover-grow" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-card-custom p-2 rounded-circle text-lime hover-grow" aria-label="Youtube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="font-heading text-lime mb-3">Quick Links</h5>
            <ul className="list-unstyled text-muted d-flex flex-column gap-2">
              <li><Link to="/" className="text-muted text-decoration-none hover-lime">Home</Link></li>
              <li><a href="#about" className="text-muted text-decoration-none hover-lime">About Us</a></li>
              <li><a href="#services" className="text-muted text-decoration-none hover-lime">Services</a></li>
              <li><a href="#plans" className="text-muted text-decoration-none hover-lime">Membership Plans</a></li>
              <li><Link to="/register" className="text-muted text-decoration-none hover-lime">Join Gym</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none hover-lime">Member Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="font-heading text-lime mb-3">Gym Operating Hours</h5>
            <ul className="list-unstyled text-muted d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-lime" />
                <span>Mon - Sat: 5:00 AM - 10:00 PM</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-lime" />
                <span>Sunday: 6:00 AM - 1:00 PM</span>
              </li>
              <li className="mt-2 text-lime font-heading fw-semibold">
                Attendance Check-in Time:
              </li>
              <li className="small">Daily during operational hours.</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="font-heading text-lime mb-3">Contact Us</h5>
            <ul className="list-unstyled text-muted d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={20} className="text-lime flex-shrink-0 mt-1" />
                <span>123 Fitness Boulevard, Health District, Metro City - 400001</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={18} className="text-lime flex-shrink-0" />
                <span>+91 98765 43210 / 022-25001234</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={18} className="text-lime flex-shrink-0" />
                <span>support@primefitnessgym.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-muted small">
          <div>
            &copy; {new Date().getFullYear()} Prime Fitness Gym Management System. All rights reserved.
          </div>
          <div>
            Built with MERN Stack (React, Node.js, Express, MongoDB Atlas)
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
