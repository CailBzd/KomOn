import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface ValidatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  error?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  showEyeIcon?: boolean;
  onEyePress?: () => void;
  showEyeIconState?: boolean;
}

export default function ValidatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error,
  onBlur,
  onFocus,
  showEyeIcon = false,
  onEyePress,
  showEyeIconState = false,
}: ValidatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [borderColor] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(borderColor, {
      toValue: error ? 2 : isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, error, borderColor]);

  // Animation pour l'affichage de l'erreur
  const [errorOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(errorOpacity, {
      toValue: error ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [error, errorOpacity]);

  const getBorderColor = () => {
    if (error) return '#DC2626';
    if (isFocused) return '#3B82F6';
    return '#D1D5DB';
  };

  const getBackgroundColor = () => {
    if (error) return '#FEF2F2';
    if (isFocused) return '#FFFFFF';
    return '#F9FAFB';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.labelError]}>
        {label}
      </Text>
      
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
        />
        
        {showEyeIcon && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={onEyePress}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeIcon}>
              {showEyeIconState ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.errorContainer,
          {
            opacity: errorOpacity,
            maxHeight: error ? 50 : 0,
          }
        ]}
      >
        {error && (
          <>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelError: {
    color: '#DC2626',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    flex: 1,
  },
}); 