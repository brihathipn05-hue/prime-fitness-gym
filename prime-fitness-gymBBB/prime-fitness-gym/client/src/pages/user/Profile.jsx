import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import api from '../../api/axios';
import {
  User,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Phone,
  Ruler,
  Scale,
  Activity,
} from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [profile, setProfile] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bloodGroup: '',
    phone: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/profile');
      if (res.data.success) {
        const p = res.data.profile;
        const m = res.data.member;
        setProfile(p);
        setMember(m);

        setFormData({
          fullName: res.data.user.name || '',
          age: p.age || m?.age || '',
          gender: p.gender || m?.gender || 'Male',
          height: p.height || m?.height || '',
          weight: p.weight || m?.weight || '',
          bloodGroup: p.bloodGroup || m?.bloodGroup || '',
          phone: p.phone || m?.phone || '',
        });

        if (p.photoUrl) setPhotoPreview(p.photoUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        setError('Please select a valid image file (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('age', formData.age);
      data.append('gender', formData.gender);
      data.append('height', formData.height);
      data.append('weight', formData.weight);
      data.append('bloodGroup', formData.bloodGroup);
      data.append('phone', formData.phone);

      if (photoFile) {
        data.append('photo', photoFile);
      }

      const res = await api.post('/api/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSuccess('Profile updated successfully');
        if (res.data.user && setUser) {
          setUser(res.data.user);
        }
        setProfile(res.data.profile);
        setMember(res.data.member);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Loading profile..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div className="bg-lime p-3 rounded-3 text-dark">
          <User size={28} />
        </div>
        <div>
          <h2 className="font-heading fw-bold mb-1 text-white">MY MEMBER PROFILE</h2>
          <p className="text-muted small mb-0">View and update your personal health parameters and photo</p>
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
        {/* Profile Card Summary */}
        <div className="col-lg-4">
          <div className="gym-card p-4 text-center">
            <div className="position-relative d-inline-block mb-3">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt={user.name}
                  className="rounded-circle border border-lime p-1 shadow-lg"
                  style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-lime text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-1 shadow-lg" style={{ width: '130px', height: '130px' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <label
                htmlFor="photoUpload"
                className="position-absolute bottom-0 end-0 bg-dark text-lime p-2 rounded-circle border border-lime cursor-pointer hover-grow"
                title="Upload Photo"
              >
                <Camera size={18} />
              </label>
              <input
                type="file"
                id="photoUpload"
                className="d-none"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>

            <h4 className="font-heading fw-bold text-white mb-1">{formData.fullName || user.name}</h4>
            <p className="text-muted small mb-3">{user.email}</p>

            <div className="mb-3">
              <span className="badge badge-lime me-2">{member?.membershipPlan || 'Standard'} Plan</span>
              <span className={`badge ${member?.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                {member?.status || 'Active'}
              </span>
            </div>

            <hr className="border-secondary my-3" />

            <div className="bg-dark-custom p-3 rounded-3 border border-secondary text-start small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Current BMI:</span>
                <span className="fw-bold text-lime">{profile?.bmi || 'Not Set'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Fitness Goal:</span>
                <span className="fw-bold text-white">{profile?.fitnessGoal || 'Not Set'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="col-lg-8">
          <div className="gym-card p-4 p-sm-5">
            <h4 className="font-heading fw-bold mb-4">Edit Personal Information</h4>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control form-control-dark"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control form-control-dark"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold text-uppercase">Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control form-control-dark"
                    placeholder="e.g. 25"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold text-uppercase">Gender</label>
                  <select
                    name="gender"
                    className="form-select form-select-dark"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold text-uppercase">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    className="form-control form-control-dark"
                    placeholder="e.g. O+"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase">Height (Centimeters)</label>
                  <input
                    type="number"
                    name="height"
                    className="form-control form-control-dark"
                    placeholder="e.g. 175"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase">Weight (Kilograms)</label>
                  <input
                    type="number"
                    name="weight"
                    className="form-control form-control-dark"
                    placeholder="e.g. 70"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary text-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-lime px-4 py-2 font-heading fw-bold d-inline-flex align-items-center gap-2"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
