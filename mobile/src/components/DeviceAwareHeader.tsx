import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DeviceAwareHeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backButtonText?: string;
  elevation?: number;
  transparent?: boolean;
  style?: any;
}

export default function DeviceAwareHeader({
  title,
  leftComponent,
  rightComponent,
  backgroundColor = '#ffffff',
  textColor = '#2d3748',
  showBackButton = false,
  onBackPress,
  backButtonText = '←',
  elevation = 2,
  transparent = false,
  style,
}: DeviceAwareHeaderProps) {
  const insets = useSafeAreaInsets();

  const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
      return insets.top;
    }
    return 0; // Android gère automatiquement
  };

  const getHeaderHeight = () => {
    const statusBarHeight = getStatusBarHeight();
    const headerHeight = 56; // Hauteur standard du header
    return statusBarHeight + headerHeight;
  };

  const renderBackButton = () => {
    if (!showBackButton || !onBackPress) return null;

    return (
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.backButtonText, { color: textColor }]}>
          {backButtonText}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLeftComponent = () => {
    if (leftComponent) return leftComponent;
    return renderBackButton();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: getStatusBarHeight(),
          backgroundColor: transparent ? 'transparent' : backgroundColor,
          height: getHeaderHeight(),
          shadowOpacity: transparent ? 0 : elevation * 0.1,
          elevation: transparent ? 0 : elevation,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {renderLeftComponent()}
        </View>

        <View style={styles.centerSection}>
          {title && (
            <Text
              style={[
                styles.title,
                { color: textColor },
                transparent && styles.titleTransparent,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleTransparent: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 