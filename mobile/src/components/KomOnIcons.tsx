import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface KomOnIconProps {
  name: string;
  size?: number;
  style?: any;
}

// Mapping des noms d'icônes vers les composants Expo
const iconMap: { [key: string]: { component: React.ComponentType<any>; name: string } } = {
  // Navigation principale
  home: { component: Ionicons, name: 'home' },
  dashboard: { component: Ionicons, name: 'home' },
  events: { component: Ionicons, name: 'calendar' },
  calendar: { component: Ionicons, name: 'calendar' },
  profile: { component: Ionicons, name: 'person' },
  user: { component: Ionicons, name: 'person' },
  community: { component: Ionicons, name: 'people' },
  settings: { component: Ionicons, name: 'settings' },
  
  // Actions principales
  activity: { component: Ionicons, name: 'fitness' },
  add: { component: Ionicons, name: 'add' },
  create: { component: Ionicons, name: 'add' },
  logout: { component: Ionicons, name: 'log-out' },
  search: { component: Ionicons, name: 'search' },
  filter: { component: Ionicons, name: 'filter' },
  edit: { component: Ionicons, name: 'create' },
  delete: { component: Ionicons, name: 'trash' },
  trash2: { component: Ionicons, name: 'trash' },
  save: { component: Ionicons, name: 'checkmark' },
  check: { component: Ionicons, name: 'checkmark' },
  cancel: { component: Ionicons, name: 'close' },
  close: { component: Ionicons, name: 'close' },
  
  // Navigation
  chevronRight: { component: Ionicons, name: 'chevron-forward' },
  chevronLeft: { component: Ionicons, name: 'chevron-back' },
  arrowRight: { component: Ionicons, name: 'arrow-forward' },
  arrowLeft: { component: Ionicons, name: 'arrow-back' },
  
  // Événements et sport
  location: { component: Ionicons, name: 'location' },
  mapPin: { component: Ionicons, name: 'location' },
  time: { component: Ionicons, name: 'time' },
  clock: { component: Ionicons, name: 'time' },
  trophy: { component: Ionicons, name: 'trophy' },
  award: { component: Ionicons, name: 'ribbon' },
  target: { component: Ionicons, name: 'locate' },
  trendingUp: { component: Ionicons, name: 'trending-up' },
  zap: { component: Ionicons, name: 'flash' },
  
  // Social et communauté
  heart: { component: Ionicons, name: 'heart' },
  star: { component: Ionicons, name: 'star' },
  message: { component: Ionicons, name: 'chatbubble' },
  share: { component: Ionicons, name: 'share' },
  bookmark: { component: Ionicons, name: 'bookmark' },
  users: { component: Ionicons, name: 'people' },
  participation: { component: Ionicons, name: 'people' },
  
  // Media
  camera: { component: Ionicons, name: 'camera' },
  play: { component: Ionicons, name: 'play' },
  pause: { component: Ionicons, name: 'pause' },
  stop: { component: Ionicons, name: 'square' },
  sport: { component: Ionicons, name: 'fitness' },
  
  // Formulaires et validation
  eye: { component: Ionicons, name: 'eye' },
  eyeOff: { component: Ionicons, name: 'eye-off' },
  lock: { component: Ionicons, name: 'lock-closed' },
  mail: { component: Ionicons, name: 'mail' },
  phone: { component: Ionicons, name: 'call' },
  event: { component: Ionicons, name: 'calendar' },
  
  // Notifications
  bell: { component: Ionicons, name: 'notifications' },
  notification: { component: Ionicons, name: 'notifications' },
  theme: { component: Ionicons, name: 'settings' },
  
  // Statuts
  success: { component: Ionicons, name: 'checkmark-circle' },
  error: { component: Ionicons, name: 'close-circle' },
  warning: { component: Ionicons, name: 'warning' },
  info: { component: Ionicons, name: 'information-circle' },
  help: { component: Ionicons, name: 'help-circle' },
  helpCircle: { component: Ionicons, name: 'help-circle' },
  checkCircle: { component: Ionicons, name: 'checkmark-circle' },
  alertCircle: { component: Ionicons, name: 'warning' },
  xCircle: { component: Ionicons, name: 'close-circle' },
  
  // Actions secondaires
  minus: { component: Ionicons, name: 'remove' },
  more: { component: Ionicons, name: 'ellipsis-horizontal' },
  moreVertical: { component: Ionicons, name: 'ellipsis-vertical' },
  download: { component: Ionicons, name: 'download' },
  upload: { component: Ionicons, name: 'cloud-upload' },
  refresh: { component: Ionicons, name: 'refresh' },
  rotate: { component: Ionicons, name: 'refresh-circle' },
  
  // Interface
  maximize: { component: Ionicons, name: 'expand' },
  minimize: { component: Ionicons, name: 'contract' },
  volume: { component: Ionicons, name: 'volume-high' },
  volumeOff: { component: Ionicons, name: 'volume-mute' },
  
  // Système
  wifi: { component: Ionicons, name: 'wifi' },
  wifiOff: { component: Ionicons, name: 'wifi-outline' },
  battery: { component: Ionicons, name: 'battery-full' },
  batteryCharging: { component: Ionicons, name: 'battery-charging' },
  signal: { component: Ionicons, name: 'cellular' },
  signalHigh: { component: Ionicons, name: 'cellular' },
  signalMedium: { component: Ionicons, name: 'cellular-outline' },
  signalLow: { component: Ionicons, name: 'cellular-outline' },
  signalZero: { component: Ionicons, name: 'cellular-outline' },
  
  // Paiements
  creditCard: { component: Ionicons, name: 'card' },
  wallet: { component: Ionicons, name: 'wallet' },
  gift: { component: Ionicons, name: 'gift' },
  purchase: { component: Ionicons, name: 'card' },
  credit: { component: Ionicons, name: 'gift' },
  
  // Sécurité
  shield: { component: Ionicons, name: 'shield' },
  security: { component: Ionicons, name: 'shield' },
  
  // Internationalisation
  globe: { component: Ionicons, name: 'globe' },
  language: { component: Ionicons, name: 'globe' },
  
  // Thème
  sun: { component: Ionicons, name: 'sunny' },
  moon: { component: Ionicons, name: 'moon' },
};

export default function KomOnIcon({ name, size = 24, style }: KomOnIconProps) {
  const { colors } = useTheme();
  const iconConfig = iconMap[name];
  
  if (!iconConfig) {
    console.warn(`Icône "${name}" non trouvée dans KomOnIcons`);
    return null;
  }
  
  const IconComponent = iconConfig.component;
  
  return (
    <IconComponent
      name={iconConfig.name}
      size={size}
      color={colors.text}
      style={[styles.icon, style]}
    />
  );
}

// Composants d'icônes spécialisées pour KomOn
export function KomOnLogo({ size = 32, style }: { size?: number; style?: any }) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.logoContainer, { width: size, height: size }, style]}>
      <Ionicons name="fitness" size={size * 0.6} color={colors.primary} />
      <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
        <Ionicons name="star" size={size * 0.2} color={colors.background} />
      </View>
    </View>
  );
}

export function SportIcon({ sport, size = 24, style }: { sport: string } & { size?: number; style?: any }) {
  const { colors } = useTheme();
  
  // Mapping des sports vers les icônes Expo
  const sportIcons: { [key: string]: { component: React.ComponentType<any>; name: string } } = {
    football: { component: MaterialCommunityIcons, name: 'soccer' },
    basketball: { component: MaterialCommunityIcons, name: 'basketball' },
    tennis: { component: MaterialCommunityIcons, name: 'tennis' },
    running: { component: MaterialCommunityIcons, name: 'run' },
    swimming: { component: MaterialCommunityIcons, name: 'swim' },
    cycling: { component: MaterialCommunityIcons, name: 'bike' },
    yoga: { component: MaterialCommunityIcons, name: 'yoga' },
    gym: { component: MaterialCommunityIcons, name: 'dumbbell' },
    musculation: { component: MaterialCommunityIcons, name: 'dumbbell' },
    volleyball: { component: MaterialCommunityIcons, name: 'volleyball' },
    handball: { component: MaterialCommunityIcons, name: 'handball' },
    rugby: { component: MaterialCommunityIcons, name: 'rugby' },
    golf: { component: MaterialCommunityIcons, name: 'golf' },
    badminton: { component: MaterialCommunityIcons, name: 'badminton' },
    pingpong: { component: MaterialCommunityIcons, name: 'table-tennis' },
    default: { component: Ionicons, name: 'fitness' },
  };
  
  const iconConfig = sportIcons[sport.toLowerCase()] || sportIcons.default;
  const IconComponent = iconConfig.component;
  
  return (
    <IconComponent
      name={iconConfig.name}
      size={size}
      color={colors.text}
      style={[styles.icon, style]}
    />
  );
}

export function EventTypeIcon({ type, size = 24, style }: { type: string } & { size?: number; style?: any }) {
  const { colors } = useTheme();
  
  // Mapping des types d'événements vers les icônes Expo
  const eventIcons: { [key: string]: { component: React.ComponentType<any>; name: string } } = {
    match: { component: Ionicons, name: 'trophy' },
    training: { component: Ionicons, name: 'fitness' },
    competition: { component: Ionicons, name: 'medal' },
    friendly: { component: Ionicons, name: 'people' },
    tournament: { component: Ionicons, name: 'trophy' },
    workshop: { component: Ionicons, name: 'school' },
    meetup: { component: Ionicons, name: 'people' },
    default: { component: Ionicons, name: 'calendar' },
  };
  
  const iconConfig = eventIcons[type.toLowerCase()] || eventIcons.default;
  const IconComponent = iconConfig.component;
  
  return (
    <IconComponent
      name={iconConfig.name}
      size={size}
      color={colors.text}
      style={[styles.icon, style]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 