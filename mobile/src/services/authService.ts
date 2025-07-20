import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://localhost:7001/api';

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
  user?: User;
  error?: string;
  expiresAt?: string;
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('HTTP error! status:')) {
          throw error;
        }
        
        // Fallback pour le développement
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return this.fallbackLogin(data);
        }
        
        throw error;
      }
      throw error;
    }
  }

  private fallbackLogin(data: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
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
      }, 1000);
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('HTTP error! status:')) {
          throw error;
        }
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return this.fallbackRegister(data);
        }
        
        throw error;
      }
      throw error;
    }
  }

  private fallbackRegister(data: RegisterRequest): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
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
      }, 1000);
    });
  }

  async logout(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(token),
    });
  }

  async getProfile(): Promise<AuthResponse> {
    const token = await SecureStore.getItemAsync('auth_token');
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
    dateOfBirth?: string;
    bio?: string;
  }): Promise<AuthResponse> {
    const token = await SecureStore.getItemAsync('auth_token');
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