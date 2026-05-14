import React from 'react';
import { Calendar, Video, MessageSquare, Mail, Share2, Plus } from 'lucide-react';

const IntegrationCard = ({ name, description, icon: Icon, connected, color }) => (
  <div className="integration-card" style={{
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'all 0.3s ease'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '12px', 
        background: `rgba(${color}, 0.1)`, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: `rgb(${color})`
      }}>
        <Icon size={24} />
      </div>
      <div style={{ 
        padding: '4px 10px', 
        borderRadius: '20px', 
        fontSize: '10px', 
        fontWeight: 'bold',
        background: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        color: connected ? '#10b981' : 'var(--text-muted)',
        border: connected ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
      }}>
        {connected ? 'CONNECTED' : 'DISCONNECTED'}
      </div>
    </div>
    
    <div>
      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-main)' }}>{name}</h4>
      <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{description}</p>
    </div>
    
    <button className="stg-input" style={{ 
      width: '100%', 
      marginTop: 'auto', 
      textAlign: 'center',
      borderColor: connected ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent-blue)',
      color: connected ? 'var(--text-muted)' : 'var(--accent-blue)',
      fontSize: '13px',
      fontWeight: '600'
    }}>
      {connected ? 'Configure' : 'Connect Now'}
    </button>
  </div>
);

const IntegrationSettings = () => {
  const integrations = [
    { name: 'Google Calendar', description: 'Sync workshops and schedules with Google Calendar.', icon: Calendar, connected: true, color: '66, 133, 244' },
    { name: 'Zoom Video', description: 'Automatically generate Zoom links for online workshops.', icon: Video, connected: false, color: '45, 140, 255' },
    { name: 'Microsoft Teams', description: 'Integrate workshops with Microsoft Teams meetings.', icon: Share2, connected: false, color: '98, 100, 167' },
    { name: 'SendGrid Email', description: 'Reliable email delivery for platform notifications.', icon: Mail, connected: true, color: '3, 169, 244' },
    { name: 'WhatsApp Business', description: 'Send workshop alerts and updates via WhatsApp.', icon: MessageSquare, connected: false, color: '37, 211, 102' }
  ];

  return (
    <div className="stg-card">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {integrations.map((int, idx) => (
          <IntegrationCard key={idx} {...int} />
        ))}
        <div style={{
          border: '2px dashed rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          padding: '20px',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          transition: 'all 0.3s'
        }} className="add-integration-card">
          <Plus size={32} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Add New Integration</span>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;
