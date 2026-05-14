import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="stg-toggle-row">
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <div className="stg-toggle-knob"></div>
    </div>
  </label>
);

const GeneralSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-section">
      <h3 className="stg-section-title">General Settings</h3>
      <p className="stg-section-desc">Configure core platform settings and behavior</p>

      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Platform Name</label>
          <input type="text" value={settings.platformName} onChange={e => onChange('platformName', e.target.value)} className="stg-input" />
        </div>
        <div className="stg-field">
          <label>Organization Name</label>
          <input type="text" value={settings.orgName} onChange={e => onChange('orgName', e.target.value)} className="stg-input" />
        </div>
        <div className="stg-field">
          <label>Default Time Zone</label>
          <select value={settings.timezone} onChange={e => onChange('timezone', e.target.value)} className="stg-input stg-select">
            <option value="IST">IST (UTC+5:30)</option>
            <option value="UTC">UTC</option>
            <option value="EST">EST (UTC-5)</option>
            <option value="PST">PST (UTC-8)</option>
          </select>
        </div>
        <div className="stg-field">
          <label>Language</label>
          <select value={settings.language} onChange={e => onChange('language', e.target.value)} className="stg-input stg-select">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </div>
        <div className="stg-field">
          <label>Session Timeout (minutes)</label>
          <input type="number" value={settings.sessionTimeout} onChange={e => onChange('sessionTimeout', e.target.value)} className="stg-input" />
        </div>
      </div>

      <div className="stg-toggles-section">
        <ToggleSwitch label="Dark Theme Mode" checked={settings.darkMode} onChange={v => onChange('darkMode', v)} />
        <ToggleSwitch label="Auto Save" checked={settings.autoSave} onChange={v => onChange('autoSave', v)} />
      </div>
    </div>
  );
};

export default GeneralSettings;
