import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../../services/apiConfig';

const AuthContext = createContext();

const USERS = [
  { username: 'sagar', password: 'sagar', role: 'admin' },
  { username: 'pranit', password: 'pranit', role: 'coworker' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('skillnova_auth');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: username, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('skillnova_auth', JSON.stringify(data.user));
        localStorage.setItem('skillnova_auth_token', data.token);
        return { success: true };
      }
    } catch (err) {
      console.error('Staff token login failed, falling back to local login:', err);
    }

    const foundUser = USERS.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const authUser = { username: foundUser.username, role: foundUser.role };
      setUser(authUser);
      localStorage.setItem('skillnova_auth', JSON.stringify(authUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillnova_auth');
    localStorage.removeItem('skillnova_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
