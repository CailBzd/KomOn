// Configuration API pour l'application mobile KomOn
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: 'http://192.168.1.197:5000/api',
  
  // Timeout pour les requêtes
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    
    // Utilisateurs
    USERS: {
      PROFILE: '/users/profile',
      UPDATE: '/users/update',
      SPORTS: '/users/sports',
    },
    
    // Sports
    SPORTS: {
      ALL: '/sports',
      BY_ID: (id: string) => `/sports/${id}`,
      POPULAR: '/sports/popular',
    },
    
    // Événements
    EVENTS: {
      ALL: '/events',
      BY_ID: (id: string) => `/events/${id}`,
      CREATE: '/events',
      UPDATE: (id: string) => `/events/${id}`,
      DELETE: (id: string) => `/events/${id}`,
      REGISTER: (id: string) => `/events/${id}/register`,
      UNREGISTER: (id: string) => `/events/${id}/unregister`,
      MY_EVENTS: '/events/my-events',
      UPCOMING: '/events/upcoming',
    },
    
    // Messages
    MESSAGES: {
      ALL: '/messages',
      BY_USER: (userId: string) => `/messages/${userId}`,
      SEND: '/messages',
    },
    
    // Crédits
    CREDITS: {
      BALANCE: '/credits/balance',
      HISTORY: '/credits/history',
      PURCHASE: '/credits/purchase',
    },
  },
  
  // Codes de statut HTTP
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // Messages d'erreur
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erreur de connexion réseau',
    TIMEOUT_ERROR: 'Délai d\'attente dépassé',
    SERVER_ERROR: 'Erreur du serveur',
    UNAUTHORIZED: 'Non autorisé',
    NOT_FOUND: 'Ressource non trouvée',
    VALIDATION_ERROR: 'Erreur de validation',
    UNKNOWN_ERROR: 'Erreur inconnue',
  },
};

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour les données
export interface Sport {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  bio?: string;
  profile_picture_url?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  sport_id: string;
  sport?: Sport;
  organizer_id: string;
  organizer?: User;
  max_participants: number;
  price: number;
  status: string;
  type: string;
  difficulty_level: string;
  requirements?: string;
  image_url?: string;
  // Nouvelles propriétés avancées
  visibility: 'public' | 'private' | 'invitation';
  registration_type: 'automatic' | 'approval' | 'invitation_only';
  waiting_list_enabled: boolean;
  max_waiting_list: number;
  contribution_type: 'none' | 'fixed' | 'variable';
  contribution_amount: number;
  contribution_description: string;
  allow_guests: boolean;
  max_guests_per_participant: number;
  auto_approve_registrations: boolean;
  require_phone_number: boolean;
  require_emergency_contact: boolean;
  cancellation_policy: string;
  refund_policy: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface UserSport {
  id: string;
  user_id: string;
  sport_id: string;
  sport?: Sport;
  skill_level: string;
  is_favorite: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Credit {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description?: string;
  created_at: string;
}

// Configuration pour les requêtes
export const createApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const createHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}; 