import React from 'react';
import { Lock, Smartphone, Monitor, LogOut, Clock, Key } from 'lucide-react';

const SecuritySettings = ({ settings, onChange }) => {
  const ToggleSwitch = ({ checked, onToggle, label }) => (
    <label className="stg-toggle-row">
      <span>{label}</span>
      <div className={`stg-toggle ${checked ? 'active' : ''}`} onClick={() => onToggle(!checked)}>
        <div className="stg-toggle-knob"></div>
      </div>
    </label>
  );

  return (
    <div className="stg-section">
      <h3 className="stg-section-title">Security Settings</h3>
      <p className="stg-section-desc">Manage authentication, sessions, and access controls</p>

      <div className="stg-security-grid">
        <div className="stg-security-card">
          <div className="stg-sec-icon" style={{ color: '#00D2FF', backgroundColor: 'rgba(0,210,255,0.1)' }}>
            <Lock size={20} />
          </div>
          <div>
            <h4>Change Password</h4>
            <p>Update your admin password regularly</p>
          </div>
          <button className="stg-btn-outline small">Update</button>
        </div>

        <div className="stg-security-card">
          <div className="stg-sec-icon" style={{ color: '#7000FF', backgroundColor: 'rgba(112,0,255,0.1)' }}>
            <Smartphone size={20} />
          </div>
          <div>
            <h4>Two-Factor Authentication</h4>
            <p>Add an extra layer of security</p>
          </div>
          <div className={`stg-toggle ${settings.twoFactor ? 'active' : ''}`} onClick={() => onChange('twoFactor', !settings.twoFactor)}>
            <div className="stg-toggle-knob"></div>
          </div>
        </div>

        <div className="stg-security-card">
          <div className="stg-sec-icon" style={{ color: '#FF00AA', backgroundColor: 'rgba(255,0,170,0.1)' }}>
            <Monitor size={20} />
          </div>
          <div>
            <h4>Trusted Devices</h4>
            <p>3 devices currently trusted</p>
          </div>
          <button className="stg-btn-outline small">Manage</button>
        </div>

        <div className="stg-security-card">
          <div className="stg-sec-icon" style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }}>
            <LogOut size={20} />
          </div>
          <div>
            <h4>Force Logout All Sessions</h4>
            <p>Sign out all active sessions</p>
          </div>
          <button className="stg-btn-danger small">Force Logout</button>
        </div>

        <div className="stg-security-card">
          <div className="stg-sec-icon" style={{ color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)' }}>
            <Clock size={20} />
          </div>
          <div>
            <h4>Login Session History</h4>
            <p>View recent login activity</p>
          </div>
          <button className="stg-btn-outline small">View</button>
        </div>

        <div className="stg-security-card">
          <div className="stg-sec-icon" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <Key size={20} />
          </div>
          <div>
            <h4>Password Expiry</h4>
            <p>Set password rotation policy</p>
          </div>
          <select className="stg-input stg-select small" value={settings.passwordExpiry} onChange={e => onChange('passwordExpiry', e.target.value)}>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
