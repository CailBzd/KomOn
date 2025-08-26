import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Event } from '../services/apiService';
import KomOnIcon from './KomOnIcons';

interface EventsMapProps {
  events: Event[];
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  onEventPress: (event: Event) => void;
  onMapPress: () => void;
}

const { width } = Dimensions.get('window');

export default function EventsMap({ 
  events, 
  currentLocation, 
  onEventPress, 
  onMapPress 
}: EventsMapProps) {
  const { colors } = useTheme();

  // Pour l'instant, on affiche une vue simplifiée
  // Plus tard, on pourra intégrer une vraie carte (react-native-maps)
  const eventsWithLocation = events.filter(event => event.latitude && event.longitude);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <TouchableOpacity 
        style={styles.mapContainer}
        onPress={onMapPress}
        activeOpacity={0.8}
      >
        <View style={styles.mapPlaceholder}>
          <KomOnIcon name="map" size={48} />
          <Text style={[styles.mapTitle, { color: colors.text }]}>
            Carte des événements
          </Text>
          <Text style={[styles.mapSubtitle, { color: colors.textSecondary }]}>
            {eventsWithLocation.length} événements géolocalisés
          </Text>
          
          {currentLocation && (
            <View style={styles.currentLocationIndicator}>
              <KomOnIcon name="map-pin" size={16} />
              <Text style={[styles.currentLocationText, { color: colors.primary }]}>
                Votre position
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Liste des événements proches */}
      {eventsWithLocation.length > 0 && (
        <View style={styles.eventsList}>
          <Text style={[styles.eventsListTitle, { color: colors.text }]}>
            Événements à proximité
          </Text>
          {eventsWithLocation.slice(0, 3).map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventItem, { backgroundColor: colors.background }]}
              onPress={() => onEventPress(event)}
            >
              <View style={styles.eventItemContent}>
                <Text style={[styles.eventItemTitle, { color: colors.text }]}>
                  {event.title}
                </Text>
                <Text style={[styles.eventItemLocation, { color: colors.textSecondary }]}>
                  📍 {event.location}
                </Text>
                {event.sport && (
                  <Text style={[styles.eventItemSport, { color: colors.textSecondary }]}>
                    🏃 {event.sport.name}
                  </Text>
                )}
              </View>
              <KomOnIcon name="chevron-right" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapContainer: {
    width: '100%',
    height: 200,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  currentLocationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 20,
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  eventsList: {
    padding: 16,
  },
  eventsListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  eventItemContent: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventItemLocation: {
    fontSize: 12,
    marginBottom: 2,
  },
  eventItemSport: {
    fontSize: 12,
  },
}); 