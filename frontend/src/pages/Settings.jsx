import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('general');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Support ?tab=profile deep-link from ProfileDropdown
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveSection(tab);
  }, [location.search]);

  // Local state for non-profile settings (profile is handled by useProfile hook)
  const [settings, setSettings] = useState({
    general: {
      platformName: 'SkillNova',
      orgName: 'SkillNova Academy',
      timezone: 'IST',
      language: 'en',
      darkMode: true,
      sessionTimeout: 30,
      autoSave: true,
    },
    security: {
      twoFactor: false,
      passwordExpiry: 90,
    },
    notifications: {
      workshopCreation: true,
      studentRegistration: true,
      attendanceUpdates: false,
      emailNotifications: true,
      smsNotifications: false,
      systemWarnings: true,
      weeklyReports: true,
    },
    workshops: {
      defaultDuration: 60,
      autoQR: true,
      attendanceTracking: true,
      approvalRequired: false,
      allowEditing: true,
      defaultVisibility: 'public',
      autoCertificates: true,
    },
    students: {
      selfRegistration: true,
      approvalRequired: true,
      autoAttendance: false,
      profileVisibility: 'private',
      certificateThreshold: 80,
      inactiveCleanup: 180,
    },
    branding: {
      logo: null,
      primaryColor: '#00f2ff',
      secondaryColor: '#bc13fe',
      welcomeMessage: 'Welcome to SkillNova Admin Control Center',
      bannerImage: null,
    },
  });

  const handleSettingsChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings settings={settings.general} onChange={(f, v) => handleSettingsChange('general', f, v)} />;
      case 'profile':
        // AdminProfileSettings manages its own data via useProfile hook
        return <AdminProfileSettings />;
      case 'security':
        return <SecuritySettings settings={settings.security} onChange={(f, v) => handleSettingsChange('security', f, v)} />;
      case 'notifications':
        return <NotificationSettings settings={settings.notifications} onChange={(f, v) => handleSettingsChange('notifications', f, v)} />;
      case 'workshops':
        return <WorkshopSettings settings={settings.workshops} onChange={(f, v) => handleSettingsChange('workshops', f, v)} />;
      case 'students':
        return <StudentSettings settings={settings.students} onChange={(f, v) => handleSettingsChange('students', f, v)} />;
      case 'branding':
        return <BrandingSettings settings={settings.branding} onChange={(f, v) => handleSettingsChange('branding', f, v)} />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return <GeneralSettings settings={settings.general} onChange={(f, v) => handleSettingsChange('general', f, v)} />;
    }
  };

  const sectionLabels = {
    general:       'General Settings',
    profile:       'Admin Profile',
    security:      'Security & Account',
    notifications: 'Notification Preferences',
    workshops:     'Workshop Preferences',
    students:      'Student Management',
    branding:      'Branding',
    integrations:  'Integrations',
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
