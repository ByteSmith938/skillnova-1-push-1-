import React from 'react';
import { Palette, Upload, Image as ImageIcon } from 'lucide-react';

const BrandingSettings = ({ settings, onChange }) => {
  return (
    <div className="stg-card">
      <div className="branding-section">
        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '20px' }}>Visual Identity</h3>
        
        <div className="stg-form-grid">
          <div className="stg-field">
            <label>Platform Logo</label>
            <div className="logo-upload-wrap" style={{ 
              height: '120px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '8px'
            }}>
              <Upload size={24} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Upload SVG or PNG (200x50)</span>
            </div>
          </div>
          <div className="stg-field">
            <label>Dashboard Banner Image</label>
            <div className="banner-upload-wrap" style={{ 
              height: '120px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '8px'
            }}>
              <ImageIcon size={24} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Upload Banner (1200x300)</span>
            </div>
          </div>
        </div>

        <div className="stg-form-grid" style={{ marginTop: '32px' }}>
          <div className="stg-field">
            <label>Primary Accent Color</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="color" 
                value={settings.primaryColor} 
                onChange={(e) => onChange('primaryColor', e.target.value)}
                style={{ width: '44px', height: '44px', border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
              <input 
                type="text" 
                value={settings.primaryColor} 
                onChange={(e) => onChange('primaryColor', e.target.value)}
                className="stg-input"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div className="stg-field">
            <label>Secondary Accent Color</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="color" 
                value={settings.secondaryColor} 
                onChange={(e) => onChange('secondaryColor', e.target.value)}
                style={{ width: '44px', height: '44px', border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
              <input 
                type="text" 
                value={settings.secondaryColor} 
                onChange={(e) => onChange('secondaryColor', e.target.value)}
                className="stg-input"
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        <div className="stg-field" style={{ marginTop: '24px' }}>
          <label>Custom Admin Welcome Message</label>
          <textarea 
            value={settings.welcomeMessage} 
            onChange={(e) => onChange('welcomeMessage', e.target.value)}
            className="stg-input"
            style={{ minHeight: '100px', resize: 'vertical' }}
            placeholder="Enter a custom message for the admin dashboard..."
          />
        </div>
      </div>

      <div className="branding-preview" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '16px' }}>Theme Preview</h3>
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.3)', 
          borderRadius: '16px', 
          padding: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: settings.primaryColor }}></div>
            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: settings.secondaryColor }}></div>
            <div style={{ flex: 1, height: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ height: '8px', background: `linear-gradient(90deg, ${settings.primaryColor}, ${settings.secondaryColor})`, borderRadius: '4px' }}></div>
          <p style={{ fontSize: '14px', color: 'var(--text-main)', margin: '0' }}>{settings.welcomeMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
