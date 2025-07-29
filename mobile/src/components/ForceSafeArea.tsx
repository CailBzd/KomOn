import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  AppState,
  AppStateStatus,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

interface ForceSafeAreaProps {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
}

function ForceSafeAreaContent({
  children,
  style,
  contentContainerStyle,
  statusBarStyle,
  statusBarBackgroundColor,
}: ForceSafeAreaProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(AppState.currentState);
  const [key, setKey] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(false);
  const lastInsets = useRef(insets);

  // Détecter les changements d'état de l'application
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('AppState changed:', appState, '->', nextAppState);
      
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App returning to foreground, forcing safe area refresh');
        
        // Forcer le rafraîchissement immédiat
        setKey(prev => prev + 1);
        setForceRefresh(true);
        
        // Forcer plusieurs rafraîchissements avec des délais
        setTimeout(() => {
          setKey(prev => prev + 1);
        }, 50);
        
        setTimeout(() => {
          setKey(prev => prev + 1);
        }, 150);
        
        setTimeout(() => {
          setKey(prev => prev + 1);
          setForceRefresh(false);
        }, 300);
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState]);

  // Détecter les changements d'insets
  useEffect(() => {
    if (insets.top !== lastInsets.current.top || 
        insets.bottom !== lastInsets.current.bottom ||
        insets.left !== lastInsets.current.left ||
        insets.right !== lastInsets.current.right) {
      console.log('Insets changed:', lastInsets.current, '->', insets);
      lastInsets.current = insets;
      setKey(prev => prev + 1);
    }
  }, [insets]);

  // Calculer les marges avec sécurité supplémentaire
  const getSafeMargins = () => {
    const topMargin = insets.top + (forceRefresh ? 30 : 20); // Plus de marge si force refresh
    const bottomMargin = insets.bottom + (forceRefresh ? 50 : 30); // Plus de marge si force refresh

    console.log('Safe area margins:', {
      insets,
      topMargin,
      bottomMargin,
      forceRefresh,
      appState
    });

    return {
      paddingTop: topMargin,
      paddingBottom: bottomMargin,
    };
  };

  const safeMargins = getSafeMargins();
  const currentStatusBarStyle = statusBarStyle || (colors.text === '#f7fafc' ? 'light-content' : 'dark-content');
  const currentStatusBarBackground = statusBarBackgroundColor || colors.background;

  return (
    <View 
      style={[styles.container, { backgroundColor: colors.background }, style]} 
      key={key}
    >
      <StatusBar 
        barStyle={currentStatusBarStyle} 
        backgroundColor={currentStatusBarBackground}
        translucent={Platform.OS === 'android'}
      />
      <View style={[
        styles.content,
        safeMargins,
        contentContainerStyle
      ]}>
        {children}
      </View>
    </View>
  );
}

export default function ForceSafeArea(props: ForceSafeAreaProps) {
  return (
    <SafeAreaProvider>
      <ForceSafeAreaContent {...props} />
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