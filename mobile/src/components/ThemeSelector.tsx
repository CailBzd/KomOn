import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import KomOnIcon from './KomOnIcons';

const { width } = Dimensions.get('window');

interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Clair',
    icon: 'sun',
    description: 'Thème clair par défaut',
  },
  {
    value: 'dark',
    label: 'Sombre',
    icon: 'moon',
    description: 'Thème sombre pour les yeux',
  },
  {
    value: 'system',
    label: 'Système',
    icon: 'settings',
    description: 'Suit les paramètres système',
  },
];

interface ThemeSelectorProps {
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

export default function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const { theme, setTheme, colors } = useTheme();

  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    onThemeChange?.(selectedTheme);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Choisir le thème!</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Personnalise l'apparence de KomOn!
      </Text>
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              {
                backgroundColor: colors.surface,
                borderColor: theme === option.value ? colors.primary : colors.border,
                borderWidth: theme === option.value ? 2 : 1,
              },
            ]}
            onPress={() => handleThemeSelect(option.value)}
            activeOpacity={0.7}
          >
            <View style={styles.optionHeader}>
              <KomOnIcon name={option.icon} size={24} />
              <View style={styles.optionInfo}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
            </View>
            
            {theme === option.value && (
              <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                <KomOnIcon name="check" size={14} style={{ color: '#ffffff' }} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 