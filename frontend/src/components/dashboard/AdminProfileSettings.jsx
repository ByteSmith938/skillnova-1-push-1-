import React from 'react';
import { Camera, Mail, Phone, Shield } from 'lucide-react';

const AdminProfileSettings = ({ profile, onChange }) => {
  return (
    <div className="stg-section">
      <h3 className="stg-section-title">Admin Profile</h3>
      <p className="stg-section-desc">Manage your admin identity and credentials</p>

      <div className="stg-profile-card">
        <div className="stg-avatar-area">
          <div className="stg-avatar">
            <span>{profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'AD'}</span>
          </div>
          <button className="stg-avatar-btn"><Camera size={16} /> Update Avatar</button>
        </div>

        <div className="stg-profile-info">
          <div className="stg-profile-badge">
            <Shield size={14} />
            <span>{profile.role}</span>
          </div>
        </div>
      </div>

      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Full Name</label>
          <input type="text" value={profile.name} onChange={e => onChange('name', e.target.value)} className="stg-input" />
        </div>
        <div className="stg-field">
          <label><Mail size={14} /> Email Address</label>
          <input type="email" value={profile.email} onChange={e => onChange('email', e.target.value)} className="stg-input" />
        </div>
        <div className="stg-field">
          <label><Phone size={14} /> Phone Number</label>
          <input type="tel" value={profile.phone} onChange={e => onChange('phone', e.target.value)} className="stg-input" />
        </div>
      </div>

      <div className="stg-actions-row">
        <button className="stg-btn-secondary">Edit Profile</button>
        <button className="stg-btn-outline">Change Password</button>
      </div>
    </div>
  );
};

export default AdminProfileSettings;
