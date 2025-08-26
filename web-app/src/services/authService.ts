import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.197:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface LoginResponse {
  isSuccess: boolean
  token?: string
  user?: any
  error?: string
}

export interface RegisterResponse {
  isSuccess: boolean
  token?: string
  user?: any
  error?: string
}

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials)
      return {
        isSuccess: true,
        token: response.data.token,
        user: response.data.user,
      }
    } catch (error: any) {
      // Gestion détaillée des erreurs
      if (error.response?.status === 401) {
        return {
          isSuccess: false,
          error: 'Email ou mot de passe incorrect',
        }
      } else if (error.response?.status === 400) {
        return {
          isSuccess: false,
          error: error.response.data?.message || 'Données de connexion invalides',
        }
      } else if (error.response?.status === 500) {
        return {
          isSuccess: false,
          error: 'Erreur serveur. Veuillez réessayer plus tard.',
        }
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        return {
          isSuccess: false,
          error: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        }
      } else {
        return {
          isSuccess: false,
          error: error.response?.data?.message || 'Erreur de connexion inattendue',
        }
      }
    }
  },

  async register(userData: any): Promise<RegisterResponse> {
    try {
      const response = await api.post('/auth/register', userData)
      return {
        isSuccess: true,
        token: response.data.token,
        user: response.data.user,
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        error: error.response?.data?.message || 'Erreur d\'inscription',
      }
    }
  },

  async logout(token: string): Promise<{ isSuccess: boolean }> {
    try {
      await api.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { isSuccess: true }
    } catch (error: any) {
      // Même en cas d'erreur, on considère la déconnexion comme réussie côté client
      return { isSuccess: true }
    }
  },

  async forgotPassword(email: string): Promise<{ isSuccess: boolean; error?: string }> {
    try {
      await api.post('/auth/forgot-password', { email })
      return { isSuccess: true }
    } catch (error: any) {
      return {
        isSuccess: false,
        error: error.response?.data?.message || 'Erreur lors de la demande de réinitialisation',
      }
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ isSuccess: boolean; error?: string }> {
    try {
      await api.post('/auth/reset-password', { token, newPassword })
      return { isSuccess: true }
    } catch (error: any) {
      return {
        isSuccess: false,
        error: error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe',
      }
    }
  },
} 