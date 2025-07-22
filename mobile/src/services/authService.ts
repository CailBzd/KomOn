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
    try {
      console.log('🔐 Tentative de déconnexion...');
      const response = await this.request<AuthResponse>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify(token),
      });
      console.log('✅ Déconnexion réussie côté serveur');
      return response;
    } catch (error: any) {
      console.log('⚠️ Erreur lors de la déconnexion:', error.message);
      
      // Si l'erreur est 401 (token expiré), on considère que la déconnexion est réussie
      if (error.message && error.message.includes('401')) {
        console.log('🔄 Token expiré, déconnexion locale réussie');
        return {
          isSuccess: true,
          error: 'Session expirée. Déconnexion réussie.',
          token: null,
          user: null,
          expiresAt: null
        };
      }
      
      // Pour les autres erreurs, on considère aussi que la déconnexion est réussie localement
      console.log('🔄 Erreur réseau, déconnexion locale réussie');
      return {
        isSuccess: true,
        error: 'Déconnexion locale réussie (erreur réseau)',
        token: null,
        user: null,
        expiresAt: null
      };
    }
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
    
    try {
      const response = await this.request<any>('/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Le backend retourne { message: string, user: UserDto }
      // On doit adapter cette réponse au format AuthResponse attendu
      if (response && response.user) {
        return {
          isSuccess: true,
          user: {
            id: response.user.id,
            username: response.user.username,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            phoneNumber: response.user.phoneNumber,
            dateOfBirth: response.user.dateOfBirth,
            bio: response.user.bio,
            profilePictureUrl: response.user.profilePictureUrl,
            role: response.user.role,
            status: response.user.status,
            createdAt: response.user.createdAt,
          },
          error: undefined,
        };
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      // Si l'erreur vient du backend avec un message d'erreur
      if (error.message && error.message.includes('Ce pseudo est déjà utilisé')) {
        return {
          isSuccess: false,
          error: 'Ce pseudo est déjà utilisé.',
          user: undefined,
        };
      }
      
      // Pour les autres erreurs, on les propage
      throw error;
    }
  }

  async updateProfilePicture(data: { imageUrl: string }): Promise<AuthResponse> {
    const token = await SecureStore.getItemAsync('auth_token');
    if (!token) {
      throw new Error('Token d\'authentification requis');
    }
    
    try {
      console.log('🖼️ Upload de la photo de profil:', data.imageUrl);
      
      const response = await this.request<any>('/user/profile/picture', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Réponse du serveur pour la photo:', response);

      // Le backend retourne { message: string, user: UserDto }
      // On doit adapter cette réponse au format AuthResponse attendu
      if (response && response.user) {
        return {
          isSuccess: true,
          user: {
            id: response.user.id,
            username: response.user.username,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            phoneNumber: response.user.phoneNumber,
            dateOfBirth: response.user.dateOfBirth,
            bio: response.user.bio,
            profilePictureUrl: response.user.profilePictureUrl,
            role: response.user.role,
            status: response.user.status,
            createdAt: response.user.createdAt,
          },
          error: undefined,
        };
      } else if (response && response.message) {
        // Si on a seulement un message de succès mais pas d'utilisateur
        console.log('⚠️ Réponse avec message mais sans utilisateur:', response.message);
        return {
          isSuccess: true,
          error: response.message,
          user: undefined,
        };
      } else {
        console.error('❌ Réponse invalide du serveur:', response);
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de la photo:', error);
      
      // Si l'erreur contient un message d'erreur du serveur
      if (error.message && error.message.includes('L\'URL de l\'image est requise')) {
        return {
          isSuccess: false,
          error: 'L\'URL de l\'image est requise.',
          user: undefined,
        };
      }
      
      throw error;
    }
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