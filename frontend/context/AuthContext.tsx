'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { safeFetch } from '@/utils/safeFetch';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  role: 'scout' | 'leader' | 'patrol-leader' | 'admin' | 'commissioner';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, scoutRegNo?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and user on load
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      safeFetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => {
          if (res && (res.status === 401 || res.status === 404)) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            setToken(null);
            setUser(null);
          } else if (res && res.ok) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        })
        .catch(() => {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, scoutRegNo?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, scout_reg_no: scoutRegNo }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === 'scout') router.push('/scout/dashboard');
        else if (data.user.role === 'leader') router.push('/leader/dashboard');
        else if (data.user.role === 'patrol-leader' || data.user.role === 'patrol_leader') router.push('/patrol-leader/dashboard');
        else if (data.user.role === 'admin' || data.user.role === 'commissioner') router.push('/admin/dashboard');
        else router.push('/'); // Fallback
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'scout') router.push('/scout/dashboard');
        else if (data.user.role === 'leader') router.push('/leader/dashboard');
        else if (data.user.role === 'patrol-leader' || data.user.role === 'patrol_leader') router.push('/patrol-leader/dashboard');
        else if (data.user.role === 'admin' || data.user.role === 'commissioner') router.push('/admin/dashboard');
        else router.push('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, error }}>
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
