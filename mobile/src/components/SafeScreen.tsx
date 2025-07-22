import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeviceInfo, getDeviceMargins } from '../utils/deviceUtils';

const { width, height } = Dimensions.get('window');

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  statusBarBackgroundColor?: string;
  statusBarTranslucent?: boolean;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  extraTopPadding?: number; // Padding supplémentaire pour les appareils avec notch/Dynamic Island
  extraBottomPadding?: number; // Padding supplémentaire pour la barre de navigation
}

export default function SafeScreen({
  children,
  style,
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = 'transparent',
  statusBarTranslucent = true,
  backgroundColor = '#f7fafc',
  edges = ['top', 'bottom', 'left', 'right'],
  paddingTop = 0,
  paddingBottom = 0,
  paddingHorizontal = 20,
  extraTopPadding = 0,
  extraBottomPadding = 0,
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const deviceInfo = useDeviceInfo();
  const deviceMargins = getDeviceMargins(deviceInfo);

  const getStatusBarHeight = () => {
    const baseHeight = deviceInfo.statusBarHeight;
    const extraMargin = deviceMargins.statusBarMargin;
    return baseHeight + extraMargin + extraTopPadding;
  };

  const getBottomInset = () => {
    const baseInset = deviceInfo.bottomInset;
    const extraMargin = deviceMargins.navigationExtraBottom;
    return baseInset + extraMargin + extraBottomPadding;
  };

  const getHorizontalInsets = () => {
    // Gérer les bords arrondis et les encoches latérales
    const leftInset = edges.includes('left') ? Math.max(insets.left, 5) : 0;
    const rightInset = edges.includes('right') ? Math.max(insets.right, 5) : 0;
    return { leftInset, rightInset };
  };

  const getDynamicPadding = () => {
    const topPadding = edges.includes('top') 
      ? Math.max(getStatusBarHeight(), paddingTop) + extraTopPadding 
      : paddingTop;
    
    const bottomPadding = edges.includes('bottom') 
      ? Math.max(getBottomInset(), paddingBottom) + extraBottomPadding 
      : paddingBottom;
    
    const { leftInset, rightInset } = getHorizontalInsets();
    const horizontalPadding = edges.includes('left') && edges.includes('right') 
      ? Math.max(paddingHorizontal, leftInset, rightInset, deviceMargins.horizontalMargin) 
      : 0;

    return {
      paddingTop: topPadding,
      paddingBottom: bottomPadding,
      paddingHorizontal: horizontalPadding,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor}
        translucent={statusBarTranslucent}
      />
      <View style={[styles.content, getDynamicPadding(), style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 