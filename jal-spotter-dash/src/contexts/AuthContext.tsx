import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/dashboard';

interface AuthContextType {
  user: User | null;
  language: 'en' | 'as';
  login: (username: string, password: string) => Promise<boolean>;
  loginPublicUser: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  setLanguage: (lang: 'en' | 'as') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock government worker credentials
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'dr.sharma': {
    password: 'health123',
    user: {
      id: '1',
      username: 'dr.sharma',
      fullName: 'Dr. Rajesh Sharma',
      role: 'district_medical_officer',
      district: 'Dibrugarh',
      department: 'District Health Department',
      lastLogin: new Date(),
    }
  },
  'coordinator.devi': {
    password: 'asha456',
    user: {
      id: '2',
      username: 'coordinator.devi',
      fullName: 'Priya Devi',
      role: 'asha_coordinator',
      district: 'Dibrugarh',
      department: 'ASHA Program',
      lastLogin: new Date(),
    }
  },
  'inspector.das': {
    password: 'inspect789',
    user: {
      id: '3',
      username: 'inspector.das',
      fullName: 'Bikash Das',
      role: 'health_inspector',
      district: 'Dibrugarh',
      department: 'Public Health Inspection',
      lastLogin: new Date(),
    }
  },
  'analyst.goswami': {
    password: 'data123',
    user: {
      id: '4',
      username: 'analyst.goswami',
      fullName: 'Anjali Goswami',
      role: 'data_analyst',
      district: 'Dibrugarh',
      department: 'Health Information System',
      lastLogin: new Date(),
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'as'>('en');

  useEffect(() => {
    // Only restore language preference, not user sessions
    const savedLanguage = localStorage.getItem('jalrakshak_language') as 'en' | 'as';
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Note: User sessions are not auto-restored for security
    // Users must log in each time they visit the application
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const userRecord = MOCK_USERS[username];
    
    if (userRecord && userRecord.password === password) {
      const updatedUser = { ...userRecord.user, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem('jalrakshak_user', JSON.stringify(updatedUser));
      return true;
    }
    
    return false;
  };

  const loginPublicUser = async (phone: string, otp: string): Promise<boolean> => {
    // Mock public user login - in real app, verify OTP with backend
    if (otp === '123456' || otp === '1234') {
      const publicUser: User = {
        id: 'public_' + Date.now(),
        username: phone,
        fullName: 'Community User',
        role: 'public_user',
        district: 'Dibrugarh',
        department: 'Public',
        phone: phone,
        lastLogin: new Date(),
      };
      setUser(publicUser);
      localStorage.setItem('jalrakshak_user', JSON.stringify(publicUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    console.log("AuthContext: Logging out user:", user?.username);
    setUser(null);
    localStorage.removeItem('jalrakshak_user');
    localStorage.removeItem('jalrakshak_language'); // Also clear language on logout
  };

  const handleSetLanguage = (lang: 'en' | 'as') => {
    setLanguage(lang);
    localStorage.setItem('jalrakshak_language', lang);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      language, 
      login,
      loginPublicUser, 
      logout, 
      setLanguage: handleSetLanguage 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}