import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

export default function CreditsScreen() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mes Crédits</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Acheter</Text>
            </TouchableOpacity>
          </View>

          {/* Credits Balance */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Solde actuel</Text>
              <Text style={styles.balanceAmount}>8 crédits</Text>
              <Text style={styles.balanceValue}>≈ 8,00 €</Text>
            </View>
          </View>

          {/* How it works */}
          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
            <View style={styles.howItWorksCard}>
              <View style={styles.howItWorksItem}>
                <View style={styles.howItWorksIcon}>
                  <Text style={styles.howItWorksIconText}>🎯</Text>
                </View>
                <View style={styles.howItWorksContent}>
                  <Text style={styles.howItWorksTitle}>Créer un événement</Text>
                  <Text style={styles.howItWorksDesc}>1 crédit = 1 événement créé</Text>
                </View>
              </View>
              
              <View style={styles.howItWorksItem}>
                <View style={styles.howItWorksIcon}>
                  <Text style={styles.howItWorksIconText}>👥</Text>
                </View>
                <View style={styles.howItWorksContent}>
                  <Text style={styles.howItWorksTitle}>Participer</Text>
                  <Text style={styles.howItWorksDesc}>5 participations = 1 crédit gagné</Text>
                </View>
              </View>
              
              <View style={styles.howItWorksItem}>
                <View style={styles.howItWorksIcon}>
                  <Text style={styles.howItWorksIconText}>💎</Text>
                </View>
                <View style={styles.howItWorksContent}>
                  <Text style={styles.howItWorksTitle}>Utiliser</Text>
                  <Text style={styles.howItWorksDesc}>Créez de nouveaux événements</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>🎯</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Événement créé</Text>
                  <Text style={styles.activityDesc}>Match de foot amical</Text>
                  <Text style={styles.activityDate}>Aujourd'hui, 14h30</Text>
                </View>
                <Text style={styles.activityAmount}>-1 crédit</Text>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>👥</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Participation</Text>
                  <Text style={styles.activityDesc}>Course à pied matinale</Text>
                  <Text style={styles.activityDate}>Hier, 7h00</Text>
                </View>
                <Text style={styles.activityAmount}>+0.2 crédit</Text>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>👥</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Participation</Text>
                  <Text style={styles.activityDesc}>Basket en salle</Text>
                  <Text style={styles.activityDate}>Lundi, 20h00</Text>
                </View>
                <Text style={styles.activityAmount}>+0.2 crédit</Text>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>💳</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Achat</Text>
                  <Text style={styles.activityDesc}>Pack de 5 crédits</Text>
                  <Text style={styles.activityDate}>Lundi, 15h45</Text>
                </View>
                <Text style={styles.activityAmount}>+5 crédits</Text>
              </View>
            </View>
          </View>

          {/* Buy Credits */}
          <View style={styles.buySection}>
            <Text style={styles.sectionTitle}>Acheter des crédits</Text>
            <View style={styles.packagesGrid}>
              <TouchableOpacity style={styles.packageCard}>
                <Text style={styles.packageCredits}>5 crédits</Text>
                <Text style={styles.packagePrice}>5,00 €</Text>
                <Text style={styles.packageValue}>1,00 €/crédit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.packageCard, styles.packageCardPopular]}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Populaire</Text>
                </View>
                <Text style={styles.packageCredits}>10 crédits</Text>
                <Text style={styles.packagePrice}>9,00 €</Text>
                <Text style={styles.packageValue}>0,90 €/crédit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.packageCard}>
                <Text style={styles.packageCredits}>20 crédits</Text>
                <Text style={styles.packagePrice}>16,00 €</Text>
                <Text style={styles.packageValue}>0,80 €/crédit</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  buyButton: {
    backgroundColor: '#319795',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceSection: {
    marginBottom: 32,
  },
  balanceCard: {
    backgroundColor: '#319795',
    padding: 24,
    borderRadius: 16,
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
  balanceLabel: {
    fontSize: 16,
    color: '#e6fffa',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 14,
    color: '#e6fffa',
  },
  howItWorksSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  howItWorksCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  howItWorksIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  howItWorksIconText: {
    fontSize: 20,
  },
  howItWorksContent: {
    flex: 1,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 2,
  },
  howItWorksDesc: {
    fontSize: 14,
    color: '#718096',
  },
  activitySection: {
    marginBottom: 32,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#a0aec0',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#319795',
  },
  buySection: {
    marginBottom: 20,
  },
  packagesGrid: {
    gap: 12,
  },
  packageCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  packageCardPopular: {
    borderWidth: 2,
    borderColor: '#319795',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#319795',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  packageCredits: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#319795',
    marginBottom: 4,
  },
  packageValue: {
    fontSize: 14,
    color: '#718096',
  },
}); 