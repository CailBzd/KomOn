import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface LogoutButtonProps {
  title?: string;
  loadingTitle?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'danger' | 'outline' | 'ghost';
  showIcon?: boolean;
  fullWidth?: boolean;
}

export default function LogoutButton({
  title = 'Se déconnecter',
  loadingTitle = 'Déconnexion...',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'danger',
  showIcon = true,
  fullWidth = false,
}: LogoutButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    Alert.alert(
      'Confirmer la déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: onPress,
        },
      ]
    );
  };

  const renderButtonContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator 
            size="small" 
            color={variant === 'danger' ? '#ffffff' : '#dc2626'} 
            style={styles.spinner}
          />
          <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
            {loadingTitle}
          </Text>
        </>
      );
    }

    return (
      <>
        {showIcon && (
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, styles[`${variant}Icon`]]}>🚪</Text>
          </View>
        )}
        <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
          {title}
        </Text>
      </>
    );
  };

  const buttonStyle = [
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    isPressed && styles.pressed,
    style,
  ].filter(Boolean);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderButtonContent()}
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
    borderRadius: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  danger: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOpacity: 0.3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOpacity: 0.1,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#b91c1c', // Couleur plus foncée quand pressé
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  dangerText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#dc2626',
  },
  ghostText: {
    color: '#dc2626',
  },
  iconContainer: {
    marginRight: 8,
  },
  icon: {
    fontSize: 18,
  },
  dangerIcon: {
    // Couleur par défaut pour l'emoji
  },
  outlineIcon: {
    // Couleur par défaut pour l'emoji
  },
  ghostIcon: {
    // Couleur par défaut pour l'emoji
  },
  spinner: {
    marginRight: 8,
  },
}); 