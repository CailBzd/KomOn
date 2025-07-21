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
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();

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
            <View style={styles.headerLeft}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>K</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.welcomeText}>Bonjour,</Text>
                <Text style={styles.userName}>{user?.firstName || 'Utilisateur'}</Text>
              </View>
            </View>

          </View>

          {/* Stats Cards */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Vos statistiques</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Événements créés</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Participations</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Crédits gagnés</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>🎯</Text>
                </View>
                <Text style={styles.actionTitle}>Créer un événement</Text>
                <Text style={styles.actionDesc}>Organisez votre activité</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>🔍</Text>
                </View>
                <Text style={styles.actionTitle}>Rechercher</Text>
                <Text style={styles.actionDesc}>Trouvez des événements</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>👥</Text>
                </View>
                <Text style={styles.actionTitle}>Communauté</Text>
                <Text style={styles.actionDesc}>Rejoignez des groupes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>💎</Text>
                </View>
                <Text style={styles.actionTitle}>Mes crédits</Text>
                <Text style={styles.actionDesc}>Gérez vos crédits</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Events */}
          <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Événements récents</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.eventsList}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Match de foot amical</Text>
                  <Text style={styles.eventDate}>Aujourd'hui, 18h</Text>
                </View>
                <Text style={styles.eventLocation}>📍 Parc des Sports, Lyon</Text>
                <Text style={styles.eventParticipants}>👥 8/12 participants</Text>
              </View>
              
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Course à pied matinale</Text>
                  <Text style={styles.eventDate}>Demain, 7h</Text>
                </View>
                <Text style={styles.eventLocation}>📍 Parc de la Tête d'Or</Text>
                <Text style={styles.eventParticipants}>👥 5/10 participants</Text>
              </View>
              
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Basket en salle</Text>
                  <Text style={styles.eventDate}>Samedi, 20h</Text>
                </View>
                <Text style={styles.eventLocation}>📍 Gymnase municipal</Text>
                <Text style={styles.eventParticipants}>👥 10/12 participants</Text>
              </View>
            </View>
          </View>

          {/* Community Highlights */}
          <View style={styles.communitySection}>
            <Text style={styles.sectionTitle}>Communauté</Text>
            <View style={styles.communityCard}>
              <Text style={styles.communityTitle}>🏆 Top organisateur du mois</Text>
              <Text style={styles.communityDesc}>
                Félicitations ! Vous êtes dans le top 10 des organisateurs les plus actifs.
              </Text>
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
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 50,
    height: 50,
    backgroundColor: '#319795',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#718096',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },

  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
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
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#319795',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    padding: 16,
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
  },
  actionIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  eventsSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#319795',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    padding: 16,
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
  },
  eventDate: {
    fontSize: 12,
    color: '#319795',
    fontWeight: '600',
  },
  eventLocation: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  eventParticipants: {
    fontSize: 14,
    color: '#718096',
  },
  communitySection: {
    marginBottom: 20,
  },
  communityCard: {
    backgroundColor: '#ffffff',
    padding: 16,
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
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  communityDesc: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
}); 