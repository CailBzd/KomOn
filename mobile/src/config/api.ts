// Configuration des URLs d'API selon l'environnement
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: __DEV__ 
    ? 'http://192.168.1.197:5000/api'  // Développement - HTTP
    : 'https://api.komon.ptilab.fr/api', // Production - HTTPS
  
  // Timeout des requêtes
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuration pour le développement
  DEV: {
    LOG_REQUESTS: true,
    LOG_RESPONSES: true,
    LOG_ERRORS: true,
  }
};

// Log de la configuration au démarrage
if (__DEV__) {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    ENVIRONMENT: 'Development',
    PROTOCOL: 'HTTP'
  });
} 