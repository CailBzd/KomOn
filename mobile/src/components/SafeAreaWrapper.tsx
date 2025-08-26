import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  AppState,
  AppStateStatus,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import StatusBarManager from './StatusBarManager';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export default function SafeAreaWrapper({ children, style }: SafeAreaWrapperProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(AppState.currentState);
  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // L'app revient au premier plan
        console.log('App resumed, forcing layout refresh');
        setForceRefresh(true);
        
        // Force un re-render après un délai
        setTimeout(() => {
          setForceRefresh(false);
        }, 500);
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState]);

  const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
      return insets.top + 10; // Espace réduit pour éviter le décalage
    }
    return (insets.top || 0) + 10; // Espace réduit pour éviter le décalage
  };

  const getBottomPadding = () => {
    const basePadding = insets.bottom;
    const extraPadding = forceRefresh ? 30 : 0; // Padding supplémentaire si l'app vient de reprendre
    return Math.max(basePadding, 10) + extraPadding; // Minimum 10px
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: getStatusBarHeight(),
          paddingBottom: getBottomPadding(),
        },
        style,
      ]}
    >
      <StatusBarManager />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 