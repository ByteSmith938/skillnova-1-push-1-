import React from 'react';
import { Lock, Smartphone, History, LogOut } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="stg-toggle-row" onClick={() => onChange(!checked)}>
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`}>
      <div className="stg-toggle-knob"></div>
    </div>
  </div>
);

const SecuritySettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="security-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>
          <Lock size={20} className="text-accent-blue" />
          Authentication Security
        </h3>
        
        <ToggleSwitch 
          label="Two-Factor Authentication (2FA)" 
          checked={settings.twoFactor} 
          onChange={(val) => onChange('twoFactor', val)} 
        />
        
        <div className="stg-field" style={{ marginTop: '20px' }}>
          <label>Password Expiry (days)</label>
          <select 
            value={settings.passwordExpiry} 
            onChange={(e) => onChange('passwordExpiry', parseInt(e.target.value))}
            className="stg-input stg-select"
          >
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
            <option value={180}>180 Days</option>
            <option value={0}>Never Expire</option>
          </select>
        </div>
      </div>

      <div className="security-section" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>
          <History size={20} style={{ color: 'var(--accent-purple)' }} />
          Login Session History
        </h3>
        
        <div className="session-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { device: 'Windows PC - Chrome', location: 'New York, USA', time: 'Active Now', current: true },
            { device: 'iPhone 13 - Safari', location: 'London, UK', time: '2 hours ago', current: false },
            { device: 'MacBook Pro - Firefox', location: 'Berlin, Germany', time: 'Yesterday', current: false }
          ].map((session, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px',
              background: session.current ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: session.current ? '1px solid rgba(0, 210, 255, 0.2)' : '1px solid transparent'
            }}>
              <div>
                <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{session.device}</p>
                <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-muted)' }}>{session.location} • {session.time}</p>
              </div>
              {!session.current && <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Revoke</button>}
              {session.current && <span style={{ color: 'var(--accent-blue)', fontSize: '12px', fontWeight: 'bold' }}>Current</span>}
            </div>
          ))}
        </div>

        <button className="stg-input" style={{ width: '100%', marginTop: '24px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> Force Logout All Sessions
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
