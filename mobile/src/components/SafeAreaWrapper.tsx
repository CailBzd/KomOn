import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  AppState,
  AppStateStatus,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

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
      return insets.top;
    }
    return StatusBar.currentHeight || 0;
  };

  const getBottomPadding = () => {
    const basePadding = insets.bottom;
    const extraPadding = forceRefresh ? 50 : 0; // Padding supplémentaire si l'app vient de reprendre
    return Math.max(basePadding, 20) + extraPadding; // Minimum 20px
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
      <StatusBar
        barStyle={colors.text === '#f7fafc' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={true}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 