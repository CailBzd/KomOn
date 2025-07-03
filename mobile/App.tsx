import * as React from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [showPricing, setShowPricing] = React.useState(false);

  if (!showPricing) {
    return (
      <>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="#f7fafc" 
          translucent={false}
        />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Hero Section */}
              <View style={styles.heroSection}>
                {/* Logo avec animation subtile */}
                <View style={styles.logoContainer}>
                  <View style={styles.logoBox}>
                    <Text style={styles.logoText}>K</Text>
                  </View>
                  <View style={styles.logoGlow} />
                </View>
                
                {/* Titre principal avec gradient effect */}
                <Text style={styles.mainTitle}>
                  KomOn
                </Text>
                
                {/* Tagline */}
                <Text style={styles.tagline}>
                  Organisez vos événements sportifs locaux
                </Text>
                
                {/* Description améliorée */}
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText}>
                    Rejoignez la communauté KomOn et découvrez une nouvelle façon d'organiser et de participer à des événements sportifs près de chez vous.
                  </Text>
                </View>
              </View>
              
              {/* Fonctionnalités avec design moderne */}
              <View style={styles.featuresSection}>
                <Text style={styles.sectionTitle}>Pourquoi choisir KomOn ?</Text>
                
                <View style={styles.featuresGrid}>
                  <View style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Text style={styles.featureIcon}>🏃‍♂️</Text>
                    </View>
                    <Text style={styles.featureTitle}>Événements Sportifs</Text>
                    <Text style={styles.featureDesc}>Créez et participez à des événements locaux</Text>
                  </View>
                  
                  <View style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Text style={styles.featureIcon}>👥</Text>
                    </View>
                    <Text style={styles.featureTitle}>Communauté</Text>
                    <Text style={styles.featureDesc}>Rejoignez des passionnés près de chez vous</Text>
                  </View>
                  
                  <View style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Text style={styles.featureIcon}>🎯</Text>
                    </View>
                    <Text style={styles.featureTitle}>Système de Crédits</Text>
                    <Text style={styles.featureDesc}>Gagnez des crédits en participant</Text>
                  </View>
                </View>
              </View>
              
              {/* Actions Section */}
              <View style={styles.actionsSection}>
                {/* Bouton principal */}
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => setShowPricing(true)}
                >
                  <Text style={styles.primaryButtonText}>Commencer l'aventure</Text>
                </TouchableOpacity>
                
                {/* Bouton secondaire pour connexion */}
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => {
                    // TODO: Navigation vers la page de connexion
                    console.log('Navigation vers connexion');
                  }}
                >
                  <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
                </TouchableOpacity>
              </View>
              
              {/* Footer avec statistiques */}
              <View style={styles.footerSection}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>1000+</Text>
                    <Text style={styles.statLabel}>Événements créés</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>5000+</Text>
                    <Text style={styles.statLabel}>Membres actifs</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f7fafc" 
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header avec bouton retour amélioré */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setShowPricing(false)}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Choisissez votre plan</Text>
              <View style={styles.headerSpacer} />
            </View>
            
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>K</Text>
              </View>
            </View>
            
            {/* Explication système de crédits */}
            <View style={styles.card}>
              <Text style={styles.subtitle}>
                Rejoignez la communauté KomOn avec notre système de crédits innovant.
              </Text>
              <View style={styles.creditRow}>
                <Text style={styles.creditText}>
                  <Text style={{fontWeight:'bold'}}>1 crédit</Text> = <Text style={{fontWeight:'bold'}}>1 événement créé</Text>
                </Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditText}>
                  <Text style={{fontWeight:'bold'}}>Participer</Text> = <Text style={{fontWeight:'bold'}}>Gagner des crédits</Text>
                </Text>
              </View>
            </View>
            
            {/* Plans avec design amélioré */}
            <View style={styles.plansSection}>
              {/* Plan Gratuit */}
              <View style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, {color: '#319795'}]}>Gratuit</Text>
                  <Text style={styles.planDesc}>Parfait pour commencer</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>Gratuit</Text>
                </View>
                <View style={styles.creditsRow}>
                  <Text style={styles.creditsText}>Aucun crédit</Text>
                </View>
                <Text style={styles.creditEarning}>5 participations = 1 crédit</Text>
                <TouchableOpacity style={[styles.cta, {backgroundColor: '#319795'}]}>
                  <Text style={styles.ctaText}>Commencer gratuitement</Text>
                </TouchableOpacity>
              </View>
              
              {/* Plan Premium */}
              <View style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, {color: '#7c3aed'}]}>Premium</Text>
                  <Text style={styles.planDesc}>Pour les organisateurs passionnés</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>6,99€</Text>
                </View>
                <View style={styles.creditsRow}>
                  <Text style={styles.creditsText}>5 crédits</Text>
                </View>
                <Text style={styles.creditEarning}>3 participations = 1 crédit</Text>
                <TouchableOpacity style={[styles.cta, {backgroundColor: '#7c3aed'}]}>
                  <Text style={styles.ctaText}>Choisir Premium</Text>
                </TouchableOpacity>
              </View>
              
              {/* Plan Illimité */}
              <View style={[styles.planCard, styles.popularCard]}>
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, {color: '#fbbf24'}]}>Illimité</Text>
                  <Text style={styles.planDesc}>Pour les organisateurs intensifs</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Populaire</Text>
                  </View>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>12,99€</Text>
                </View>
                <View style={styles.creditsRow}>
                  <Text style={styles.creditsText}>Crédits illimités</Text>
                </View>
                <Text style={styles.creditEarning}>Pas de limite</Text>
                <TouchableOpacity style={[styles.cta, {backgroundColor: '#fbbf24'}]}>
                  <Text style={styles.ctaText}>Choisir Illimité</Text>
                </TouchableOpacity>
              </View>
              
              {/* Plan Partenariat */}
              <View style={[styles.planCard, {borderColor: '#fb923c', borderWidth: 1, backgroundColor: '#fff7ed'}]}>
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, {color: '#fb923c'}]}>Partenariat</Text>
                  <Text style={styles.planDesc}>Sur mesure pour associations et entreprises</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>Sur mesure</Text>
                </View>
                <TouchableOpacity style={[styles.cta, {backgroundColor: '#fb923c'}]}>
                  <Text style={styles.ctaText}>Contactez-nous</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#81e6d9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#81e6d9',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    backgroundColor: '#81e6d9',
    opacity: 0.1,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 48,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#319795',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
    lineHeight: 24,
  },
  descriptionCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 40,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#319795',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#319795',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  footerSection: {
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#319795',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#319795',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  creditText: {
    fontSize: 16,
    color: '#374151',
  },
  plansSection: {
    gap: 16,
  },
  planCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  popularCard: {
    borderColor: '#7c3aed',
    borderWidth: 2,
    backgroundColor: '#f3e8ff',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  creditsText: {
    fontSize: 16,
    color: '#374151',
  },
  creditEarning: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  cta: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 