import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="stg-toggle-row">
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <div className="stg-toggle-knob"></div>
    </div>
  </label>
);

const NotificationSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-section">
      <h3 className="stg-section-title">Notification Preferences</h3>
      <p className="stg-section-desc">Control how and when you receive alerts</p>

      <div className="stg-toggles-section">
        <ToggleSwitch label="Workshop Creation Alerts" checked={settings.workshopCreation} onChange={v => onChange('workshopCreation', v)} />
        <ToggleSwitch label="Student Registration Alerts" checked={settings.studentRegistration} onChange={v => onChange('studentRegistration', v)} />
        <ToggleSwitch label="Attendance Update Alerts" checked={settings.attendanceUpdate} onChange={v => onChange('attendanceUpdate', v)} />
        <ToggleSwitch label="Email Notifications" checked={settings.emailNotifications} onChange={v => onChange('emailNotifications', v)} />
        <ToggleSwitch label="SMS Notifications" checked={settings.smsNotifications} onChange={v => onChange('smsNotifications', v)} />
        <ToggleSwitch label="System Warnings" checked={settings.systemWarnings} onChange={v => onChange('systemWarnings', v)} />
        <ToggleSwitch label="Weekly Summary Reports" checked={settings.weeklyReports} onChange={v => onChange('weeklyReports', v)} />
      </div>
    </div>
  );
};

export default NotificationSettings;
