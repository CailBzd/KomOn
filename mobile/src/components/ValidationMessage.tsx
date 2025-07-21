import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ValidationMessageProps {
  message: string;
  type: 'error' | 'warning' | 'success';
  visible: boolean;
}

export default function ValidationMessage({ message, type, visible }: ValidationMessageProps) {
  if (!visible || !message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#FEE2E2';
      case 'warning':
        return '#FEF3C7';
      case 'success':
        return '#D1FAE5';
      default:
        return '#FEE2E2';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return '#FCA5A5';
      case 'warning':
        return '#FCD34D';
      case 'success':
        return '#A7F3D0';
      default:
        return '#FCA5A5';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return '#DC2626';
      case 'warning':
        return '#D97706';
      case 'success':
        return '#059669';
      default:
        return '#DC2626';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return '❌';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={[styles.message, { color: getTextColor() }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
}); 