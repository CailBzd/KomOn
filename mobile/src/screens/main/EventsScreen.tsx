import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import MainLayout from '../../components/MainLayout';
import { apiService, Event } from '../../services/apiService';
import KomOnIcon from '../../components/KomOnIcons';
import EventsMap from '../../components/EventsMap';

const { width } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
}

interface SearchFilters {
  location: string;
  radius: number;
  useCurrentLocation: boolean;
  currentLocation?: LocationData;
}

export default function EventsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    radius: 10, // 10km par défaut
    useCurrentLocation: false,
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [searchFilters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Préparer les filtres pour l'API
      const filters: any = {};
      
      if (selectedSport) {
        filters.sport = selectedSport;
      }
      
      if (searchFilters.useCurrentLocation && searchFilters.currentLocation) {
        filters.latitude = searchFilters.currentLocation.latitude;
        filters.longitude = searchFilters.currentLocation.longitude;
        filters.radius = searchFilters.radius;
      } else if (searchFilters.location) {
        filters.location = searchFilters.location;
        filters.radius = searchFilters.radius;
      }
      
      const response = await apiService.getAllEvents(filters);
      
      if (response.success && response.data) {
        setEvents(response.data);
        console.log('📅 Événements chargés:', response.data.length);
      } else {
        console.error('❌ Erreur lors du chargement des événements:', response.error);
        Alert.alert('Erreur', 'Impossible de charger les événements');
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      Alert.alert('Erreur réseau', 'Vérifiez votre connexion internet');
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByLocation = (events: Event[]): Event[] => {
    if (!searchFilters.location && !searchFilters.useCurrentLocation) {
      return events;
    }

    // Pour l'instant, on filtre côté client
    // Plus tard, on pourra implémenter la recherche côté serveur
    return events.filter(event => {
      if (!event.latitude || !event.longitude) {
        return true; // Inclure les événements sans coordonnées
      }

      if (searchFilters.useCurrentLocation && searchFilters.currentLocation) {
        const distance = calculateDistance(
          searchFilters.currentLocation.latitude,
          searchFilters.currentLocation.longitude,
          event.latitude,
          event.longitude
        );
        return distance <= searchFilters.radius;
      }

      // Recherche par nom de ville (approximative)
      if (searchFilters.location && event.location) {
        return event.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      }

      return true;
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à votre localisation.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la demande de permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Obtenir l'adresse à partir des coordonnées
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = addressResponse[0];
      const city = address?.city || address?.subregion || 'Localisation actuelle';

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city,
        address: `${address?.street || ''} ${address?.postalCode || ''} ${city}`.trim(),
      };

      setSearchFilters(prev => ({
        ...prev,
        useCurrentLocation: true,
        currentLocation: locationData,
        location: city,
      }));

      console.log('📍 Localisation obtenue:', locationData);
    } catch (error) {
      console.error('❌ Erreur lors de la géolocalisation:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre localisation');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const response = await apiService.registerToEvent(eventId);
      
      if (response.success) {
        Alert.alert('Succès', 'Vous êtes inscrit à cet événement !');
        loadEvents(); // Recharger les événements
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de s\'inscrire');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      Alert.alert('Erreur', 'Impossible de s\'inscrire à l\'événement');
    }
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

  const formatDistance = (event: Event) => {
    if (!searchFilters.useCurrentLocation || !searchFilters.currentLocation || !event.latitude || !event.longitude) {
      return null;
    }

    const distance = calculateDistance(
      searchFilters.currentLocation.latitude,
      searchFilters.currentLocation.longitude,
      event.latitude,
      event.longitude
    );

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  const filteredEvents = events;

  return (
    <MainLayout
      headerTitle="Découvre des événements!"
      headerSubtitle="Trouve ton prochain défi sportif"
      headerRightComponent={
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.myEventsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => navigation.navigate('MyEvents')}
          >
            <Text style={[styles.myEventsButtonText, { color: colors.primary }]}>Mes événements</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Text style={styles.createButtonText}>+ Créer!</Text>
          </TouchableOpacity>
        </View>
      }
    >
      {/* Barre de recherche */}
      <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <KomOnIcon name="search" size={20} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchFilters.location}
              onChangeText={(text) => setSearchFilters(prev => ({ ...prev, location: text, useCurrentLocation: false }))}
              placeholder="Rechercher par ville..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <TouchableOpacity
            style={[styles.locationButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowLocationModal(true)}
          >
            <KomOnIcon name="map-pin" size={20} />
          </TouchableOpacity>
        </View>

        {/* Filtres de localisation */}
        {(searchFilters.location || searchFilters.useCurrentLocation) && (
          <View style={styles.locationFilters}>
            <View style={styles.locationInfo}>
              <KomOnIcon name="map-pin" size={16} />
              <Text style={[styles.locationText, { color: colors.text }]}>
                {searchFilters.useCurrentLocation ? '📍 Localisation actuelle' : `📍 ${searchFilters.location}`}
              </Text>
              {searchFilters.useCurrentLocation && (
                <TouchableOpacity
                  onPress={() => setSearchFilters(prev => ({ ...prev, useCurrentLocation: false, currentLocation: undefined }))}
                >
                  <KomOnIcon name="x" size={16} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.radiusSelector}>
              <Text style={[styles.radiusLabel, { color: colors.textSecondary }]}>Rayon: {searchFilters.radius}km</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[5, 10, 25, 50, 100].map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.radiusChip,
                      searchFilters.radius === radius && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSearchFilters(prev => ({ ...prev, radius }))}
                  >
                    <Text style={[
                      styles.radiusChipText,
                      { color: searchFilters.radius === radius ? '#ffffff' : colors.text }
                    ]}>
                      {radius}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              !selectedSport && styles.filterChipActive, 
              { 
                backgroundColor: !selectedSport ? colors.primary : colors.surface, 
                borderColor: !selectedSport ? colors.primary : colors.border 
              }
            ]}
            onPress={() => setSelectedSport(null)}
          >
            <Text style={!selectedSport ? styles.filterChipTextActive : [styles.filterChipText, { color: colors.textSecondary }]}>
              Tous!
            </Text>
          </TouchableOpacity>
          {['Football', 'Basketball', 'Course à pied', 'Tennis', 'Musculation'].map((sport) => (
            <TouchableOpacity 
              key={sport}
              style={[
                styles.filterChip, 
                selectedSport === sport && styles.filterChipActive, 
                { 
                  backgroundColor: selectedSport === sport ? colors.primary : colors.surface, 
                  borderColor: selectedSport === sport ? colors.primary : colors.border 
                }
              ]}
              onPress={() => setSelectedSport(sport)}
            >
              <Text style={selectedSport === sport ? styles.filterChipTextActive : [styles.filterChipText, { color: colors.textSecondary }]}>
                {sport}!
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Carte des événements */}
        {(searchFilters.useCurrentLocation || searchFilters.location) && (
          <EventsMap
            events={events}
            currentLocation={searchFilters.currentLocation}
            onEventPress={(event) => {
              // Navigation vers les détails de l'événement
              console.log('Événement sélectionné:', event.title);
            }}
            onMapPress={() => {
              // Ouvrir la carte complète
              console.log('Ouvrir la carte complète');
            }}
          />
        )}

        {/* Events List */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Événements disponibles! ({filteredEvents.length})
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Chargement des événements...
              </Text>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchFilters.location || searchFilters.useCurrentLocation
                  ? `Aucun événement trouvé dans un rayon de ${searchFilters.radius}km`
                  : selectedSport 
                    ? `Aucun événement trouvé pour ${selectedSport}`
                    : 'Aucun événement disponible pour le moment'
                }
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => {
              const distance = formatDistance(event);
              return (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                    <View style={[styles.eventBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.eventBadgeText}>{formatDate(event.start_date)}</Text>
                    </View>
                  </View>
                  <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                    🕐 {formatTime(event.start_date)} - {formatTime(event.end_date)}
                  </Text>
                  <View style={styles.locationRow}>
                    <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
                      📍 {event.location}
                    </Text>
                    {distance && (
                      <Text style={[styles.distanceText, { color: colors.primary }]}>
                        📏 {distance}
                      </Text>
                    )}
                  </View>
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
                      style={[styles.joinButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleJoinEvent(event.id)}
                    >
                      <Text style={styles.joinButtonText}>Rejoindre!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                      <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Détails!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal de géolocalisation */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Localisation</Text>
            
            <TouchableOpacity
              style={[styles.locationOption, { backgroundColor: colors.background }]}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              <KomOnIcon name="map-pin" size={24} />
              <View style={styles.locationOptionText}>
                <Text style={[styles.locationOptionTitle, { color: colors.text }]}>
                  Utiliser ma localisation
                </Text>
                <Text style={[styles.locationOptionSubtitle, { color: colors.textSecondary }]}>
                  Géolocalisation automatique
                </Text>
              </View>
              {locationLoading && <ActivityIndicator size="small" color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.locationOption, { backgroundColor: colors.background }]}
              onPress={() => {
                setSearchFilters(prev => ({ ...prev, useCurrentLocation: false, currentLocation: undefined }));
                setShowLocationModal(false);
              }}
            >
              <KomOnIcon name="search" size={24} />
              <View style={styles.locationOptionText}>
                <Text style={[styles.locationOptionTitle, { color: colors.text }]}>
                  Rechercher par ville
                </Text>
                <Text style={[styles.locationOptionSubtitle, { color: colors.textSecondary }]}>
                  Saisir une ville manuellement
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.error || '#EF4444' }]}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  myEventsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  myEventsButtonText: {
    fontSize: 12,
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
  filtersSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  filterChipActive: {
    borderWidth: 0,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontSize: 14,
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
    marginBottom: 16,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  detailsButtonText: {
    fontSize: 16,
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  eventSport: {
    fontSize: 14,
    marginBottom: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  locationButton: {
    padding: 8,
    borderRadius: 12,
  },
  locationFilters: {
    marginTop: 16,
    paddingHorizontal: 10,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  radiusSelector: {
    marginTop: 8,
  },
  radiusLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  radiusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  radiusChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  locationOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationOptionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 