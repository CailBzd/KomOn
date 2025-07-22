import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ModernCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  showShadow?: boolean;
}

export default function ModernCard({
  title,
  subtitle,
  children,
  style,
  titleStyle,
  subtitleStyle,
  showShadow = true,
}: ModernCardProps) {
  return (
    <View style={[
      styles.card,
      showShadow && styles.shadow,
      style
    ]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
          )}
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
}); 