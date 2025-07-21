import React, { useEffect } from 'react';
import { StatusBar, Platform, ViewStyle, StatusBarAnimation } from 'react-native';

interface StatusBarManagerProps {
  style?: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

export default function StatusBarManager({
  style = 'dark-content',
  backgroundColor = 'transparent',
  translucent = true,
  hidden = false,
}: StatusBarManagerProps) {
  useEffect(() => {
    // Configuration de la barre de statut
    StatusBar.setBarStyle(style);
    
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(backgroundColor);
      StatusBar.setTranslucent(translucent);
    }
    
    if (hidden) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setHidden(false);
    }
  }, [style, backgroundColor, translucent, hidden]);

  return null;
}

// Utilitaires pour différents types d'écrans
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
}; 