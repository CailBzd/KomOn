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
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
      return insets.top;
    }
    return StatusBar.currentHeight || 0;
  };

  const getBottomInset = () => {
    return insets.bottom;
  };

  const getDynamicPadding = () => {
    const topPadding = edges.includes('top') ? Math.max(getStatusBarHeight(), paddingTop) : paddingTop;
    const bottomPadding = edges.includes('bottom') ? Math.max(getBottomInset(), paddingBottom) : paddingBottom;
    const horizontalPadding = edges.includes('left') && edges.includes('right') ? paddingHorizontal : 0;

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