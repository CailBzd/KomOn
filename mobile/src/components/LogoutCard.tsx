import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import LogoutButton from './LogoutButton';

interface LogoutCardProps {
  title?: string;
  subtitle?: string;
  onLogout: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export default function LogoutCard({
  title = 'Compte',
  subtitle = 'Gérez votre session',
  onLogout,
  loading = false,
  style,
}: LogoutCardProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔐</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <LogoutButton
          title="Se déconnecter"
          loading={loading}
          onPress={onLogout}
          variant="danger"
          fullWidth
          showIcon
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
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
  buttonContainer: {
    marginTop: 8,
  },
}); 