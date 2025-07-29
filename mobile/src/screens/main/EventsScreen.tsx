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
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const { width } = Dimensions.get('window');

export default function EventsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <SafeAreaWrapper>
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>K</Text>
            </View>
            <Text style={[styles.logoText, { color: colors.primary }]}>KomOn!</Text>
          </View>
          <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.createButtonText}>+ Créer!</Text>
          </TouchableOpacity>
        </View>
        
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Découvre des événements!</Text>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Trouve ton prochain défi sportif</Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              <Text style={styles.filterChipTextActive}>Tous!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>Football!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>Basketball!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>Course!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>Tennis!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>Musculation!</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Events List */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Événements disponibles!</Text>
          
          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>Match de foot amical!</Text>
              <View style={[styles.eventBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.eventBadgeText}>Aujourd'hui!</Text>
              </View>
            </View>
            <Text style={[styles.eventTime, { color: colors.textSecondary }]}>🕐 18h00 - 20h00</Text>
            <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Parc des Sports, Lyon</Text>
            <Text style={[styles.eventParticipants, { color: colors.textSecondary }]}>👥 8/12 participants</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.joinButtonText}>Rejoindre!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Détails!</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>Course à pied matinale!</Text>
              <View style={[styles.eventBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.eventBadgeText}>Demain!</Text>
              </View>
            </View>
            <Text style={[styles.eventTime, { color: colors.textSecondary }]}>🕐 7h00 - 8h30</Text>
            <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Parc de la Tête d'Or</Text>
            <Text style={[styles.eventParticipants, { color: colors.textSecondary }]}>👥 5/10 participants</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.joinButtonText}>Rejoindre!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Détails!</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>Basket en salle!</Text>
              <View style={[styles.eventBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.eventBadgeText}>Samedi!</Text>
              </View>
            </View>
            <Text style={[styles.eventTime, { color: colors.textSecondary }]}>🕐 20h00 - 22h00</Text>
            <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Gymnase municipal</Text>
            <Text style={[styles.eventParticipants, { color: colors.textSecondary }]}>👥 10/12 participants</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.joinButtonText}>Rejoindre!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Détails!</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>Séance de musculation!</Text>
              <View style={[styles.eventBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.eventBadgeText}>Lundi!</Text>
              </View>
            </View>
            <Text style={[styles.eventTime, { color: colors.textSecondary }]}>🕐 19h00 - 20h30</Text>
            <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Salle de sport Premium</Text>
            <Text style={[styles.eventParticipants, { color: colors.textSecondary }]}>👥 3/8 participants</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.joinButtonText}>Rejoindre!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Détails!</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>Tennis en double!</Text>
              <View style={[styles.eventBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.eventBadgeText}>Mercredi!</Text>
              </View>
            </View>
            <Text style={[styles.eventTime, { color: colors.textSecondary }]}>🕐 17h00 - 19h00</Text>
            <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>📍 Tennis Club Lyon</Text>
            <Text style={[styles.eventParticipants, { color: colors.textSecondary }]}>👥 4/4 participants</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity style={[styles.joinButton, styles.joinButtonFull, { backgroundColor: colors.textTertiary }]}>
                <Text style={styles.joinButtonText}>Complet!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Détails!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Create Event CTA */}
        <View style={styles.createEventSection}>
          <View style={[styles.createEventCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.createEventTitle}>Crée ton propre événement!</Text>
            <Text style={styles.createEventDesc}>
              Organise une activité sportive et rejoins la communauté KomOn!
            </Text>
            <TouchableOpacity style={[styles.createEventButton, { backgroundColor: colors.background }]}>
              <Text style={[styles.createEventButtonText, { color: colors.primary }]}>Créer un événement!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
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
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
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
  filtersSection: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipActive: {
    borderColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  eventsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  eventBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventParticipants: {
    fontSize: 14,
    marginBottom: 16,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  joinButtonFull: {
    backgroundColor: '#a0aec0',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  createEventSection: {
    marginBottom: 32,
  },
  createEventCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createEventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  createEventDesc: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  createEventButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createEventButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 