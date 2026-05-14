import React from 'react';
import { Bell, Mail, MessageSquare, ShieldAlert } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="stg-toggle-row" onClick={() => onChange(!checked)}>
    <span>{label}</span>
    <div className={`stg-toggle ${checked ? 'active' : ''}`}>
      <div className="stg-toggle-knob"></div>
    </div>
  </div>
);

const NotificationSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="notification-group">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>
          <Bell size={20} className="text-accent-blue" />
          System Alerts
        </h3>
        <ToggleSwitch 
          label="Workshop Creation Alerts" 
          checked={settings.workshopCreation} 
          onChange={(val) => onChange('workshopCreation', val)} 
        />
        <ToggleSwitch 
          label="Student Registration Alerts" 
          checked={settings.studentRegistration} 
          onChange={(val) => onChange('studentRegistration', val)} 
        />
        <ToggleSwitch 
          label="Attendance Update Alerts" 
          checked={settings.attendanceUpdates} 
          onChange={(val) => onChange('attendanceUpdates', val)} 
        />
      </div>

      <div className="notification-group" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>
          <Mail size={20} style={{ color: 'var(--accent-purple)' }} />
          Communication Channels
        </h3>
        <ToggleSwitch 
          label="Email Notifications" 
          checked={settings.emailNotifications} 
          onChange={(val) => onChange('emailNotifications', val)} 
        />
        <ToggleSwitch 
          label="SMS Notifications" 
          checked={settings.smsNotifications} 
          onChange={(val) => onChange('smsNotifications', val)} 
        />
      </div>

      <div className="notification-group" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>
          <ShieldAlert size={20} style={{ color: '#f59e0b' }} />
          Reports & Warnings
        </h3>
        <ToggleSwitch 
          label="Critical System Warnings" 
          checked={settings.systemWarnings} 
          onChange={(val) => onChange('systemWarnings', val)} 
        />
        <ToggleSwitch 
          label="Weekly Performance Reports" 
          checked={settings.weeklyReports} 
          onChange={(val) => onChange('weeklyReports', val)} 
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
