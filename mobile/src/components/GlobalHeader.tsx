import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import KomOnIcon from './KomOnIcons';

interface GlobalHeaderProps {
  title?: string;
  subtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function GlobalHeader({
  title = "KomOn!",
  subtitle = "Prêt pour une nouvelle activité?",
  showNotification = true,
  onNotificationPress,
  rightComponent
}: GlobalHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {/* Logo et titre */}
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <Text style={[styles.logoText, { color: colors.primary }]}>KomOn!</Text>
        </View>
        
        {/* Composant de droite (notification ou autre) */}
        {rightComponent || (showNotification && (
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: colors.primary }]}
            onPress={onNotificationPress}
          >
            <KomOnIcon name="bell" size={18} style={{ color: '#ffffff' }} />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Titre et sous-titre */}
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
}); 