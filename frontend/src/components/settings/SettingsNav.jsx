import React from 'react';
import { Settings, User, Shield, Bell, BookOpen, Users, Palette, Share2, Menu, X } from 'lucide-react';

const SettingsNav = ({ activeSection, onSectionChange, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security & Account', icon: Shield },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'workshops', label: 'Workshop Preferences', icon: BookOpen },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
  ];

  return (
    <nav className={`settings-nav ${isOpen ? 'mobile-open' : ''}`}>
      <button 
        className="stg-mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
        <span>Settings Menu</span>
      </button>

      <div className={`stg-nav-list ${isOpen ? 'show' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`stg-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="stg-nav-icon" size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default SettingsNav;
