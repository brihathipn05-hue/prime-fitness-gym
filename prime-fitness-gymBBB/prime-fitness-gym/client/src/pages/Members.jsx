import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Loading from '../components/Loading';
import api from '../api/axios';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
} from 'lucide-react';

const Members = ({ user, onLogout }) => {
  const [searchParams] = useSearchParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState(searchParams.get('plan') || 'All');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form State
  const initialFormState = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bloodGroup: '',
    membershipPlan: 'Standard',
    startDate: new Date().toISOString().split('T')[0],
    durationMonths: 1,
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchMembers();
  }, [search, planFilter, statusFilter, sortBy, sortOrder]);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/members', {
        params: {
          search,
          plan: planFilter,
          status: statusFilter,
          sortBy,
          sortOrder,
        },
      });
      if (res.data.success) {
        setMembers(res.data.members);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch members list');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Full Name and Email Address are required');
      return;
    }

    try {
      const res = await api.post('/api/members', formData);
      if (res.data.success) {
        setSuccess('New gym member added successfully');
        setShowAddModal(false);
        setFormData(initialFormState);
        fetchMembers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add new member');
    }
  };

  const handleEditOpen = (member) => {
    setSelectedMember(member);
    setFormData({
      fullName: member.fullName || '',
      email: member.email || '',
      phone: member.phone || '',
      age: member.age || '',
      gender: member.gender || 'Male',
      height: member.height || '',
      weight: member.weight || '',
      bloodGroup: member.bloodGroup || '',
      membershipPlan: member.membershipPlan || 'Standard',
      startDate: member.startDate ? new Date(member.startDate).toISOString().split('T')[0] : '',
      durationMonths: member.durationMonths || 1,
      status: member.status || 'Active',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Full Name and Email Address are required');
      return;
    }

    try {
      const res = await api.put(`/api/members/${selectedMember._id}`, formData);
      if (res.data.success) {
        setSuccess('Member record updated successfully');
        setShowEditModal(false);
        fetchMembers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.delete(`/api/members/${selectedMember._id}`);
      if (res.data.success) {
        setSuccess('Member account and related records deleted successfully');
        setShowDeleteModal(false);
        setSelectedMember(null);
        fetchMembers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member');
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-dark-custom min-vh-100 text-white container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2">
          <Sidenav role="admin" user={user} onLogout={onLogout} />
        </div>

        <div className="col-md-9 col-lg-10 p-4 p-md-5">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h2 className="font-heading fw-bold mb-1 text-white">MEMBERS MANAGEMENT</h2>
              <p className="text-muted small mb-0">View, search, filter, sort, add, update, and manage all gym member profiles</p>
            </div>

            <button
              onClick={() => {
                setFormData(initialFormState);
                setShowAddModal(true);
              }}
              className="btn btn-lime d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              <span>Add New Member</span>
            </button>
          </div>

          {/* Feedback Alerts */}
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

          {/* Search, Filter & Sort Bar */}
          <div className="gym-card p-3 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-dark ps-5"
                    placeholder="Search by name, email, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <div className="col-sm-6 col-md-3">
                <select
                  className="form-select form-select-dark"
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value="All">All Membership Plans</option>
                  <option value="Standard">Standard Plan</option>
                  <option value="Premium">Premium Plan</option>
                  <option value="VIP">VIP Plan</option>
                </select>
              </div>

              <div className="col-sm-6 col-md-3">
                <select
                  className="form-select form-select-dark"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Membership Statuses</option>
                  <option value="Active">Active Status</option>
                  <option value="Inactive">Inactive Status</option>
                  <option value="Cancelled">Cancelled Status</option>
                  <option value="Expired">Expired Status</option>
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select form-select-dark"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Sort: Registration</option>
                  <option value="fullName">Sort: Name</option>
                  <option value="startDate">Sort: Start Date</option>
                  <option value="endDate">Sort: Expiry Date</option>
                  <option value="membershipPlan">Sort: Plan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          {loading ? (
            <Loading text="Loading Members Data..." />
          ) : members.length === 0 ? (
            <div className="gym-card p-5 text-center my-4 text-muted">
              <Users size={40} className="mb-3 text-lime opacity-50" />
              <h5>No Members Found</h5>
              <p className="small mb-0">Try changing your search keywords or filter options.</p>
            </div>
          ) : (
            <div className="gym-card p-4">
              <div className="table-responsive">
                <table className="table table-dark-custom mb-0">
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('fullName')}>
                        Member Name <ArrowUpDown size={14} className="ms-1 opacity-75" />
                      </th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('membershipPlan')}>
                        Plan <ArrowUpDown size={14} className="ms-1 opacity-75" />
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('startDate')}>
                        Start Date <ArrowUpDown size={14} className="ms-1 opacity-75" />
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('endDate')}>
                        End Date <ArrowUpDown size={14} className="ms-1 opacity-75" />
                      </th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m._id}>
                        <td className="fw-bold text-white">{m.fullName}</td>
                        <td>{m.email}</td>
                        <td>{m.phone || 'N/A'}</td>
                        <td>
                          <span className="badge badge-lime">{m.membershipPlan}</span>
                        </td>
                        <td>{new Date(m.startDate).toLocaleDateString()}</td>
                        <td>{new Date(m.endDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              m.status === 'Active'
                                ? 'badge-active'
                                : m.status === 'Inactive'
                                ? 'badge-inactive'
                                : 'badge-expired'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Link
                              to={`/admin/members/${m._id}`}
                              className="btn btn-sm btn-dark-card"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link>
                            <button
                              onClick={() => handleEditOpen(m)}
                              className="btn btn-sm btn-outline-lime"
                              title="Edit Member"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMember(m);
                                setShowDeleteModal(true);
                              }}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-card-custom border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-heading fw-bold">
                  {showAddModal ? 'Add New Gym Member' : 'Edit Member Details'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                ></button>
              </div>

              <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit}>
                <div className="modal-body p-4">
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
                      <label className="form-label text-muted small fw-bold text-uppercase">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-dark"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {showAddModal && (
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold text-uppercase">Initial Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-dark"
                          placeholder="Defaults to MemberPass123!"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control form-control-dark"
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
                        placeholder="e.g. O+, B+"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        className="form-control form-control-dark"
                        value={formData.height}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        className="form-control form-control-dark"
                        value={formData.weight}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Membership Plan</label>
                      <select
                        name="membershipPlan"
                        className="form-select form-select-dark"
                        value={formData.membershipPlan}
                        onChange={handleInputChange}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="form-control form-control-dark"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Duration (Months)</label>
                      <input
                        type="number"
                        name="durationMonths"
                        className="form-control form-control-dark"
                        min="1"
                        max="24"
                        value={formData.durationMonths}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Membership Status</label>
                      <select
                        name="status"
                        className="form-select form-select-dark"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-lime">
                    {showAddModal ? 'Create Member' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMember && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-card-custom border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-heading fw-bold text-danger">Confirm Member Deletion</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p>
                  Are you sure you want to permanently delete <strong>{selectedMember.fullName}</strong> ({selectedMember.email})?
                </p>
                <p className="small text-muted mb-0">
                  This action will also safely remove their login credentials, fitness profile, and attendance history.
                </p>
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
