import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';
import { translateError } from '../utils/errorMessages';

console.log('🔧 API Base URL:', API_CONFIG.BASE_URL);

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
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Configuration pour ignorer les certificats auto-signés en développement
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    // En développement, ajouter des options pour ignorer les erreurs SSL
    if (__DEV__) {
      console.log('🔧 Development mode: Using HTTP for API calls');
    }
    
    console.log('🌐 Request:', options.method || 'GET', url);
    if (options.body) {
      console.log('📤 Request body:', options.body);
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('📡 API call to:', url);
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        console.error('❌ HTTP Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error('  Error type:', typeof error);
      console.error('  Error message:', error instanceof Error ? error.message : error);
      console.error('  Full error:', JSON.stringify(error, null, 2));
      
      // Traduire l'erreur pour l'utilisateur
      const translatedError = translateError(error);
      throw new Error(translatedError);
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }



  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error('❌ Register failed:', error);
      throw error;
    }
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
    // En développement, utiliser un fallback
    if (__DEV__) {
      console.log('🔧 Development mode: Using fallback forgot password');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            isSuccess: true,
            error: 'Email de réinitialisation envoyé (mode développement)',
          });
        }, 1000);
      });
    }
    
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