import { createContext, useContext, useState } from 'react';
import ApiService from '../services/api.service';
import apiConfig from '../config/api';

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Initialize auth state from localStorage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.register(userData);
      if (response.success) {
        const { user } = response;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to register');
      }
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register'
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.login(credentials);
      
      if (response.success && response.data) {
        // Store the user data
        localStorage.setItem('user', JSON.stringify(response.data));
        // Store the token if it's in the response
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setUser(response.data);
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to login');
      }
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
