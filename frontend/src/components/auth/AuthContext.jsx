import React, { createContext, useContext, useState, useCallback } from 'react';
import { API_BASE_URL } from '../../services/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser  = localStorage.getItem('skillnova_auth');
    const savedToken = localStorage.getItem('skillnova_auth_token');
    // Clear stale sessions that have no token (old local-fallback sessions)
    if (savedUser && !savedToken) {
      localStorage.removeItem('skillnova_auth');
      return null;
    }
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // profile holds the full persistent profile fetched from /api/profile/me
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('skillnova_profile');
    return saved ? JSON.parse(saved) : null;
  });

  /** Fetch the latest profile from the backend and cache it. */
  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('skillnova_auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        localStorage.setItem('skillnova_profile', JSON.stringify(data));
      }
    } catch (err) {
      console.error('refreshProfile error:', err);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const authUser = { username: data.username, role: data.role };
        setUser(authUser);
        localStorage.setItem('skillnova_auth', JSON.stringify(authUser));
        localStorage.setItem('skillnova_auth_token', data.token);

        // Fetch full profile immediately after login
        try {
          const pRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          if (pRes.ok) {
            const pData = await pRes.json();
            setProfile(pData);
            localStorage.setItem('skillnova_profile', JSON.stringify(pData));
          }
        } catch (_) { /* non-fatal */ }

        return { success: true };
      }

      const errData = await response.json().catch(() => ({}));
      return { success: false, message: errData.message || 'Invalid username or password' };
    } catch (err) {
      console.error('Server login failed:', err);
      return { success: false, message: 'Cannot reach the server. Please check your connection.' };
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('skillnova_auth');
    localStorage.removeItem('skillnova_auth_token');
    localStorage.removeItem('skillnova_profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, refreshProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
