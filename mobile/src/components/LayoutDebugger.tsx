import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import KomOnIcon from './KomOnIcons';

interface LayoutDebuggerProps {
  show?: boolean;
}

export default function LayoutDebugger({ show = false }: LayoutDebuggerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  if (!show) return null;

  const window = Dimensions.get('window');
  const screen = Dimensions.get('screen');
  const statusBarHeight = StatusBar.currentHeight || 0;
  const hasNotch = Platform.OS === 'ios' && (window.height > 800 || window.width > 800);
  
  let navigationBarHeight = 0;
  if (Platform.OS === 'android') {
    navigationBarHeight = screen.height - window.height - statusBarHeight;
    navigationBarHeight = Math.max(navigationBarHeight, 0);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.titleContainer}>
        <KomOnIcon name="wrench" size={16} style={{ color: colors.text, marginRight: 6 }} />
        <Text style={[styles.title, { color: colors.text }]}>Layout Debug Info</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Platform:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{Platform.OS}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Window:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {window.width} x {window.height}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Screen:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {screen.width} x {screen.height}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Status Bar:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{statusBarHeight}px</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Navigation Bar:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{navigationBarHeight}px</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Safe Area Top:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{insets.top}px</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Safe Area Bottom:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{insets.bottom}px</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Safe Area Left:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{insets.left}px</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Safe Area Right:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{insets.right}px</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Has Notch:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{hasNotch ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Calculated Top:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {insets.top + 20}px
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Calculated Bottom:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {insets.bottom + 30}px
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 9999,
    maxWidth: 200,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    flex: 1,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
}); 