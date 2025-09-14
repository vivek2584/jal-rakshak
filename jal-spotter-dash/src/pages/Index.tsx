import { useState } from 'react';
import { LoginSelection } from '../components/LoginSelection';
import { LoginPage } from '../components/LoginPage';
import { PublicLoginPage } from '../components/PublicLoginPage';
import { Dashboard } from '../components/Dashboard';
import { PublicDashboard } from '../components/PublicDashboard';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, logout } = useAuth();
  const [loginType, setLoginType] = useState<'selection' | 'public' | 'government'>('selection');

  const handleLogin = () => {
    // Login handled by AuthContext
  };

  const handleUserTypeSelect = (type: 'public' | 'government') => {
    setLoginType(type);
  };

  const handleBack = () => {
    setLoginType('selection');
  };

  if (!user) {
    if (loginType === 'selection') {
      return <LoginSelection onUserTypeSelect={handleUserTypeSelect} />;
    } else if (loginType === 'public') {
      return <PublicLoginPage onLogin={handleLogin} onBack={handleBack} />;
    } else {
      return <LoginPage onLogin={handleLogin} onBack={handleBack} />;
    }
  }

  // Route to appropriate dashboard based on user role
  if (user.role === 'public_user') {
    return <PublicDashboard onLogout={logout} />;
  }

  return <Dashboard onLogout={logout} />;
};

export default Index;
