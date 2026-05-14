import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="stg-toggle-row">
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <div className="stg-toggle-knob"></div>
    </div>
  </label>
);

const StudentSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-section">
      <h3 className="stg-section-title">Student Management Settings</h3>
      <p className="stg-section-desc">Configure student registration and management rules</p>

      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Certificate Eligibility Threshold (%)</label>
          <input type="number" value={settings.certThreshold} onChange={e => onChange('certThreshold', e.target.value)} className="stg-input" min="0" max="100" />
        </div>
        <div className="stg-field">
          <label>Inactive Student Cleanup (days)</label>
          <input type="number" value={settings.inactiveCleanup} onChange={e => onChange('inactiveCleanup', e.target.value)} className="stg-input" />
        </div>
      </div>

      <div className="stg-toggles-section">
        <ToggleSwitch label="Allow Student Self-Registration" checked={settings.selfRegistration} onChange={v => onChange('selfRegistration', v)} />
        <ToggleSwitch label="Require Approval for Registration" checked={settings.requireApproval} onChange={v => onChange('requireApproval', v)} />
        <ToggleSwitch label="Auto Attendance Marking" checked={settings.autoAttendance} onChange={v => onChange('autoAttendance', v)} />
        <ToggleSwitch label="Student Profile Visibility" checked={settings.profileVisibility} onChange={v => onChange('profileVisibility', v)} />
      </div>
    </div>
  );
};

export default StudentSettings;
