import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, Event } from '../../services/apiService';
import MainLayout from '../../components/MainLayout';
import KomOnIcon from '../../components/KomOnIcons';

export default function MyEventsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on récupère tous les événements et on filtre côté client
      // Plus tard, on pourra ajouter un endpoint spécifique /events/my-events
      const response = await apiService.getAllEvents();
      
      if (response.success && response.data) {
        // Filtrer les événements créés par l'utilisateur actuel
        const myEvents = response.data.filter(event => event.organizer_id === user?.id);
        setEvents(myEvents);
        console.log('📅 Mes événements chargés:', myEvents.length);
      } else {
        console.error('❌ Erreur lors du chargement de mes événements:', response.error);
        Alert.alert('Erreur', 'Impossible de charger vos événements');
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      Alert.alert('Erreur réseau', 'Vérifiez votre connexion internet');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    // Navigation vers l'écran d'édition (à implémenter)
    Alert.alert('Édition', `Éditer l'événement: ${event.title}`);
  };

  const handleDeleteEvent = async (event: Event) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer "${event.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.deleteEvent(event.id);
              
              if (response.success) {
                Alert.alert('Succès', 'Événement supprimé avec succès');
                loadMyEvents(); // Recharger la liste
              } else {
                Alert.alert('Erreur', response.error || 'Impossible de supprimer l\'événement');
              }
            } catch (error) {
              console.error('❌ Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'événement');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    if (now < startDate) {
      return { text: 'À venir', color: '#3B82F6' }; // Bleu
    } else if (now >= startDate && now <= endDate) {
      return { text: 'En cours', color: '#10B981' }; // Vert
    } else {
      return { text: 'Terminé', color: '#6B7280' }; // Gris
    }
  };

  return (
    <MainLayout
      headerTitle="Mes événements"
      headerSubtitle="Gère tes événements créés"
      headerRightComponent={
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.createButtonText}>+ Créer</Text>
        </TouchableOpacity>
      }
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Chargement de vos événements...
            </Text>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <KomOnIcon name="calendar" size={64} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Aucun événement créé
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Vous n'avez pas encore créé d'événement. Commencez par en créer un !
            </Text>
            <TouchableOpacity 
              style={[styles.createFirstButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Text style={styles.createFirstButtonText}>Créer mon premier événement</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.eventsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Mes événements ({events.length})
            </Text>
            
            {events.map((event) => {
              const status = getEventStatus(event);
              return (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                    <View style={[styles.eventBadge, { backgroundColor: status.color }]}>
                      <Text style={styles.eventBadgeText}>{status.text}</Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                    🕐 {formatTime(event.start_date)} - {formatTime(event.end_date)}
                  </Text>
                  <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
                    📍 {event.location}
                  </Text>
                  <Text style={[styles.eventParticipants, { color: colors.textSecondary }]}>
                    👥 {event.max_participants} participants max
                  </Text>
                  {event.sport && (
                    <Text style={[styles.eventSport, { color: colors.textSecondary }]}>
                      🏃 {event.sport.name}
                    </Text>
                  )}
                  
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      style={[styles.editButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleEditEvent(event)}
                    >
                      <KomOnIcon name="edit" size={16} />
                      <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.deleteButton, { backgroundColor: colors.error || '#EF4444' }]}
                      onPress={() => handleDeleteEvent(event)}
                    >
                      <KomOnIcon name="trash" size={16} />
                      <Text style={styles.deleteButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 90,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createFirstButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createFirstButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    color: '#ffffff',
    fontSize: 12,
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
    marginBottom: 4,
  },
  eventSport: {
    fontSize: 14,
    marginBottom: 16,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 