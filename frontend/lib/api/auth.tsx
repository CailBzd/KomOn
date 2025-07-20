"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001/api';

// Debug: afficher la valeur de l'API_BASE_URL
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// Types pour TypeScript
export interface UserDto {
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

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
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
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        console.log('❌ HTTP Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Marquer les erreurs de réseau pour les distinguer des erreurs d'authentification
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new Error('Network error: ' + error.message);
        networkError.name = 'NetworkError';
        throw networkError;
      }
      
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('🚀 Début de la fonction register avec les données:', data);
    try {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('✅ Register réussi via API:', response);
      return response;
    } catch (error) {
      console.log('❌ Erreur dans register:', error);
      // Vérifier si c'est une erreur de réseau ou une erreur d'inscription
      if (error instanceof Error) {
        // Si c'est une erreur HTTP (400, 409, etc.), c'est une erreur d'inscription
        if (error.message.includes('HTTP error! status:')) {
          console.log('❌ Erreur d\'inscription HTTP:', error.message);
          throw error;
        }
        
        // Si c'est une erreur de réseau (TypeError avec fetch), utiliser le fallback
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.log('🔄 API non disponible, utilisation du mode fallback');
          return this.fallbackRegister(data);
        }
        
        // Pour toute autre erreur, la propager
        throw error;
      }
      throw error;
    }
  }

  // Méthode de fallback pour l'inscription en développement
  private fallbackRegister(data: RegisterRequest): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: UserDto = {
          id: '1',
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
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

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Vérifier si c'est une erreur de réseau ou une erreur d'authentification
      if (error instanceof Error) {
        // Si c'est une erreur HTTP (401, 400, etc.), c'est une erreur d'authentification
        if (error.message.includes('HTTP error! status:')) {
          console.log('❌ Erreur d\'authentification:', error.message);
          throw error;
        }
        
        // Si c'est une erreur de réseau (TypeError avec fetch), utiliser le fallback
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.log('🔄 API non disponible, utilisation du mode fallback');
          return this.fallbackLogin(data);
        }
        
        // Pour toute autre erreur, la propager
        throw error;
      }
      throw error;
    }
  }

  // Méthode de fallback pour le développement
  private fallbackLogin(data: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: UserDto = {
          id: '1',
          username: 'demo_user',
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

  // Méthode changePassword déplacée vers le profil

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

  async sendEmailVerification(email: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/send-email-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async sendSmsVerification(phoneNumber: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/send-sms-verification', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyEmailCode(email: string, code: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async verifySmsCode(phoneNumber: string, code: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/verify-sms', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code }),
    });
  }

  // Méthodes pour la gestion du profil
  async getProfile(): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token d\'authentification requis');
    }
    
    return this.request<AuthResponse>('/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(data: {
    username?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    bio?: string;
  }): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token d\'authentification requis');
    }
    
    return this.request<AuthResponse>('/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateProfilePicture(data: { imageUrl: string }): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token d\'authentification requis');
    }
    
    return this.request<AuthResponse>('/user/profile/picture', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token d\'authentification requis');
    }
    
    return this.request<AuthResponse>('/user/profile/password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.isSuccess && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      // Retourne toujours la réponse pour permettre au composant de gérer le cas "en attente de validation"
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
    } catch (e) {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Effacer aussi les données "Se souvenir de moi" lors de la déconnexion
      localStorage.removeItem('komon_remembered_email');
      localStorage.removeItem('komon_remember_me');
      setLoading(false);
    }
  }

  const updateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
} 