import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="stg-toggle-row">
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <div className="stg-toggle-knob"></div>
    </div>
  </label>
);

const WorkshopSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-section">
      <h3 className="stg-section-title">Workshop Preferences</h3>
      <p className="stg-section-desc">Configure default workshop behavior and automation</p>

      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Default Workshop Duration (hours)</label>
          <input type="number" value={settings.defaultDuration} onChange={e => onChange('defaultDuration', e.target.value)} className="stg-input" />
        </div>
        <div className="stg-field">
          <label>Default Visibility</label>
          <select value={settings.defaultVisibility} onChange={e => onChange('defaultVisibility', e.target.value)} className="stg-input stg-select">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>
      </div>

      <div className="stg-toggles-section">
        <ToggleSwitch label="Auto QR Code Generation" checked={settings.autoQR} onChange={v => onChange('autoQR', v)} />
        <ToggleSwitch label="Attendance Tracking" checked={settings.attendanceTracking} onChange={v => onChange('attendanceTracking', v)} />
        <ToggleSwitch label="Require Workshop Approval" checked={settings.requireApproval} onChange={v => onChange('requireApproval', v)} />
        <ToggleSwitch label="Allow Editing After Creation" checked={settings.allowEditing} onChange={v => onChange('allowEditing', v)} />
        <ToggleSwitch label="Auto Certificate Generation" checked={settings.autoCertificate} onChange={v => onChange('autoCertificate', v)} />
      </div>
    </div>
  );
};

export default WorkshopSettings;
