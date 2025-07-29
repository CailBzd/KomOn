import { useState, useEffect } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  hasNotch: boolean;
  hasHomeIndicator: boolean;
  screenHeight: number;
  screenWidth: number;
  statusBarHeight: number;
  safeAreaBottom: number;
  navigationBarHeight: number;
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    hasNotch: false,
    hasHomeIndicator: false,
    screenHeight: Dimensions.get('window').height,
    screenWidth: Dimensions.get('window').width,
    statusBarHeight: StatusBar.currentHeight || 0,
    safeAreaBottom: 0,
    navigationBarHeight: 0,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const window = Dimensions.get('window');
      const screen = Dimensions.get('screen');
      
             // Détecter les appareils avec encoche
       const hasNotch = 
         (Platform.OS === 'ios' && (window.height > 800 || window.width > 800)) ||
         (Platform.OS === 'android' && window.height > 700);

      // Calculer la hauteur de la barre de navigation
      let navigationBarHeight = 0;
      if (Platform.OS === 'android') {
        navigationBarHeight = screen.height - window.height - (StatusBar.currentHeight || 0);
        navigationBarHeight = Math.max(navigationBarHeight, 0);
      }

      // Calculer la zone de sécurité du bas
      let safeAreaBottom = 0;
      if (Platform.OS === 'ios') {
        safeAreaBottom = hasNotch ? 34 : 0;
      } else {
        safeAreaBottom = navigationBarHeight;
      }

      setDeviceInfo({
        isIOS: Platform.OS === 'ios',
        isAndroid: Platform.OS === 'android',
        hasNotch,
        hasHomeIndicator: hasNotch,
        screenHeight: window.height,
        screenWidth: window.width,
        statusBarHeight: StatusBar.currentHeight || 0,
        safeAreaBottom,
        navigationBarHeight,
      });
    };

    // Mise à jour initiale
    updateDeviceInfo();

    // Écouter les changements de dimensions
    const subscription = Dimensions.addEventListener('change', updateDeviceInfo);

    return () => {
      subscription?.remove();
    };
  }, []);

  return deviceInfo;
}

export function getDeviceMargins(deviceInfo: DeviceInfo) {
  return {
    top: deviceInfo.statusBarHeight + (deviceInfo.hasNotch ? 44 : 20),
    bottom: deviceInfo.safeAreaBottom + deviceInfo.navigationBarHeight + 20,
    left: 0,
    right: 0,
  };
}

// Hook pour gérer les changements d'état de l'application
export function useAppState() {
  const [appState, setAppState] = useState('active');
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // L'app revient au premier plan
        setLastActiveTime(Date.now());
      }
      setAppState(nextAppState);
    };

    // Importer AppState de manière dynamique pour éviter les erreurs
    const { AppState } = require('react-native');
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState]);

  return { appState, lastActiveTime };
} 