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
import SafeScreen from '../../components/SafeScreen';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <SafeScreen>
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>K</Text>
            </View>
            <Text style={[styles.logoText, { color: colors.primary }]}>KomOn!</Text>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.notificationButtonText}>🔔</Text>
          </TouchableOpacity>
        </View>
        
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Bonjour, {user?.firstName || 'Sportif'}!</Text>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Prêt pour une nouvelle activité?</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions rapides!</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="create" size="medium" />
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>Créer un événement!</Text>
              <Text style={[styles.quickActionDesc, { color: colors.textSecondary }]}>Organise une activité</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="search" size="medium" />
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>Rechercher!</Text>
              <Text style={[styles.quickActionDesc, { color: colors.textSecondary }]}>Trouve des événements</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="community" size="medium" />
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>Communauté!</Text>
              <Text style={[styles.quickActionDesc, { color: colors.textSecondary }]}>Rejoins des groupes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="credit" size="medium" />
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>Mes crédits!</Text>
              <Text style={[styles.quickActionDesc, { color: colors.textSecondary }]}>Gère ton solde</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Events */}
        <View style={styles.recentEventsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Événements récents!</Text>
          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <ImprovedIcon type="event" size="medium" />
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>Match de foot amical</Text>
                <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Stade municipal</Text>
                <Text style={[styles.eventTime, { color: colors.textTertiary }]}>⏰ Aujourd'hui, 15h00</Text>
              </View>
            </View>
            <View style={styles.eventStats}>
              <Text style={[styles.eventStat, { color: colors.primary }]}>👥 8 participants</Text>
              <Text style={[styles.eventStat, { color: colors.primary }]}>💎 1 crédit</Text>
            </View>
          </View>
          
          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <ImprovedIcon type="event" size="medium" />
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>Course à pied matinale</Text>
                <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Parc central</Text>
                <Text style={[styles.eventTime, { color: colors.textTertiary }]}>⏰ Demain, 7h00</Text>
              </View>
            </View>
            <View style={styles.eventStats}>
              <Text style={[styles.eventStat, { color: colors.primary }]}>👥 12 participants</Text>
              <Text style={[styles.eventStat, { color: colors.primary }]}>💎 1 crédit</Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Vue d'ensemble!</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="event" size="large" />
              <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Événements créés</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="participation" size="large" />
              <Text style={[styles.statNumber, { color: colors.primary }]}>45</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Participations</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <ImprovedIcon type="credit" size="large" />
              <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Crédits gagnés</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.upcomingSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Prochains événements!</Text>
          <View style={[styles.upcomingCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.upcomingTitle, { color: colors.text }]}>Aucun événement à venir</Text>
            <Text style={[styles.upcomingDesc, { color: colors.textSecondary }]}>
              Crée ton premier événement ou rejoins la communauté!
            </Text>
            <TouchableOpacity style={[styles.createEventButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.createEventButtonText}>Créer un événement!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationButtonText: {
    fontSize: 18,
    color: '#ffffff',
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
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDesc: {
    fontSize: 10,
    textAlign: 'center',
  },
  recentEventsSection: {
    marginBottom: 32,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
  },
  eventStats: {
    flexDirection: 'row',
    gap: 16,
  },
  eventStat: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  upcomingSection: {
    marginBottom: 32,
  },
  upcomingCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  upcomingDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  createEventButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createEventButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 