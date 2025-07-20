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

export default function EventsScreen() {
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
            <Text style={styles.headerTitle}>Événements</Text>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>+ Créer</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                <Text style={styles.filterChipTextActive}>Tous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterChipText}>Football</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterChipText}>Basketball</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterChipText}>Course</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterChipText}>Tennis</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Events List */}
          <View style={styles.eventsSection}>
            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>Match de foot amical</Text>
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>Aujourd'hui</Text>
                </View>
              </View>
              <Text style={styles.eventTime}>🕐 18h00 - 20h00</Text>
              <Text style={styles.eventLocation}>📍 Parc des Sports, Lyon</Text>
              <Text style={styles.eventParticipants}>👥 8/12 participants</Text>
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Rejoindre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Détails</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>Course à pied matinale</Text>
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>Demain</Text>
                </View>
              </View>
              <Text style={styles.eventTime}>🕐 7h00 - 8h30</Text>
              <Text style={styles.eventLocation}>📍 Parc de la Tête d'Or</Text>
              <Text style={styles.eventParticipants}>👥 5/10 participants</Text>
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Rejoindre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Détails</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>Basket en salle</Text>
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>Samedi</Text>
                </View>
              </View>
              <Text style={styles.eventTime}>🕐 20h00 - 22h00</Text>
              <Text style={styles.eventLocation}>📍 Gymnase municipal</Text>
              <Text style={styles.eventParticipants}>👥 10/12 participants</Text>
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Rejoindre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Détails</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>Tennis en double</Text>
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>Dimanche</Text>
                </View>
              </View>
              <Text style={styles.eventTime}>🕐 14h00 - 16h00</Text>
              <Text style={styles.eventLocation}>📍 Courts de tennis</Text>
              <Text style={styles.eventParticipants}>👥 3/4 participants</Text>
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Rejoindre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Détails</Text>
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
  createButton: {
    backgroundColor: '#319795',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersSection: {
    marginBottom: 24,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#319795',
    borderColor: '#319795',
  },
  filterChipText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  eventsSection: {
    gap: 16,
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
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
  },
  eventBadge: {
    backgroundColor: '#319795',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  eventParticipants: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#319795',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#319795',
    flex: 1,
  },
  detailsButtonText: {
    color: '#319795',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 