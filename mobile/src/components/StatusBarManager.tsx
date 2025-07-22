import React, { useEffect } from 'react';
import { StatusBar, Platform, ViewStyle, StatusBarAnimation } from 'react-native';
import { useDeviceInfo, getStatusBarConfig } from '../utils/deviceUtils';

interface StatusBarManagerProps {
  style?: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
  animated?: boolean;
  animation?: StatusBarAnimation;
}

export default function StatusBarManager({
  style = 'dark-content',
  backgroundColor = 'transparent',
  translucent = true,
  hidden = false,
  animated = true,
  animation = 'fade',
}: StatusBarManagerProps) {
  const deviceInfo = useDeviceInfo();
  const statusBarConfig = getStatusBarConfig(deviceInfo);

  useEffect(() => {
    // Configuration de la barre de statut avec marges adaptatives
    StatusBar.setBarStyle(style, animated);
    
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(backgroundColor);
      StatusBar.setTranslucent(translucent);
    }
    
    if (hidden) {
      StatusBar.setHidden(true, animation);
    } else {
      StatusBar.setHidden(false, animation);
    }
  }, [style, backgroundColor, translucent, hidden, animated, animation]);

  return null;
}

// Utilitaires pour différents types d'écrans avec marges adaptatives
export const StatusBarPresets = {
  // Écrans sombres (fond noir/dark)
  dark: {
    style: 'light-content' as const,
    backgroundColor: '#000000',
    translucent: false,
  },
  
  // Écrans clairs (fond blanc/light)
  light: {
    style: 'dark-content' as const,
    backgroundColor: '#ffffff',
    translucent: false,
  },
  
  // Écrans avec fond coloré
  colored: {
    style: 'light-content' as const,
    backgroundColor: '#319795',
    translucent: false,
  },
  
  // Écrans transparents (pour les overlays)
  transparent: {
    style: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
  },
  
  // Écrans avec gradient ou image de fond
  overlay: {
    style: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
  },

  // Écrans adaptatifs selon l'appareil
  adaptive: {
    style: 'dark-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
  },
};

// Hook personnalisé pour gérer la barre de statut avec marges adaptatives
export const useAdaptiveStatusBar = (preset: keyof typeof StatusBarPresets = 'adaptive') => {
  const deviceInfo = useDeviceInfo();
  const statusBarConfig = getStatusBarConfig(deviceInfo);
  
  return {
    ...StatusBarPresets[preset],
    extraTopMargin: statusBarConfig.extraTopMargin,
    deviceInfo,
  };
}; 