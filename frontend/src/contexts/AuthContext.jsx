import { createContext, useContext, useState } from 'react';
import ApiService from '../services/api.service';
import { useToast } from '../components/ui/use-toast';

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
  const { toast } = useToast();
  
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await ApiService.register(userData);
      if (response.success) {
        const { user, token } = response;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        toast({
          title: "Success",
          description: "Registration successful",
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to register');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || 'Failed to register',
        variant: "destructive",
      });
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
    try {
      const response = await ApiService.login(credentials);
      if (response.success) {
        const { user, token } = response;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        toast({
          title: "Success",
          description: "Login successful",
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || 'Failed to login',
        variant: "destructive",
      });
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
