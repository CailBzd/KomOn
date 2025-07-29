import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStateManager } from '../hooks/useAppStateManager';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  forceRefresh?: boolean;
}

function SafeScreenContent({
  children,
  style,
  contentContainerStyle,
  statusBarStyle,
  statusBarBackgroundColor,
  forceRefresh = false,
}: SafeScreenProps) {
  const { colors } = useTheme();
  const { appState, isActive, forceRefresh: appForceRefresh, lastActiveTime } = useAppStateManager();
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState(0);

  // Forcer le rafraîchissement quand l'état de l'app change
  useEffect(() => {
    if (isActive) {
      console.log('App is active, forcing refresh');
      setKey(prev => prev + 1);
      
      // Recalculer après un délai
      setTimeout(() => {
        setKey(prev => prev + 1);
      }, 100);
    }
  }, [isActive, lastActiveTime]);

  // Forcer le rafraîchissement si demandé
  useEffect(() => {
    if (forceRefresh) {
      appForceRefresh();
    }
  }, [forceRefresh, appForceRefresh]);

  // Gérer les changements de layout
  const handleLayoutChange = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    console.log('Layout changed:', { width, height });
  };

  // Calculer les marges avec react-native-safe-area-context
  const getDynamicMargins = () => {
    // Utiliser les insets de react-native-safe-area-context
    const topMargin = insets.top + 20; // +20 pour sécurité
    const bottomMargin = insets.bottom + 30; // +30 pour sécurité

    console.log('Safe area insets:', insets);
    console.log('Calculated margins:', {
      topMargin,
      bottomMargin,
      appState,
      isActive
    });

    return {
      paddingTop: topMargin,
      paddingBottom: bottomMargin,
    };
  };

  const dynamicMargins = getDynamicMargins();
  const currentStatusBarStyle = statusBarStyle || (colors.text === '#f7fafc' ? 'light-content' : 'dark-content');
  const currentStatusBarBackground = statusBarBackgroundColor || colors.background;

  return (
    <View 
      style={[styles.container, { backgroundColor: colors.background }, style]} 
      key={key}
      onLayout={handleLayoutChange}
    >
      <StatusBar 
        barStyle={currentStatusBarStyle} 
        backgroundColor={currentStatusBarBackground}
        translucent={Platform.OS === 'android'}
      />
      <View style={[
        styles.content,
        dynamicMargins,
        contentContainerStyle
      ]}>
        {children}
      </View>
    </View>
  );
}

export default function SafeScreen(props: SafeScreenProps) {
  return (
    <SafeAreaProvider>
      <SafeScreenContent {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
}); 