import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate session on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const localToken = localStorage.getItem('auth_token');
      try {
        const headers = {};
        if (localToken) {
          headers['Authorization'] = `Bearer ${localToken}`;
        }
        const response = await fetch('/api/users/profile', {
          credentials: 'include',
          headers
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          setUser(result.data);
          setToken(result.token);
          localStorage.setItem('auth_token', result.token);
          localStorage.setItem('auth_user', JSON.stringify(result.data));
        } else {
          // Token expired or invalid
          handleLogout();
        }
      } catch (err) {
        console.error("Authentication server check failed.", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    let hasResponse = false;
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      hasResponse = true;
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const userData = result.data;
      setToken(result.token);
      setUser(userData);
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      if (hasResponse) {
        setError(err.message);
        throw err;
      }
      // Offline mock login is removed for security. Show error.
      setError('Authentication server is unavailable. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    let hasResponse = false;
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      hasResponse = true;
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      const newUserData = result.data;
      
      // If registration succeeded but requires approval, do not auto-login
      if (newUserData && newUserData.is_approved === false) {
        return newUserData;
      }

      // Server sets httpOnly cookie; no localStorage usage.
      setUser(newUserData);
      return newUserData;
    } catch (err) {
      if (hasResponse) {
        setError(err.message);
        throw err;
      }
      setError('Authentication server is unavailable. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear client state; server should clear cookie via logout endpoint if needed.
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, token, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
