import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tourix_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('tourix_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    if (data.success) {
      setUser(data.data);
      localStorage.setItem('tourix_user', JSON.stringify(data.data));
    }
    return data;
  };

  // Register function
  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    if (data.success) {
      setUser(data.data);
      localStorage.setItem('tourix_user', JSON.stringify(data.data));
    }
    return data;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tourix_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
