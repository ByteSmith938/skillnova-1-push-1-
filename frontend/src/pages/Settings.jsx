import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import AdminHeader from '../components/dashboard/AdminHeader';
import SettingsNav from '../components/settings/SettingsNav';
import GeneralSettings from '../components/settings/GeneralSettings';
import AdminProfileSettings from '../components/settings/AdminProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import WorkshopSettings from '../components/settings/WorkshopSettings';
import StudentSettings from '../components/settings/StudentSettings';
import BrandingSettings from '../components/settings/BrandingSettings';
import IntegrationSettings from '../components/settings/IntegrationSettings';
import './Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Local state placeholders for settings
  const [settings, setSettings] = useState({
    general: {
      platformName: 'SkillNova',
      orgName: 'SkillNova Academy',
      timezone: 'IST',
      language: 'en',
      darkMode: true,
      sessionTimeout: 30,
      autoSave: true
    },
    profile: {
      fullName: 'Admin User',
      email: 'admin@skillnova.com',
      role: 'Super Admin',
      phone: '+1 234 567 890',
      avatar: null
    },
    security: {
      twoFactor: false,
      passwordExpiry: 90
    },
    notifications: {
      workshopCreation: true,
      studentRegistration: true,
      attendanceUpdates: false,
      emailNotifications: true,
      smsNotifications: false,
      systemWarnings: true,
      weeklyReports: true
    },
    workshops: {
      defaultDuration: 60,
      autoQR: true,
      attendanceTracking: true,
      approvalRequired: false,
      allowEditing: true,
      defaultVisibility: 'public',
      autoCertificates: true
    },
    students: {
      selfRegistration: true,
      approvalRequired: true,
      autoAttendance: false,
      profileVisibility: 'private',
      certificateThreshold: 80,
      inactiveCleanup: 180
    },
    branding: {
      logo: null,
      primaryColor: '#00f2ff',
      secondaryColor: '#bc13fe',
      welcomeMessage: 'Welcome to SkillNova Admin Control Center',
      bannerImage: null
    }
  });

  const handleSettingsChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings settings={settings.general} onChange={(field, val) => handleSettingsChange('general', field, val)} />;
      case 'profile':
        return <AdminProfileSettings settings={settings.profile} onChange={(field, val) => handleSettingsChange('profile', field, val)} />;
      case 'security':
        return <SecuritySettings settings={settings.security} onChange={(field, val) => handleSettingsChange('security', field, val)} />;
      case 'notifications':
        return <NotificationSettings settings={settings.notifications} onChange={(field, val) => handleSettingsChange('notifications', field, val)} />;
      case 'workshops':
        return <WorkshopSettings settings={settings.workshops} onChange={(field, val) => handleSettingsChange('workshops', field, val)} />;
      case 'students':
        return <StudentSettings settings={settings.students} onChange={(field, val) => handleSettingsChange('students', field, val)} />;
      case 'branding':
        return <BrandingSettings settings={settings.branding} onChange={(field, val) => handleSettingsChange('branding', field, val)} />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return <GeneralSettings settings={settings.general} onChange={(field, val) => handleSettingsChange('general', field, val)} />;
    }
  };

  const sectionLabels = {
    general: 'General Settings',
    profile: 'Admin Profile',
    security: 'Security & Account',
    notifications: 'Notification Preferences',
    workshops: 'Workshop Preferences',
    students: 'Student Management',
    branding: 'Branding',
    integrations: 'Integrations'
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="Settings" />
      
      <main className="dashboard-main">
        <AdminHeader 
          title="Settings"
          subtitle="Manage platform preferences, admin controls, security and system behavior"
          searchPlaceholder="Search settings..."
          showSettingsActions={true}
        />

        <div className="settings-layout">
          <SettingsNav 
            activeSection={activeSection} 
            onSectionChange={(id) => {
              setActiveSection(id);
              setIsMobileNavOpen(false);
            }}
            isOpen={isMobileNavOpen}
            setIsOpen={setIsMobileNavOpen}
          />

          <div className="settings-content-area">
            <div className="settings-section-header">
              <h2>{sectionLabels[activeSection]}</h2>
            </div>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
