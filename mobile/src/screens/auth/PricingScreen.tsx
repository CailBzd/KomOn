import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import KomOnIcon from '../../components/KomOnIcons';

const { width, height } = Dimensions.get('window');

interface PricingScreenProps {
  navigation: any;
}

export default function PricingScreen({ navigation }: PricingScreenProps) {
  const handleSelectFreePlan = () => {
    navigation.navigate('Signup');
  };

  const handleSelectProPlan = () => {
    // TODO: Implémenter la logique pour les plans payants
    console.log('Plan Pro sélectionné');
  };

  const handleBackToWelcome = () => {
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a202c" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToWelcome}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choisissez votre plan</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Titre principal */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Commencez votre aventure</Text>
            <Text style={styles.subtitle}>
              Choisissez le plan qui vous convient le mieux
            </Text>
          </View>

          {/* Plan Gratuit */}
          <View style={styles.planContainer}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Plan Gratuit</Text>
              <Text style={styles.planPrice}>0€</Text>
              <Text style={styles.planPeriod}>pour toujours</Text>
              <Text style={styles.planDescription}>Parfait pour commencer</Text>
            </View>

            <View style={styles.creditInfo}>
              <Text style={styles.creditText}>💎 0 crédit de création/mois</Text>
              <Text style={styles.creditEarning}>5 participations = 1 crédit</Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <KomOnIcon name="checkCircle" size={20} />
                <Text style={styles.featureText}>1 crédit = 1 événement créé</Text>
              </View>
              <View style={styles.featureItem}>
                <KomOnIcon name="checkCircle" size={20} />
                <Text style={styles.featureText}>S'inscrire aux événements (10/mois)</Text>
              </View>
              <View style={styles.featureItem}>
                <KomOnIcon name="checkCircle" size={20} />
                <Text style={styles.featureText}>Profil basique</Text>
              </View>
              <View style={styles.featureItem}>
                <KomOnIcon name="checkCircle" size={20} />
                <Text style={styles.featureText}>Accès communautaire</Text>
              </View>
              <View style={styles.featureItem}>
                <KomOnIcon name="checkCircle" size={20} />
                <Text style={styles.featureText}>Notifications d'événements</Text>
              </View>
            </View>

            <View style={styles.limitationsContainer}>
              <Text style={styles.limitationsTitle}>Limitations :</Text>
              <View style={styles.limitationItem}>
                <KomOnIcon name="warning" size={20} />
                <Text style={styles.limitationText}>Max 30 participants/événement</Text>
              </View>
              <View style={styles.limitationItem}>
                <KomOnIcon name="warning" size={20} />
                <Text style={styles.limitationText}>Max 10 participations/mois</Text>
              </View>
              <View style={styles.limitationItem}>
                <KomOnIcon name="warning" size={20} />
                <Text style={styles.limitationText}>Pas de statistiques avancées</Text>
              </View>
              <View style={styles.limitationItem}>
                <KomOnIcon name="warning" size={20} />
                <Text style={styles.limitationText}>Support communautaire uniquement</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={handleSelectFreePlan}
              activeOpacity={0.8}
            >
              <Text style={styles.selectButtonText}>Commencer gratuitement</Text>
            </TouchableOpacity>
          </View>

          {/* Plan Premium */}
          <View style={styles.planContainer}>
            <View style={styles.planHeader}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
              <Text style={styles.planName}>Plan Premium</Text>
              <Text style={styles.planPrice}>6.99€</Text>
              <Text style={styles.planPeriod}>/mois</Text>
              <Text style={styles.planDescription}>Pour les organisateurs passionnés</Text>
            </View>

            <View style={styles.creditInfo}>
              <Text style={styles.creditText}>💎 5 crédits de création/mois</Text>
              <Text style={styles.creditEarning}>3 participations = 1 crédit</Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>1 crédit = 1 événement créé</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>S'inscrire aux événements illimités</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Statistiques avancées</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Gestion des participants</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Support prioritaire</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Badge Premium</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Accès aux outils avancés</Text>
              </View>
            </View>

            <View style={styles.limitationsContainer}>
              <Text style={styles.limitationsTitle}>Limitations :</Text>
              <View style={styles.limitationItem}>
                <Text style={styles.limitationIcon}>⚠️</Text>
                <Text style={styles.limitationText}>Max 30 participants/événement</Text>
              </View>
              <View style={styles.limitationItem}>
                <Text style={styles.limitationIcon}>⚠️</Text>
                <Text style={styles.limitationText}>Crédits non cumulables</Text>
              </View>
              <View style={styles.limitationItem}>
                <Text style={styles.limitationIcon}>⚠️</Text>
                <Text style={styles.limitationText}>Pas d'accès aux outils partenaires</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.selectButtonSecondary}
              onPress={handleSelectProPlan}
              activeOpacity={0.8}
            >
              <Text style={styles.selectButtonSecondaryText}>Choisir Premium</Text>
            </TouchableOpacity>
          </View>

          {/* Plan Illimité */}
          <View style={styles.planContainer}>
            <View style={styles.planHeader}>
              <View style={styles.unlimitedBadge}>
                <Text style={styles.unlimitedBadgeText}>ILLIMITÉ</Text>
              </View>
              <Text style={styles.planName}>Plan Illimité</Text>
              <Text style={styles.planPrice}>12.99€</Text>
              <Text style={styles.planPeriod}>/mois</Text>
              <Text style={styles.planDescription}>Pour les organisateurs intensifs</Text>
            </View>

            <View style={styles.creditInfo}>
              <Text style={styles.creditText}>💎 Crédits illimités</Text>
              <Text style={styles.creditEarning}>Pas de limite</Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Création d'événements illimitée</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Participations illimitées</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>1 crédit = 1 événement créé</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Statistiques avancées</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Gestion des participants</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Support prioritaire</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Badge Illimité</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Accès aux outils avancés</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Pas de limite de participants</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.selectButtonSecondary}
              onPress={handleSelectProPlan}
              activeOpacity={0.8}
            >
              <Text style={styles.selectButtonSecondaryText}>Choisir Illimité</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Vous pouvez changer de plan à tout moment
            </Text>
          </View>
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  planContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planBadge: {
    backgroundColor: '#319795',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  planBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  proBadge: {
    backgroundColor: '#805ad5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  proBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  premiumBadge: {
    backgroundColor: '#805ad5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  premiumBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unlimitedBadge: {
    backgroundColor: '#d69e2e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  unlimitedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  limitationsContainer: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  limitationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitationIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  limitationText: {
    fontSize: 14,
    color: '#a0aec0',
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#319795',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: '#a0aec0',
  },
  planDescription: {
    fontSize: 14,
    color: '#e2e8f0',
    textAlign: 'center',
    marginTop: 4,
  },
  creditInfo: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  creditText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#319795',
    marginBottom: 4,
  },
  creditEarning: {
    fontSize: 14,
    color: '#a0aec0',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#e2e8f0',
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#319795',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectButtonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#319795',
  },
  selectButtonSecondaryText: {
    color: '#319795',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
}); 