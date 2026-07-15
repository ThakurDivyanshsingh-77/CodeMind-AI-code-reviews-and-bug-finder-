'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginPayload, RegisterPayload } from '@/types/auth';
import { getMe, login as apiLogin, register as apiRegister } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await getMe();
        if (response.success && response.data.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const response = await apiLogin(payload);
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        await loadUser();
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await apiRegister(payload);
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        await loadUser();
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
