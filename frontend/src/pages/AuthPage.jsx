import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If user is already authenticated, redirect to home or intended destination
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {isLogin ? (
          <Login 
            switchToSignup={() => setIsLogin(false)} 
          />
        ) : (
          <Signup 
            switchToLogin={() => setIsLogin(true)} 
          />
        )}
      </div>
    </div>
  );
}