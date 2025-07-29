import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleStartAdventure = () => {
    navigation.navigate('Pricing');
  };

  const handleAlreadyHaveAccount = () => {
    navigation.navigate('Login');
  };

  const handleDiscoverMore = () => {
    // Ouvrir le site web dans le navigateur
    Linking.openURL('https://komon-app.com');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a202c" />
      
      <View style={styles.container}>
        {/* Logo et titre */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>K</Text>
            </View>
            <Text style={styles.logo}>KomOn!</Text>
            <Text style={styles.tagline}>Come On, Let's Move Together!</Text>
            <Text style={styles.subtitle}>Rejoins la communauté énergique de sportifs!</Text>
          </View>
        </View>

        {/* Illustration ou icône */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationIcon}>🏃‍♂️</Text>
            <Text style={styles.illustrationText}>Prêt à bouger?</Text>
            <Text style={styles.illustrationSubtext}>Crée des événements, participe, reste motivé!</Text>
          </View>
        </View>

        {/* Boutons principaux */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartAdventure}
            activeOpacity={0.8}
          >
            <View style={styles.primaryButtonGradient}>
              <Text style={styles.primaryButtonText}>🚀 Commencer l'aventure!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleAlreadyHaveAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>👤 J'ai déjà un compte!</Text>
          </TouchableOpacity>
        </View>

        {/* Section découvrir davantage */}
        <View style={styles.discoverSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={handleDiscoverMore}
            activeOpacity={0.8}
          >
            <Text style={styles.discoverButtonText}>🌐 En découvrir davantage!</Text>
            <Text style={styles.discoverButtonSubtext}>Visiter le site web KomOn!</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En continuant, vous acceptez nos{' '}
            <Text style={styles.linkText}>conditions d'utilisation</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#1a202c',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    fontWeight: '400',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    alignItems: 'center',
  },
  illustrationIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  illustrationText: {
    fontSize: 24,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  illustrationSubtext: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingBottom: 32,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FF6B35',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  discoverSection: {
    paddingBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 107, 53, 0.8)',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  discoverButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  discoverButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  discoverButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 107, 53, 0.8)',
  },
  footer: {
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#FF6B35',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
}); 