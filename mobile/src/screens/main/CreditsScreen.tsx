import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ImprovedIcon from '../../components/ImprovedIcon';
import MainLayout from '../../components/MainLayout';

const { width } = Dimensions.get('window');

export default function CreditsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <MainLayout
      headerTitle={`Bonjour, ${user?.firstName || 'Sportif'}!`}
      headerSubtitle="Gère tes crédits et crée des événements!"
      headerRightComponent={
        <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.buyButtonText}>Acheter!</Text>
        </TouchableOpacity>
      }
    >
      {/* Credits Balance */}
      <View style={styles.balanceSection}>
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceLabel}>Solde actuel</Text>
          <Text style={styles.balanceAmount}>8 crédits</Text>
          <Text style={styles.balanceValue}>≈ 8,00 €</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
            <ImprovedIcon type="create" size="small" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Créer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
            <ImprovedIcon type="participation" size="small" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Participer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
            <ImprovedIcon type="purchase" size="small" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Acheter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
            <ImprovedIcon type="credit" size="small" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Historique</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <Text style={styles.filterButtonTextActive}>Tout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>Achats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>Gains</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>Utilisations</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* How it works */}
        <View style={styles.howItWorksSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Comment ça marche?</Text>
          <View style={[styles.howItWorksCard, { backgroundColor: colors.surface }]}>
            <View style={styles.howItWorksItem}>
              <ImprovedIcon type="create" size="medium" />
              <View style={styles.howItWorksContent}>
                <Text style={[styles.howItWorksTitle, { color: colors.text }]}>Créer un événement!</Text>
                <Text style={[styles.howItWorksDesc, { color: colors.textSecondary }]}>1 crédit = 1 événement créé</Text>
              </View>
            </View>
            
            <View style={styles.howItWorksItem}>
              <ImprovedIcon type="participation" size="medium" />
              <View style={styles.howItWorksContent}>
                <Text style={[styles.howItWorksTitle, { color: colors.text }]}>Participer!</Text>
                <Text style={[styles.howItWorksDesc, { color: colors.textSecondary }]}>5 participations = 1 crédit gagné</Text>
              </View>
            </View>
            
            <View style={styles.howItWorksItem}>
              <ImprovedIcon type="credit" size="medium" />
              <View style={styles.howItWorksContent}>
                <Text style={[styles.howItWorksTitle, { color: colors.text }]}>Utiliser!</Text>
                <Text style={[styles.howItWorksDesc, { color: colors.textSecondary }]}>Créez de nouveaux événements</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Activité récente</Text>
          <View style={[styles.activityList, { backgroundColor: colors.surface }]}>
            <View style={[styles.activityItem, { borderBottomColor: colors.borderLight }]}>
              <ImprovedIcon type="create" size="medium" />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>Événement créé!</Text>
                <Text style={[styles.activityDesc, { color: colors.textSecondary }]}>Match de foot amical</Text>
                <Text style={[styles.activityDate, { color: colors.textTertiary }]}>Aujourd'hui, 14h30</Text>
              </View>
              <Text style={[styles.activityAmount, { color: colors.primary }]}>-1 crédit</Text>
            </View>
            
            <View style={[styles.activityItem, { borderBottomColor: colors.borderLight }]}>
              <ImprovedIcon type="participation" size="medium" />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>Participation!</Text>
                <Text style={[styles.activityDesc, { color: colors.textSecondary }]}>Course à pied matinale</Text>
                <Text style={[styles.activityDate, { color: colors.textTertiary }]}>Hier, 7h00</Text>
              </View>
              <Text style={[styles.activityAmount, { color: colors.primary }]}>+0.2 crédit</Text>
            </View>
            
            <View style={[styles.activityItem, { borderBottomColor: colors.borderLight }]}>
              <ImprovedIcon type="participation" size="medium" />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>Participation!</Text>
                <Text style={[styles.activityDesc, { color: colors.textSecondary }]}>Basket en salle</Text>
                <Text style={[styles.activityDate, { color: colors.textTertiary }]}>Lundi, 20h00</Text>
              </View>
              <Text style={[styles.activityAmount, { color: colors.primary }]}>+0.2 crédit</Text>
            </View>
            
            <View style={[styles.activityItem, { borderBottomColor: colors.borderLight }]}>
              <ImprovedIcon type="purchase" size="medium" />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>Achat!</Text>
                <Text style={[styles.activityDesc, { color: colors.textSecondary }]}>Pack de 5 crédits</Text>
                <Text style={[styles.activityDate, { color: colors.textTertiary }]}>Lundi, 15h45</Text>
              </View>
              <Text style={[styles.activityAmount, { color: colors.primary }]}>+5 crédits</Text>
            </View>
          </View>
        </View>

        {/* Buy Credits */}
        <View style={styles.buySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acheter des crédits!</Text>
          <View style={styles.packagesGrid}>
            <TouchableOpacity style={[styles.packageCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.packageCredits, { color: colors.text }]}>5 crédits</Text>
              <Text style={[styles.packagePrice, { color: colors.primary }]}>5,00 €</Text>
              <Text style={[styles.packageValue, { color: colors.textSecondary }]}>1,00 €/crédit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.packageCard, styles.packageCardPopular, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.popularBadgeText}>Populaire!</Text>
              </View>
              <Text style={[styles.packageCredits, { color: colors.text }]}>10 crédits</Text>
              <Text style={[styles.packagePrice, { color: colors.primary }]}>9,00 €</Text>
              <Text style={[styles.packageValue, { color: colors.textSecondary }]}>0,90 €/crédit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.packageCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.packageCredits, { color: colors.text }]}>20 crédits</Text>
              <Text style={[styles.packagePrice, { color: colors.primary }]}>16,00 €</Text>
              <Text style={[styles.packageValue, { color: colors.textSecondary }]}>0,80 €/crédit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  filtersSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonActive: {
    borderColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 15, // Espace uniforme pour tous les écrans
    paddingBottom: 90,
  },
  howItWorksSection: {
    marginBottom: 32,
  },
  howItWorksCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  howItWorksContent: {
    flex: 1,
    marginLeft: 16,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  howItWorksDesc: {
    fontSize: 14,
  },
  activitySection: {
    marginBottom: 32,
  },
  activityList: {
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buySection: {
    marginBottom: 32,
  },
  packagesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  packageCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  packageCardPopular: {
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  packageCredits: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  packageValue: {
    fontSize: 12,
  },
}); 