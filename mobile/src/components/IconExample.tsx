import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import KomOnIcon, { KomOnLogo, SportIcon, EventTypeIcon } from './KomOnIcons';
import { useTheme } from '../contexts/ThemeContext';

export default function IconExample() {
  const { colors } = useTheme();

  const iconCategories = [
    {
      title: 'Navigation',
      icons: [
        { name: 'home', label: 'Accueil' },
        { name: 'events', label: 'Événements' },
        { name: 'profile', label: 'Profil' },
        { name: 'community', label: 'Communauté' },
        { name: 'settings', label: 'Paramètres' },
      ]
    },
    {
      title: 'Actions',
      icons: [
        { name: 'add', label: 'Ajouter' },
        { name: 'search', label: 'Rechercher' },
        { name: 'edit', label: 'Modifier' },
        { name: 'delete', label: 'Supprimer' },
        { name: 'save', label: 'Sauvegarder' },
      ]
    },
    {
      title: 'Sport & Activités',
      icons: [
        { name: 'activity', label: 'Activité' },
        { name: 'trophy', label: 'Trophée' },
        { name: 'target', label: 'Objectif' },
        { name: 'trendingUp', label: 'Progression' },
        { name: 'zap', label: 'Énergie' },
      ]
    },
    {
      title: 'Social',
      icons: [
        { name: 'heart', label: 'J\'aime' },
        { name: 'star', label: 'Favori' },
        { name: 'message', label: 'Message' },
        { name: 'share', label: 'Partager' },
        { name: 'users', label: 'Utilisateurs' },
      ]
    },
    {
      title: 'Formulaires',
      icons: [
        { name: 'eye', label: 'Voir' },
        { name: 'eyeOff', label: 'Masquer' },
        { name: 'lock', label: 'Verrouiller' },
        { name: 'mail', label: 'Email' },
        { name: 'phone', label: 'Téléphone' },
      ]
    },
    {
      title: 'Statuts',
      icons: [
        { name: 'success', label: 'Succès' },
        { name: 'error', label: 'Erreur' },
        { name: 'warning', label: 'Attention' },
        { name: 'info', label: 'Information' },
        { name: 'help', label: 'Aide' },
      ]
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <KomOnLogo size={48} />
        <Text style={[styles.title, { color: colors.text }]}>
          Icônes KomOn avec Lucide
        </Text>
      </View>

      {iconCategories.map((category, index) => (
        <View key={index} style={styles.category}>
          <Text style={[styles.categoryTitle, { color: colors.text }]}>
            {category.title}
          </Text>
          <View style={styles.iconGrid}>
            {category.icons.map((icon, iconIndex) => (
              <View key={iconIndex} style={[styles.iconItem, { backgroundColor: colors.surface }]}>
                <KomOnIcon name={icon.name} size={24} />
                <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>
                  {icon.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.category}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          Icônes de Sports
        </Text>
        <View style={styles.iconGrid}>
          {['running', 'cycling', 'swimming', 'football', 'basketball'].map((sport, index) => (
            <View key={index} style={[styles.iconItem, { backgroundColor: colors.surface }]}>
              <SportIcon sport={sport} size={24} />
              <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>
                {sport}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.category}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          Types d'Événements
        </Text>
        <View style={styles.iconGrid}>
          {['competition', 'training', 'social', 'charity', 'workshop'].map((type, index) => (
            <View key={index} style={[styles.iconItem, { backgroundColor: colors.surface }]}>
              <EventTypeIcon type={type} size={24} />
              <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>
                {type}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
}); 