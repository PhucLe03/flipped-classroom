'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ApiResponse } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string, role?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('fc_token');
        const storedUser = localStorage.getItem('fc_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify with server
          const res = await api.get<ApiResponse<User>>('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('fc_user', JSON.stringify(res.data.user));
          }
        }
      } catch (err) {
        console.warn('[Auth] Session validation failed:', err);
        localStorage.removeItem('fc_token');
        localStorage.removeItem('fc_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<ApiResponse>('/auth/login', { email, password });
      if (res.data.success && res.data.token && res.data.user) {
        localStorage.setItem('fc_token', res.data.token);
        localStorage.setItem('fc_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Đăng nhập không thành công' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Email hoặc mật khẩu không chính xác',
      };
    }
  };

  const register = async (fullName: string, email: string, password: string, role?: string) => {
    try {
      const res = await api.post<ApiResponse>('/auth/register', {
        fullName,
        email,
        password,
        role: role || 'student',
      });
      if (res.data.success && res.data.token && res.data.user) {
        localStorage.setItem('fc_token', res.data.token);
        localStorage.setItem('fc_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Đăng ký không thành công' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Đăng ký không thành công',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('fc_token');
    localStorage.removeItem('fc_user');
    setUser(null);
    setToken(null);
    window.location.href = './dang-nhap';
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get<ApiResponse<User>>('/auth/me');
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('fc_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
