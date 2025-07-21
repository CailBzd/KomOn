import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ValidatedInput from './ValidatedInput';
import { isValidEmail } from '../utils/validation';

export default function EmailValidationDemo() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  // Validation en temps réel
  React.useEffect(() => {
    if (isEmailTouched && email) {
      if (!isValidEmail(email)) {
        setEmailError('Veuillez saisir une adresse email valide');
      } else {
        setEmailError('');
      }
    }
  }, [email, isEmailTouched]);

  // Validation immédiate si l'email est clairement invalide
  React.useEffect(() => {
    if (email && email.includes('@') && !isValidEmail(email)) {
      setEmailError('Veuillez saisir une adresse email valide');
    }
  }, [email]);

  const testEmails = [
    'test@example.com',
    'invalid-email',
    'user@',
    'user@.com',
    'user..name@example.com',
  ];

  const testEmail = (emailToTest: string) => {
    setEmail(emailToTest);
    setIsEmailTouched(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test de Validation d'Email</Text>
      
      <ValidatedInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="votre@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={emailError}
        onBlur={() => setIsEmailTouched(true)}
      />

      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Tests rapides :</Text>
                 {testEmails.map((emailToTest, index) => (
           <TouchableOpacity
             key={index}
             style={styles.testButton}
             onPress={() => testEmail(emailToTest)}
           >
             <Text style={styles.testButtonText}>{emailToTest}</Text>
           </TouchableOpacity>
         ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>État actuel :</Text>
        <Text style={styles.infoText}>
          Email : "{email || 'vide'}"
        </Text>
        <Text style={styles.infoText}>
          Touché : {isEmailTouched ? 'Oui' : 'Non'}
        </Text>
        <Text style={styles.infoText}>
          Valide : {email ? (isValidEmail(email) ? 'Oui' : 'Non') : 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          Erreur : "{emailError || 'Aucune'}"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  testSection: {
    marginTop: 20,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#e2e8f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  testButtonText: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
  infoSection: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
  },
}); 