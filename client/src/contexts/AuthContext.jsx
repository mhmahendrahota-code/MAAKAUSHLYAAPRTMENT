import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate session on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetch('/api/users/profile', {
          credentials: 'include'
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          setUser(result.data);
        } else {
          // Token expired or invalid
          handleLogout();
        }
      } catch (err) {
        // If the backend is unavailable, show a clear error to the user.
        setError('Unable to reach the authentication server. Please try again later.');
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
      // Token is set as httpOnly cookie by server; no localStorage usage.
      setUser(userData);
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
      console.warn("⚠️ Backend server offline. Simulating registration locally in mock mode.");
      
      const newMockUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        flat_no: userData.flatNo || null,
        phone: userData.phone || null
      };

      setUser(newMockUser);
      return newMockUser;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    // Clear client state; server should clear cookie via logout endpoint if needed.
    setUser(null);
    // Note: token state no longer exists.

  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
