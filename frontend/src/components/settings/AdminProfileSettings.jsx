import React from 'react';
import { Camera, Mail, Phone, ShieldCheck } from 'lucide-react';

const AdminProfileSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="profile-upload-section" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
        <div className="profile-avatar-wrap" style={{ position: 'relative' }}>
          <div className="profile-avatar-placeholder" style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--gradient-brand)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#fff',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)'
          }}>
            {settings.fullName.charAt(0)}
          </div>
          <button className="avatar-edit-btn" style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            background: 'var(--bg-dark)',
            border: '1px solid var(--glass-border)',
            color: 'var(--accent-blue)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--text-main)' }}>{settings.fullName}</h3>
          <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-muted)' }}>{settings.role}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button className="stg-input" style={{ padding: '6px 12px', fontSize: '12px' }}>Update Avatar</button>
            <button className="stg-input" style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>Remove</button>
          </div>
        </div>
      </div>

      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Full Name</label>
          <input 
            type="text" 
            value={settings.fullName} 
            onChange={(e) => onChange('fullName', e.target.value)}
            className="stg-input"
          />
        </div>
        <div className="stg-field">
          <label>Email Address</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="email" 
              value={settings.email} 
              onChange={(e) => onChange('email', e.target.value)}
              className="stg-input"
              style={{ width: '100%', paddingLeft: '40px' }}
            />
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
        <div className="stg-field">
          <label>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              value={settings.phone} 
              onChange={(e) => onChange('phone', e.target.value)}
              className="stg-input"
              style={{ width: '100%', paddingLeft: '40px' }}
            />
            <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
        <div className="stg-field">
          <label>Role</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              value={settings.role} 
              disabled
              className="stg-input"
              style={{ width: '100%', paddingLeft: '40px', cursor: 'not-allowed', opacity: 0.7 }}
            />
            <ShieldCheck size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button className="stg-input" style={{ width: '100%', textAlign: 'center', background: 'rgba(112, 0, 255, 0.1)', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)', fontWeight: '600' }}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default AdminProfileSettings;
