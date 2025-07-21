// Test de validation d'email
const { isValidEmail } = require('./mobile/src/utils/validation.ts');

// Emails de test
const testEmails = [
  // Emails valides
  'test@example.com',
  'user.name@domain.co.uk',
  'user+tag@example.org',
  'user123@test-domain.com',
  
  // Emails invalides
  'invalid-email',
  '@example.com',
  'user@',
  'user@.com',
  'user..name@example.com',
  'user@example..com',
  'user name@example.com',
  'user@example com',
  '',
  '   ',
  'user@example',
  'user@.com',
  '.user@example.com',
  'user.@example.com',
];

console.log('🧪 Test de validation d\'email\n');

testEmails.forEach(email => {
  const isValid = isValidEmail(email);
  const status = isValid ? '✅ VALIDE' : '❌ INVALIDE';
  console.log(`${status} : "${email}"`);
});

console.log('\n📊 Résumé :');
const validCount = testEmails.filter(email => isValidEmail(email)).length;
const invalidCount = testEmails.length - validCount;
console.log(`Emails valides : ${validCount}`);
console.log(`Emails invalides : ${invalidCount}`);
console.log(`Total testés : ${testEmails.length}`); 