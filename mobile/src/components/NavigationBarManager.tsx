import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function NavigationBarManager() {
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Cette fonction sera appelée quand le thème change
      const updateNavigationBar = () => {
        try {
          // Utiliser l'API Android native pour changer la couleur de la barre de navigation
          if (global.Android && global.Android.setNavigationBarColor) {
            global.Android.setNavigationBarColor(colors.background);
          }
        } catch (error) {
          console.log('Impossible de changer la couleur de la barre de navigation:', error);
        }
      };

      updateNavigationBar();
    }
  }, [colors.background]);

  // Ce composant ne rend rien visuellement
  return null;
} 