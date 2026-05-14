import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <div className="access-denied-content glass-panel">
        <h1 className="text-brand">403</h1>
        <h2>Access Denied</h2>
        <p className="text-secondary">You do not have permission to view this page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
