import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface StatusBarManagerProps {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  translucent?: boolean;
}

export default function StatusBarManager({ 
  barStyle, 
  backgroundColor, 
  translucent = true 
}: StatusBarManagerProps) {
  const { colors } = useTheme();

  // Déterminer le style de la barre en fonction du thème
  const getBarStyle = () => {
    if (barStyle) return barStyle;
    
    // Pour les thèmes sombres, utiliser light-content
    if (colors.background === '#1a202c' || colors.background === '#2d3748') {
      return 'light-content';
    }
    
    // Pour les thèmes clairs, utiliser dark-content
    return 'dark-content';
  };

  // Déterminer la couleur de fond
  const getBackgroundColor = () => {
    return backgroundColor || colors.background;
  };

  useEffect(() => {
    // Mettre à jour la barre de statut quand le thème change
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(getBackgroundColor());
      StatusBar.setBarStyle(getBarStyle());
      StatusBar.setTranslucent(true);
    }
  }, [colors.background, colors.text]);

  return (
    <StatusBar
      barStyle={getBarStyle()}
      backgroundColor={getBackgroundColor()}
      translucent={translucent}
      animated={true}
    />
  );
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

  // Écrans adaptatifs selon l'appareil
  adaptive: {
    style: 'dark-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
  },
};

// Hook personnalisé pour gérer la barre de statut
export const useAdaptiveStatusBar = (preset: keyof typeof StatusBarPresets = 'adaptive') => {
  return {
    ...StatusBarPresets[preset],
    extraTopMargin: 0,
    deviceInfo: {
      isAndroid: Platform.OS === 'android',
      isIOS: Platform.OS === 'ios',
      statusBarHeight: 0,
      extraTopMargin: 0,
    },
  };
}; 