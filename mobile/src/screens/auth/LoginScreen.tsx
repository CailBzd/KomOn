import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail } from '../../utils/validation';
import ValidatedInput from '../../components/ValidatedInput';
import ValidationMessage from '../../components/ValidationMessage';
import LoadingButton from '../../components/LoadingButton';
import SafeScreen from '../../components/SafeScreen';
import StatusBarManager, { StatusBarPresets } from '../../components/StatusBarManager';
import DeviceAwareHeader from '../../components/DeviceAwareHeader';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const { login } = useAuth();

  // Validation en temps réel de l'email
  useEffect(() => {
    if (isEmailTouched && email) {
      if (!isValidEmail(email)) {
        setEmailError('Veuillez saisir une adresse email valide');
      } else {
        setEmailError('');
      }
    }
  }, [email, isEmailTouched]);

  // Validation immédiate si l'email est clairement invalide
  useEffect(() => {
    if (email && email.includes('@') && !isValidEmail(email)) {
      setEmailError('Veuillez saisir une adresse email valide');
    }
  }, [email]);

  // Réinitialiser les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (passwordError && password) {
      setPasswordError('');
    }
    if (generalError && (email || password)) {
      setGeneralError('');
    }
  }, [password, passwordError, generalError]);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('L\'email est requis');
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError('Veuillez saisir une adresse email valide');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Réinitialiser les erreurs
    setGeneralError('');
    
    // Validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBarManager {...StatusBarPresets.light} />
      <SafeScreen
        statusBarStyle="dark-content"
        backgroundColor="#f7fafc"
        edges={['top', 'bottom', 'left', 'right']}
        paddingTop={0}
        paddingBottom={0}
        paddingHorizontal={20}
        extraTopPadding={5} // Marge supplémentaire pour les appareils complexes
        extraBottomPadding={5} // Marge supplémentaire pour la barre de navigation
      >
        <DeviceAwareHeader
          title="Connexion"
          showBackButton
          onBackPress={() => navigation.navigate('Welcome')}
          backgroundColor="#f7fafc"
          textColor="#2d3748"
          elevation={0}
          extraTopPadding={5} // Marge supplémentaire pour les appareils complexes
        />
        
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>K</Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Bon retour !</Text>
              <Text style={styles.subtitle}>
                Connectez-vous à votre compte KomOn
              </Text>

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

              <ValidatedInput
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                placeholder="Votre mot de passe"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                error={passwordError}
                showEyeIcon={true}
                onEyePress={() => setShowPassword(!showPassword)}
                showEyeIconState={showPassword}
              />

              <ValidationMessage
                message={generalError}
                type="error"
                visible={!!generalError}
              />

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>

              <LoadingButton
                title="Se connecter"
                loadingTitle="Connexion en cours..."
                onPress={handleLogin}
                loading={loading}
                disabled={!email || !password}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity 
                style={styles.signupButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.signupButtonText}>
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>
                      </ScrollView>
          </KeyboardAvoidingView>
        </SafeScreen>
      </>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 80, // Espace pour le header
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: '#319795',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#319795',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#319795',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#718096',
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#319795',
  },
  signupButtonText: {
    color: '#319795',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

}); 