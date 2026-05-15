import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mail, Phone, ShieldCheck, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import useProfile from '../../hooks/useProfile';
import { UserAvatar } from '../profile/ProfileDropdown';

const AdminProfileSettings = () => {
  const { profile, saving, error, success, saveProfile, changeAvatar, deleteAvatar, clearMessages } =
    useProfile();

  const [form, setForm] = useState({
    fullName: '',
    email:    '',
    phone:    '',
  });

  const fileInputRef = useRef(null);

  // Sync form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        email:    profile.email    || '',
        phone:    profile.phone    || '',
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    clearMessages();
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveProfile(form);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await changeAvatar(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveAvatar = async () => {
    if (window.confirm('Remove your avatar?')) {
      await deleteAvatar();
    }
  };

  const displayName = profile?.fullName || profile?.username || 'Admin';
  const avatarUrl   = profile?.avatarUrl || '';

  return (
    <div className="stg-card">
      {/* ── Avatar section ── */}
      <div className="profile-upload-section">
        <div className="profile-avatar-wrap">
          <UserAvatar avatarUrl={avatarUrl} name={displayName} size={100} />
          <button
            type="button"
            className="avatar-edit-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Change avatar"
            aria-label="Change avatar"
          >
            <Camera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="profile-avatar-info">
          <h3 className="profile-avatar-name">{displayName}</h3>
          <p className="profile-avatar-role">
            {profile?.role
              ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
              : 'Staff'}
          </p>
          {profile?.createdAt && (
            <p className="profile-avatar-since">
              Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
          <div className="profile-avatar-actions">
            <button
              type="button"
              className="stg-input profile-avatar-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              {saving ? <Loader size={13} className="spin" /> : <Camera size={13} />}
              Update Avatar
            </button>
            {avatarUrl && (
              <button
                type="button"
                className="stg-input profile-avatar-btn profile-avatar-btn--danger"
                onClick={handleRemoveAvatar}
                disabled={saving}
              >
                Remove
              </button>
            )}
          </div>
          <p className="profile-avatar-hint">JPG, PNG or WebP · max 5 MB</p>
        </div>
      </div>

      {/* ── Feedback messages ── */}
      {success && (
        <div className="profile-feedback profile-feedback--success">
          <CheckCircle size={15} /> {success}
        </div>
      )}
      {error && (
        <div className="profile-feedback profile-feedback--error">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* ── Profile form ── */}
      <form onSubmit={handleSave}>
        <div className="stg-form-grid">
          <div className="stg-field">
            <label htmlFor="pf-fullname">Full Name</label>
            <input
              id="pf-fullname"
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="stg-input"
              placeholder="Your full name"
            />
          </div>

          <div className="stg-field">
            <label htmlFor="pf-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="pf-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="stg-input"
                style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                placeholder="you@example.com"
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="stg-field">
            <label htmlFor="pf-phone">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                id="pf-phone"
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="stg-input"
                style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                placeholder="+1 234 567 890"
              />
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="stg-field">
            <label htmlFor="pf-role">Role</label>
            <div style={{ position: 'relative' }}>
              <input
                id="pf-role"
                type="text"
                value={profile?.role
                  ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                  : ''}
                disabled
                className="stg-input"
                style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box', cursor: 'not-allowed', opacity: 0.7 }}
              />
              <ShieldCheck size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '28px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={saving}
          >
            {saving
              ? <><Loader size={16} className="spin" /> Saving…</>
              : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfileSettings;
