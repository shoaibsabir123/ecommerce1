import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ShippingAddress } from '../types';
import { getCurrentUser, setCurrentUser, registerUser, switchDemoUser, getUsers, saveProduct } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'customer' | 'admin') => void;
  addSavedAddress: (address: ShippingAddress) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => getCurrentUser());

  useEffect(() => {
    const handleUpdate = () => {
      setUserState(getCurrentUser());
    };
    window.addEventListener('aura_store_updated', handleUpdate);
    return () => window.removeEventListener('aura_store_updated', handleUpdate);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    const allUsers = getUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setUserState(found);
      return true;
    }
    // Auto register if new
    const created = registerUser(email, email.split('@')[0], 'customer');
    setUserState(created);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const created = registerUser(email, name, 'customer');
    setUserState(created);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserState(null);
  };

  const switchRole = (role: 'customer' | 'admin') => {
    const switched = switchDemoUser(role);
    setUserState(switched);
  };

  const addSavedAddress = (address: ShippingAddress) => {
    if (!user) return;
    const updated = {
      ...user,
      savedAddresses: [...(user.savedAddresses || []), address]
    };
    setCurrentUser(updated);
    setUserState(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        switchRole,
        addSavedAddress
      }}
    >
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
