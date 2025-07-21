import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface LoadingButtonProps {
  title: string;
  loadingTitle?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function LoadingButton({
  title,
  loadingTitle = 'Chargement...',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'primary',
}: LoadingButtonProps) {
  const getButtonStyle = () => {
    return [
      styles.button, 
      styles[variant],
      (disabled || loading) && styles.disabled,
      style
    ].filter(Boolean);
  };

  const getTextStyle = () => {
    return [
      styles.text, 
      styles[`${variant}Text`],
      (disabled || loading) && styles.disabledText,
      textStyle
    ].filter(Boolean);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <>
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' ? '#319795' : '#ffffff'} 
            style={styles.spinner}
          />
          <Text style={getTextStyle()}>{loadingTitle}</Text>
        </>
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primary: {
    backgroundColor: '#319795',
  },
  secondary: {
    backgroundColor: '#718096',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#319795',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#319795',
  },
  disabledText: {
    opacity: 0.8,
  },
  spinner: {
    marginRight: 8,
  },
}); 