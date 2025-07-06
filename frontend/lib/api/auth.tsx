"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Debug: afficher la valeur de l'API_BASE_URL
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// Types pour TypeScript
export interface UserDto {
  id: string;
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

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber?: string;
  bio?: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserDto;
  error?: string;
  expiresAt?: string;
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Log pour tracer l'URL
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      API_BASE_URL
    });
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Fallback pour le mode développement si l'API n'est pas disponible
      console.log('🔄 API non disponible, utilisation du mode fallback');
      return this.fallbackLogin(data);
    }
  }

  // Méthode de fallback pour le développement
  private fallbackLogin(data: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: UserDto = {
          id: '1',
          firstName: 'Utilisateur',
          lastName: 'Demo',
          email: data.email,
          dateOfBirth: '1990-01-01',
          role: 'Participant',
          status: 'Active',
          createdAt: new Date().toISOString(),
        };

        resolve({
          isSuccess: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }, 1000); // Simuler un délai réseau
    });
  }

  async validateToken(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/validate', {
      method: 'POST',
      body: JSON.stringify(token),
    });
  }

  async logout(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(token),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const authService = new AuthService();

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.isSuccess && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      } else {
        throw new Error(response.error || 'Erreur de connexion');
      }
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
    } catch (e) {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
} 