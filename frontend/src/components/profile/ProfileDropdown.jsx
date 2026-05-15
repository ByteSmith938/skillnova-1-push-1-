import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Camera, Settings, LogOut, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import './ProfileDropdown.css';

/**
 * Avatar helper — renders an <img> if avatarUrl exists, otherwise a gradient
 * circle with the user's initials.
 */
export const UserAvatar = ({ avatarUrl, name, size = 28, className = '' }) => {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'avatar'}
        className={`user-avatar-img ${className}`}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  return (
    <div
      className={`user-avatar-initials ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name || 'user avatar'}
    >
      {initials}
    </div>
  );
};

const ProfileDropdown = () => {
  const navigate  = useNavigate();
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const displayName = profile?.fullName || user?.username || 'Admin';
  const role        = profile?.role     || user?.role     || 'admin';
  const avatarUrl   = profile?.avatarUrl || '';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  const go = (path) => { setOpen(false); navigate(path); };

  return (
    <div className="pd-wrap" ref={wrapRef}>
      {/* ── Trigger button ── */}
      <button
        className={`pd-trigger ${open ? 'pd-trigger--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <UserAvatar avatarUrl={avatarUrl} name={displayName} size={28} />
        <span className="pd-trigger-name">{displayName}</span>
        <svg
          className={`pd-chevron ${open ? 'pd-chevron--up' : ''}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="pd-panel"
          role="menu"
          aria-label="Profile menu"
        >
          {/* Header */}
          <div className="pd-header">
            <UserAvatar avatarUrl={avatarUrl} name={displayName} size={48} />
            <div className="pd-header-info">
              <span className="pd-header-name">{displayName}</span>
              <span className="pd-header-role">
                <Shield size={11} />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
              {profile?.email && (
                <span className="pd-header-email">{profile.email}</span>
              )}
            </div>
          </div>

          <div className="pd-divider" />

          {/* Menu items */}
          <nav className="pd-menu" role="none">
            <button
              className="pd-item"
              role="menuitem"
              onClick={() => go('/settings?tab=profile')}
            >
              <span className="pd-item-icon"><User size={15} /></span>
              <span>View Profile</span>
              <ChevronRight size={13} className="pd-item-arrow" />
            </button>

            <button
              className="pd-item"
              role="menuitem"
              onClick={() => go('/settings?tab=profile')}
            >
              <span className="pd-item-icon"><Edit3 size={15} /></span>
              <span>Edit Profile</span>
              <ChevronRight size={13} className="pd-item-arrow" />
            </button>

            <button
              className="pd-item"
              role="menuitem"
              onClick={() => go('/settings?tab=profile&action=avatar')}
            >
              <span className="pd-item-icon"><Camera size={15} /></span>
              <span>Change Avatar</span>
              <ChevronRight size={13} className="pd-item-arrow" />
            </button>

            <button
              className="pd-item"
              role="menuitem"
              onClick={() => go('/settings')}
            >
              <span className="pd-item-icon"><Settings size={15} /></span>
              <span>Settings</span>
              <ChevronRight size={13} className="pd-item-arrow" />
            </button>
          </nav>

          <div className="pd-divider" />

          <button
            className="pd-item pd-item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            <span className="pd-item-icon"><LogOut size={15} /></span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
