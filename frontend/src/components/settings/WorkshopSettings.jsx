import React from 'react';
import { BookOpen, QrCode, ClipboardCheck, Lock } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="stg-toggle-row" onClick={() => onChange(!checked)}>
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`}>
      <div className="stg-toggle-knob"></div>
    </div>
  </div>
);

const WorkshopSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="stg-form-grid">
        <div className="stg-field">
          <label>Default Workshop Duration (mins)</label>
          <input 
            type="number" 
            value={settings.defaultDuration} 
            onChange={(e) => onChange('defaultDuration', parseInt(e.target.value))}
            className="stg-input"
          />
        </div>
        <div className="stg-field">
          <label>Default Visibility</label>
          <select 
            value={settings.defaultVisibility} 
            onChange={(e) => onChange('defaultVisibility', e.target.value)}
            className="stg-input stg-select"
          >
            <option value="public">Public (Visible to everyone)</option>
            <option value="private">Private (Invite only)</option>
            <option value="unlisted">Unlisted (Link only)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '16px' }}>Automation & Features</h3>
        <ToggleSwitch 
          label="Auto QR Code Generation" 
          checked={settings.autoQR} 
          onChange={(val) => onChange('autoQR', val)} 
        />
        <ToggleSwitch 
          label="Enable Attendance Tracking" 
          checked={settings.attendanceTracking} 
          onChange={(val) => onChange('attendanceTracking', val)} 
        />
        <ToggleSwitch 
          label="Workshop Approval Requirement" 
          checked={settings.approvalRequired} 
          onChange={(val) => onChange('approvalRequired', val)} 
        />
        <ToggleSwitch 
          label="Allow Editing After Creation" 
          checked={settings.allowEditing} 
          onChange={(val) => onChange('allowEditing', val)} 
        />
        <ToggleSwitch 
          label="Certificate Auto Generation" 
          checked={settings.autoCertificates} 
          onChange={(val) => onChange('autoCertificates', val)} 
        />
      </div>
    </div>
  );
};

export default WorkshopSettings;
