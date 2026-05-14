import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, Bell, BookOpen, Users, Palette, Plug, Server } from 'lucide-react';

const sections = [
  { key: 'general', label: 'General', icon: <Settings size={18} /> },
  { key: 'profile', label: 'Admin Profile', icon: <User size={18} /> },
  { key: 'security', label: 'Security', icon: <Shield size={18} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { key: 'workshops', label: 'Workshop Preferences', icon: <BookOpen size={18} /> },
  { key: 'students', label: 'Student Management', icon: <Users size={18} /> },
  { key: 'branding', label: 'Branding', icon: <Palette size={18} /> },
  { key: 'integrations', label: 'Integrations', icon: <Plug size={18} /> },
  { key: 'system', label: 'System Settings', icon: <Server size={18} /> },
];

const SettingsSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="settings-nav-panel">
      <h3 className="settings-nav-title">Settings</h3>
      <nav className="settings-nav-list">
        {sections.map(sec => (
          <motion.button
            key={sec.key}
            className={`settings-nav-item ${activeSection === sec.key ? 'active' : ''}`}
            onClick={() => setActiveSection(sec.key)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="settings-nav-icon">{sec.icon}</span>
            <span>{sec.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;
