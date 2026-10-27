import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('vidyasaathi_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('vidyasaathi_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify existing token on initial load
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('vidyasaathi_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (phone_or_email, password) => {
    const res = await api.post('/auth/login', {
      phone_or_email,
      password,
    });
    const { access_token, user: loggedUser } = res.data;
    setToken(access_token);
    setUser(loggedUser);
    localStorage.setItem('vidyasaathi_token', access_token);
    localStorage.setItem('vidyasaathi_user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { access_token, user: registeredUser } = res.data;
    setToken(access_token);
    setUser(registeredUser);
    localStorage.setItem('vidyasaathi_token', access_token);
    localStorage.setItem('vidyasaathi_user', JSON.stringify(registeredUser));
    return registeredUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vidyasaathi_token');
    localStorage.removeItem('vidyasaathi_user');
  };

  const updateUser = (updated) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('vidyasaathi_user', JSON.stringify(next));
      return next;
    });
  };

  const getRoleHomeRoute = (role) => {
    switch (role) {
      case 'teacher':
        return '/teacher-dashboard';
      case 'parent':
        return '/parent-dashboard';
      case 'super_admin':
      case 'admin':
        return '/super-admin-dashboard';
      case 'student':
      default:
        return '/student';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
        isParent: user?.role === 'parent',
        isSuperAdmin: user?.role === 'super_admin' || user?.role === 'admin',
        getRoleHomeRoute,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
