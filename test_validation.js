// Test des validations côté client
const { isValidEmail, validatePassword, isValidUsername, isValidPhoneNumber, isValidDateOfBirth } = require('./mobile/src/utils/validation.ts');

console.log('🧪 Test des validations...\n');

// Test validation email
console.log('📧 Test validation email:');
console.log('  test@example.com:', isValidEmail('test@example.com')); // true
console.log('  invalid-email:', isValidEmail('invalid-email')); // false
console.log('  @example.com:', isValidEmail('@example.com')); // false
console.log('  test@:', isValidEmail('test@')); // false
console.log('  test@.com:', isValidEmail('test@.com')); // false
console.log('  test.example.com:', isValidEmail('test.example.com')); // false
console.log('  test+tag@example.com:', isValidEmail('test+tag@example.com')); // true
console.log('  test@example.co.uk:', isValidEmail('test@example.co.uk')); // true
console.log('');

// Test validation mot de passe
console.log('🔐 Test validation mot de passe:');
console.log('  Password123!:', validatePassword('Password123!'));
console.log('  weak:', validatePassword('weak'));
console.log('  password:', validatePassword('password'));
console.log('  PASSWORD:', validatePassword('PASSWORD'));
console.log('  Password:', validatePassword('Password'));
console.log('  Password123:', validatePassword('Password123'));
console.log('');

// Test validation nom d'utilisateur
console.log('👤 Test validation nom d\'utilisateur:');
console.log('  john_doe:', isValidUsername('john_doe')); // true
console.log('  john-doe:', isValidUsername('john-doe')); // true
console.log('  john123:', isValidUsername('john123')); // true
console.log('  jo:', isValidUsername('jo')); // false (trop court)
console.log('  john@doe:', isValidUsername('john@doe')); // false (caractère non autorisé)
console.log('');

// Test validation numéro de téléphone
console.log('📱 Test validation numéro de téléphone:');
console.log('  +33123456789:', isValidPhoneNumber('+33123456789')); // true
console.log('  0123456789:', isValidPhoneNumber('0123456789')); // true
console.log('  01 23 45 67 89:', isValidPhoneNumber('01 23 45 67 89')); // true
console.log('  01.23.45.67.89:', isValidPhoneNumber('01.23.45.67.89')); // true
console.log('  123456789:', isValidPhoneNumber('123456789')); // false (pas de préfixe)
console.log('  invalid:', isValidPhoneNumber('invalid')); // false
console.log('');

// Test validation date de naissance
console.log('🎂 Test validation date de naissance:');
const today = new Date();
const adultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate()).toISOString().split('T')[0];
const childDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()).toISOString().split('T')[0];
const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0];

console.log('  Date adulte (25 ans):', isValidDateOfBirth(adultDate)); // true
console.log('  Date enfant (10 ans):', isValidDateOfBirth(childDate)); // false (trop jeune)
console.log('  Date future:', isValidDateOfBirth(futureDate)); // false
console.log('  Date invalide:', isValidDateOfBirth('invalid-date')); // false
console.log('');

console.log('✅ Tests terminés !'); 