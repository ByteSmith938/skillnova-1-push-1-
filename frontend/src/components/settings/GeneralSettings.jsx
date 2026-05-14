import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="stg-toggle-row" onClick={() => onChange(!checked)}>
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`}>
      <div className="stg-toggle-knob"></div>
    </div>
  </div>
);

const GeneralSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Platform Name</label>
          <input 
            type="text" 
            value={settings.platformName} 
            onChange={(e) => onChange('platformName', e.target.value)}
            className="stg-input"
            placeholder="e.g. SkillNova"
          />
        </div>
        <div className="stg-field">
          <label>Organization Name</label>
          <input 
            type="text" 
            value={settings.orgName} 
            onChange={(e) => onChange('orgName', e.target.value)}
            className="stg-input"
            placeholder="e.g. SkillNova Academy"
          />
        </div>
        <div className="stg-field">
          <label>Default Time Zone</label>
          <select 
            value={settings.timezone} 
            onChange={(e) => onChange('timezone', e.target.value)}
            className="stg-input stg-select"
          >
            <option value="IST">IST (UTC+5:30)</option>
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="EST">EST (UTC-5)</option>
            <option value="PST">PST (UTC-8)</option>
          </select>
        </div>
        <div className="stg-field">
          <label>Language</label>
          <select 
            value={settings.language} 
            onChange={(e) => onChange('language', e.target.value)}
            className="stg-input stg-select"
          >
            <option value="en">English (US)</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div className="stg-field">
          <label>Session Timeout (minutes)</label>
          <input 
            type="number" 
            value={settings.sessionTimeout} 
            onChange={(e) => onChange('sessionTimeout', parseInt(e.target.value))}
            className="stg-input"
          />
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <ToggleSwitch 
          label="Dark Theme Mode" 
          checked={settings.darkMode} 
          onChange={(val) => onChange('darkMode', val)} 
        />
        <ToggleSwitch 
          label="Auto Save Changes" 
          checked={settings.autoSave} 
          onChange={(val) => onChange('autoSave', val)} 
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
