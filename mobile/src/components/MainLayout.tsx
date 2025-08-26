import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SafeAreaWrapper from './SafeAreaWrapper';
import StatusBarManager from './StatusBarManager';
import GlobalHeader from './GlobalHeader';

interface MainLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  headerRightComponent?: React.ReactNode;
}

export default function MainLayout({
  children,
  headerTitle,
  headerSubtitle,
  showNotification = true,
  onNotificationPress,
  headerRightComponent
}: MainLayoutProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaWrapper>
      <StatusBarManager />
      
      {/* Header global fixe */}
      <GlobalHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        showNotification={showNotification}
        onNotificationPress={onNotificationPress}
        rightComponent={headerRightComponent}
      />
      
      {/* Contenu principal */}
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 0, // Pas de marge supplémentaire pour éviter le décalage
  },
}); 