import { Platform, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export interface DeviceInfo {
  hasNotch: boolean;
  hasDynamicIsland: boolean;
  hasPunchHole: boolean;
  hasRoundedCorners: boolean;
  hasNavigationBar: boolean;
  statusBarHeight: number;
  bottomInset: number;
  isTablet: boolean;
  isLargeScreen: boolean;
}

export const useDeviceInfo = (): DeviceInfo => {
  const insets = useSafeAreaInsets();
  
  const statusBarHeight = Platform.OS === 'ios' 
    ? insets.top 
    : StatusBar.currentHeight || 0;
  
  const hasNotch = Platform.OS === 'ios' && insets.top > 20 && insets.top <= 50;
  const hasDynamicIsland = Platform.OS === 'ios' && insets.top > 50;
  const hasPunchHole = Platform.OS === 'android' && statusBarHeight > 25;
  const hasRoundedCorners = insets.left > 0 || insets.right > 0;
  const hasNavigationBar = insets.bottom > 0;
  const isTablet = width >= 768 || height >= 768;
  const isLargeScreen = width >= 414 || height >= 896;

  return {
    hasNotch,
    hasDynamicIsland,
    hasPunchHole,
    hasRoundedCorners,
    hasNavigationBar,
    statusBarHeight,
    bottomInset: insets.bottom,
    isTablet,
    isLargeScreen,
  };
};

export const getOptimalPadding = (deviceInfo: DeviceInfo) => {
  const { hasNotch, hasDynamicIsland, hasPunchHole, hasNavigationBar } = deviceInfo;
  
  let topPadding = 0;
  let bottomPadding = 0;
  let horizontalPadding = 20;

  // Padding supérieur selon le type d'appareil
  if (hasDynamicIsland) {
    topPadding = 15; // Marge supplémentaire pour Dynamic Island
  } else if (hasNotch) {
    topPadding = 10; // Marge supplémentaire pour notch
  } else if (hasPunchHole) {
    topPadding = 8; // Marge supplémentaire pour punch-hole
  } else {
    topPadding = 5; // Marge de base
  }

  // Padding inférieur pour la barre de navigation
  if (hasNavigationBar) {
    bottomPadding = Platform.OS === 'android' ? 8 : 5;
  }

  // Padding horizontal pour les bords arrondis
  if (deviceInfo.hasRoundedCorners) {
    horizontalPadding = Math.max(horizontalPadding, 25);
  }

  return {
    topPadding,
    bottomPadding,
    horizontalPadding,
  };
};

export const getStatusBarConfig = (deviceInfo: DeviceInfo) => {
  const { hasDynamicIsland, hasNotch, hasPunchHole } = deviceInfo;
  
  return {
    translucent: true,
    backgroundColor: 'transparent',
    barStyle: 'dark-content' as const,
    extraTopMargin: hasDynamicIsland ? 12 : hasNotch ? 8 : hasPunchHole ? 6 : 4,
  };
};

export const getHeaderConfig = (deviceInfo: DeviceInfo) => {
  const { hasDynamicIsland, hasNotch, hasPunchHole, isTablet } = deviceInfo;
  
  return {
    height: isTablet ? 64 : 56,
    extraTopPadding: hasDynamicIsland ? 15 : hasNotch ? 10 : hasPunchHole ? 8 : 5,
    minTouchArea: 44, // Zone de clic minimale recommandée
  };
};

// Constantes pour les marges recommandées
export const MARGINS = {
  STATUS_BAR: {
    DYNAMIC_ISLAND: 15,
    NOTCH: 10,
    PUNCH_HOLE: 8,
    STANDARD: 5,
  },
  HEADER: {
    EXTRA_TOP: {
      DYNAMIC_ISLAND: 12,
      NOTCH: 8,
      PUNCH_HOLE: 6,
      STANDARD: 4,
    },
    HEIGHT: {
      PHONE: 56,
      TABLET: 64,
    },
  },
  NAVIGATION: {
    EXTRA_BOTTOM: {
      ANDROID: 8,
      IOS: 5,
    },
  },
  HORIZONTAL: {
    ROUNDED_CORNERS: 25,
    STANDARD: 20,
  },
};

// Fonction pour obtenir les marges optimales selon l'appareil
export const getDeviceMargins = (deviceInfo: DeviceInfo) => {
  const { hasDynamicIsland, hasNotch, hasPunchHole, hasNavigationBar, hasRoundedCorners } = deviceInfo;
  
  let statusBarMargin = MARGINS.STATUS_BAR.STANDARD;
  if (hasDynamicIsland) statusBarMargin = MARGINS.STATUS_BAR.DYNAMIC_ISLAND;
  else if (hasNotch) statusBarMargin = MARGINS.STATUS_BAR.NOTCH;
  else if (hasPunchHole) statusBarMargin = MARGINS.STATUS_BAR.PUNCH_HOLE;

  let headerExtraTop = MARGINS.HEADER.EXTRA_TOP.STANDARD;
  if (hasDynamicIsland) headerExtraTop = MARGINS.HEADER.EXTRA_TOP.DYNAMIC_ISLAND;
  else if (hasNotch) headerExtraTop = MARGINS.HEADER.EXTRA_TOP.NOTCH;
  else if (hasPunchHole) headerExtraTop = MARGINS.HEADER.EXTRA_TOP.PUNCH_HOLE;

  const navigationExtraBottom = hasNavigationBar 
    ? (Platform.OS === 'android' ? MARGINS.NAVIGATION.EXTRA_BOTTOM.ANDROID : MARGINS.NAVIGATION.EXTRA_BOTTOM.IOS)
    : 0;

  const horizontalMargin = hasRoundedCorners 
    ? MARGINS.HORIZONTAL.ROUNDED_CORNERS 
    : MARGINS.HORIZONTAL.STANDARD;

  return {
    statusBarMargin,
    headerExtraTop,
    navigationExtraBottom,
    horizontalMargin,
  };
}; 