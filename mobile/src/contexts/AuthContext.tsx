import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  bio?: string;
  profilePictureUrl?: string;
  role: string;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      const storedUser = await SecureStore.getItemAsync('auth_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.isSuccess && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        await SecureStore.setItemAsync('auth_token', response.token);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(response.user));
      } else {
        throw new Error(response.error || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.isSuccess && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        await SecureStore.setItemAsync('auth_token', response.token);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(response.user));
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('auth_user');
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    SecureStore.setItemAsync('auth_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
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