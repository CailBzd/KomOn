import React from 'react';
import { View, StyleSheet } from 'react-native';
import KomOnIcon from './KomOnIcons';
import { useTheme } from '../contexts/ThemeContext';

type IconType = 
  | 'create' 
  | 'participation' 
  | 'credit' 
  | 'purchase' 
  | 'profile' 
  | 'events' 
  | 'dashboard' 
  | 'settings'
  | 'logout'
  | 'theme'
  | 'notification'
  | 'search'
  | 'filter'
  | 'calendar'
  | 'location'
  | 'time'
  | 'users'
  | 'community'
  | 'sport'
  | 'trophy'
  | 'heart'
  | 'star'
  | 'edit'
  | 'delete'
  | 'share'
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'event'
  | 'security'
  | 'language'
  | 'help';

type IconSize = 'small' | 'medium' | 'large';

interface ImprovedIconProps {
  type: IconType;
  size?: IconSize;
  color?: string;
}

export default function ImprovedIcon({ type, size = 'medium', color }: ImprovedIconProps) {
  const { colors } = useTheme();
  const iconColor = color || colors.text;

  // Mapping des types vers les noms d'icônes Lucide
  const getIconName = () => {
    switch (type) {
      case 'create':
        return 'add';
      case 'participation':
        return 'users';
      case 'credit':
        return 'gift';
      case 'purchase':
        return 'creditCard';
      case 'profile':
        return 'user';
      case 'events':
        return 'calendar';
      case 'dashboard':
        return 'home';
      case 'settings':
        return 'settings';
      case 'logout':
        return 'logout';
      case 'theme':
        return 'settings';
      case 'notification':
        return 'bell';
      case 'search':
        return 'search';
      case 'filter':
        return 'filter';
      case 'calendar':
        return 'calendar';
      case 'location':
        return 'mapPin';
      case 'time':
        return 'clock';
      case 'users':
        return 'users';
      case 'sport':
        return 'activity';
      case 'trophy':
        return 'trophy';
      case 'heart':
        return 'heart';
      case 'star':
        return 'star';
      case 'edit':
        return 'edit';
      case 'delete':
        return 'trash2';
      case 'share':
        return 'share';
      case 'info':
        return 'info';
      case 'warning':
        return 'alertCircle';
      case 'success':
        return 'checkCircle';
      case 'error':
        return 'xCircle';
      case 'event':
        return 'calendar';
      case 'security':
        return 'shield';
      case 'language':
        return 'globe';
      case 'help':
        return 'helpCircle';
      default:
        return 'info';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  return (
    <View style={[styles.iconContainer, getSizeStyle(size)]}>
      <KomOnIcon 
        name={getIconName()} 
        size={getIconSize()}
        style={{ color: iconColor }}
      />
    </View>
  );
}

const getSizeStyle = (size: IconSize) => {
  switch (size) {
    case 'small':
      return styles.small;
    case 'large':
      return styles.large;
    default:
      return styles.medium;
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    width: 24,
    height: 24,
  },
  medium: {
    width: 32,
    height: 32,
  },
  large: {
    width: 48,
    height: 48,
  },
}); 