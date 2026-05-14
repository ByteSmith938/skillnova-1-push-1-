import React from 'react';
import { Users, UserCheck, Shield, Trash2 } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="stg-toggle-row" onClick={() => onChange(!checked)}>
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`}>
      <div className="stg-toggle-knob"></div>
    </div>
  </div>
);

const StudentSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="settings-group">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>
          <Users size={20} className="text-accent-blue" />
          Registration Controls
        </h3>
        <ToggleSwitch 
          label="Allow Student Self-Registration" 
          checked={settings.selfRegistration} 
          onChange={(val) => onChange('selfRegistration', val)} 
        />
        <ToggleSwitch 
          label="Require Admin Approval for Registration" 
          checked={settings.approvalRequired} 
          onChange={(val) => onChange('approvalRequired', val)} 
        />
        <ToggleSwitch 
          label="Auto Attendance Marking (via Location/IP)" 
          checked={settings.autoAttendance} 
          onChange={(val) => onChange('autoAttendance', val)} 
        />
      </div>

      <div className="stg-form-grid" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="stg-field">
          <label>Student Profile Visibility</label>
          <select 
            value={settings.profileVisibility} 
            onChange={(e) => onChange('profileVisibility', e.target.value)}
            className="stg-input stg-select"
          >
            <option value="public">Public (Visible to everyone)</option>
            <option value="private">Private (Only Admin & Student)</option>
            <option value="restricted">Restricted (Internal Only)</option>
          </select>
        </div>
        <div className="stg-field">
          <label>Certificate Eligibility Threshold (%)</label>
          <input 
            type="number" 
            value={settings.certificateThreshold} 
            onChange={(e) => onChange('certificateThreshold', parseInt(e.target.value))}
            className="stg-input"
            min="0"
            max="100"
          />
        </div>
        <div className="stg-field">
          <label>Inactive Student Cleanup (days)</label>
          <input 
            type="number" 
            value={settings.inactiveCleanup} 
            onChange={(e) => onChange('inactiveCleanup', parseInt(e.target.value))}
            className="stg-input"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
