// Messages d'erreur traduits pour l'application mobile

export const ERROR_MESSAGES = {
  // Erreurs d'authentification
  AUTH: {
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez.',
    EMAIL_NOT_CONFIRMED: 'Votre adresse email n\'a pas encore été validée. Vérifiez votre boîte mail.',
    USER_NOT_FOUND: 'Aucun compte trouvé avec cette adresse email.',
    INVALID_EMAIL: 'Veuillez saisir une adresse email valide.',
    WEAK_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères avec des majuscules, minuscules, chiffres et caractères spéciaux.',
    PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas.',
    USERNAME_TAKEN: 'Ce nom d\'utilisateur est déjà pris.',
    EMAIL_TAKEN: 'Cette adresse email est déjà utilisée.',
    INVALID_USERNAME: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.',
    INVALID_PHONE: 'Veuillez saisir un numéro de téléphone valide.',
    INVALID_DATE: 'Veuillez saisir une date de naissance valide.',
  },

  // Erreurs réseau
  NETWORK: {
    CONNECTION_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
    TIMEOUT: 'La requête a pris trop de temps. Veuillez réessayer.',
    SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
    UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
    FORBIDDEN: 'Accès refusé.',
    NOT_FOUND: 'Ressource non trouvée.',
    BAD_REQUEST: 'Données invalides.',
  },

  // Erreurs de validation
  VALIDATION: {
    REQUIRED_FIELDS: 'Veuillez remplir tous les champs obligatoires.',
    INVALID_FORMAT: 'Format invalide.',
    TOO_SHORT: 'Trop court.',
    TOO_LONG: 'Trop long.',
    INVALID_CHARACTERS: 'Caractères non autorisés.',
  },

  // Erreurs générales
  GENERAL: {
    UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    LOADING_ERROR: 'Erreur lors du chargement des données.',
    SAVE_ERROR: 'Erreur lors de la sauvegarde.',
    DELETE_ERROR: 'Erreur lors de la suppression.',
  }
};

/**
 * Traduit une erreur technique en message utilisateur
 * @param error - L'erreur technique
 * @returns Le message d'erreur traduit
 */
export const translateError = (error: any): string => {
  if (!error) {
    return ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
  }

  const errorMessage = error.message || error.toString();

  // Erreurs d'authentification
  if (errorMessage.includes('invalid_credentials') || errorMessage.includes('Invalid login credentials')) {
    return ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
  }

  if (errorMessage.includes('email_not_confirmed') || errorMessage.includes('email not confirmed')) {
    return ERROR_MESSAGES.AUTH.EMAIL_NOT_CONFIRMED;
  }

  if (errorMessage.includes('user not found')) {
    return ERROR_MESSAGES.AUTH.USER_NOT_FOUND;
  }

  // Erreurs réseau
  if (errorMessage.includes('Network error') || errorMessage.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK.CONNECTION_ERROR;
  }

  if (errorMessage.includes('timeout')) {
    return ERROR_MESSAGES.NETWORK.TIMEOUT;
  }

  // Erreurs HTTP
  if (errorMessage.includes('HTTP error! status: 401')) {
    return ERROR_MESSAGES.NETWORK.UNAUTHORIZED;
  }

  if (errorMessage.includes('HTTP error! status: 403')) {
    return ERROR_MESSAGES.NETWORK.FORBIDDEN;
  }

  if (errorMessage.includes('HTTP error! status: 404')) {
    return ERROR_MESSAGES.NETWORK.NOT_FOUND;
  }

  if (errorMessage.includes('HTTP error! status: 400')) {
    return ERROR_MESSAGES.NETWORK.BAD_REQUEST;
  }

  if (errorMessage.includes('HTTP error! status: 500')) {
    return ERROR_MESSAGES.NETWORK.SERVER_ERROR;
  }

  // Si c'est déjà un message traduit, le retourner tel quel
  if (Object.values(ERROR_MESSAGES.AUTH).includes(errorMessage) ||
      Object.values(ERROR_MESSAGES.NETWORK).includes(errorMessage) ||
      Object.values(ERROR_MESSAGES.VALIDATION).includes(errorMessage) ||
      Object.values(ERROR_MESSAGES.GENERAL).includes(errorMessage)) {
    return errorMessage;
  }

  // Message par défaut
  return ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
}; 