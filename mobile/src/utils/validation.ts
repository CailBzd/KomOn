// Utilitaires de validation pour l'application mobile

/**
 * Valide le format d'une adresse email
 * @param email - L'adresse email à valider
 * @returns true si l'email est valide, false sinon
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valide la force d'un mot de passe
 * @param password - Le mot de passe à valider
 * @returns Un objet avec isValid et errors
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password || password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valide un numéro de téléphone français
 * @param phoneNumber - Le numéro de téléphone à valider
 * @returns true si le numéro est valide, false sinon
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  
  // Regex pour les numéros français (format international ou national)
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phoneNumber.trim());
};

/**
 * Valide un nom d'utilisateur
 * @param username - Le nom d'utilisateur à valider
 * @returns true si le nom d'utilisateur est valide, false sinon
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // Regex pour les noms d'utilisateur (lettres, chiffres, tirets, underscores)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username.trim()) && username.length >= 3 && username.length <= 50;
};

/**
 * Valide une date de naissance
 * @param dateOfBirth - La date de naissance à valider (format YYYY-MM-DD)
 * @returns true si la date est valide, false sinon
 */
export const isValidDateOfBirth = (dateOfBirth: string): boolean => {
  if (!dateOfBirth || typeof dateOfBirth !== 'string') {
    return false;
  }
  
  const date = new Date(dateOfBirth);
  const today = new Date();
  const minAge = 13; // Âge minimum
  const maxAge = 120; // Âge maximum
  
  // Vérifier que la date est valide
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Vérifier que la date n'est pas dans le futur
  if (date > today) {
    return false;
  }
  
  // Vérifier l'âge minimum et maximum
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
}; 