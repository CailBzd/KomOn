import { API_CONFIG, createApiUrl, createHeaders, ApiResponse, PaginatedResponse, Sport, Event, User } from '../config/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = createApiUrl(endpoint);
      const headers = createHeaders();
      
      const config: RequestInit = {
        headers,
        ...options,
      };

      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      
      // Vérifier le type de contenu de la réponse
      const contentType = response.headers.get('content-type');
      console.log(`📡 API Response: ${response.status} - Content-Type: ${contentType}`);
      
      let data: T;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json() as T;
      } else {
        // Si ce n'est pas du JSON, lire le texte brut pour diagnostiquer
        const textResponse = await response.text();
        console.error('❌ Réponse non-JSON reçue:', textResponse.substring(0, 200));
        throw new Error(`Réponse non-JSON reçue: ${contentType}`);
      }

      console.log(`📡 API Response: ${response.status}`, data);

      if (!response.ok) {
        const errorData = data as any;
        throw new Error(errorData.message || API_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR);
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : API_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR,
      };
    }
  }

  // ===== SPORTS =====
  
  async getAllSports(): Promise<ApiResponse<Sport[]>> {
    return this.request<Sport[]>(API_CONFIG.ENDPOINTS.SPORTS.ALL);
  }

  async getSportById(id: string): Promise<ApiResponse<Sport>> {
    return this.request<Sport>(API_CONFIG.ENDPOINTS.SPORTS.BY_ID(id));
  }

  async getPopularSports(): Promise<ApiResponse<Sport[]>> {
    return this.request<Sport[]>(API_CONFIG.ENDPOINTS.SPORTS.POPULAR);
  }

  // ===== EVENTS =====

  async getAllEvents(filters?: {
    location?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    sport?: string;
  }): Promise<ApiResponse<Event[]>> {
    let endpoint = API_CONFIG.ENDPOINTS.EVENTS.ALL;
    
    // Ajouter les paramètres de filtrage à l'URL
    const params = new URLSearchParams();
    if (filters?.location) params.append('location', filters.location);
    if (filters?.latitude) params.append('latitude', filters.latitude.toString());
    if (filters?.longitude) params.append('longitude', filters.longitude.toString());
    if (filters?.radius) params.append('radius', filters.radius.toString());
    if (filters?.sport) params.append('sport', filters.sport);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.request<Event[]>(endpoint);
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    return this.request<Event>(API_CONFIG.ENDPOINTS.EVENTS.BY_ID(id));
  }

  async getUpcomingEvents(): Promise<ApiResponse<Event[]>> {
    return this.request<Event[]>(API_CONFIG.ENDPOINTS.EVENTS.UPCOMING);
  }

  async createEvent(eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    return this.request<Event>(API_CONFIG.ENDPOINTS.EVENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    return this.request<Event>(API_CONFIG.ENDPOINTS.EVENTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.EVENTS.DELETE(id), {
      method: 'DELETE',
    });
  }

  async registerToEvent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.EVENTS.REGISTER(id), {
      method: 'POST',
    });
  }

  async unregisterFromEvent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.EVENTS.UNREGISTER(id), {
      method: 'DELETE',
    });
  }

  // ===== USERS =====

  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE);
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.USERS.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserSports(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_CONFIG.ENDPOINTS.USERS.SPORTS);
  }

  // ===== AUTHENTICATION =====

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request<{ token: string; user: User }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request<{ token: string; user: User }>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}

// Instance singleton
export const apiService = new ApiService();

// Export des types pour utilisation dans d'autres fichiers
export type { ApiResponse, PaginatedResponse, Sport, Event, User }; 