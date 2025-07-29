import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/authService';
import LogoutCard from '../../components/LogoutCard';
import ThemeSelector from '../../components/ThemeSelector';
import ImprovedIcon from '../../components/ImprovedIcon';
import { useDeviceInfo, getDeviceMargins } from '../../utils/deviceUtils';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const { colors } = useTheme();
  const deviceInfo = useDeviceInfo();
  const deviceMargins = getDeviceMargins(deviceInfo);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    bio: user?.bio || '',
  });

  // Mettre à jour formData quand user change
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à votre galerie.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à votre appareil photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setPhotoLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      setPhotoLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    try {
      setPhotoLoading(true);
      
      // Simuler l'upload (remplacer par votre logique d'upload)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mettre à jour l'utilisateur avec la nouvelle photo
      if (updateUser) {
        await updateUser({
          ...user,
          profilePictureUrl: imageUri,
        });
      }
      
      Alert.alert('Succès!', 'Photo de profil mise à jour!');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la photo de profil.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Simuler la sauvegarde (remplacer par votre logique d'API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (updateUser) {
        await updateUser({
          ...user,
          ...formData,
        });
      }
      
      setIsEditing(false);
      Alert.alert('Succès!', 'Profil mis à jour!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Changer la photo',
      'Choisissez une option:',
      [
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Galerie', onPress: pickImageFromGallery },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
              <StatusBar barStyle={colors.text === '#f7fafc' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        {/* Fixed Header */}
        <View style={[styles.fixedHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
                <Text style={styles.logoText}>K</Text>
              </View>
              <Text style={[styles.logoText, { color: colors.primary }]}>KomOn!</Text>
            </View>
            {!isEditing ? (
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>✏️ Modifier!</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { backgroundColor: colors.error }]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>❌</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, { backgroundColor: colors.success }, loading && { backgroundColor: colors.textTertiary }]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? '⏳' : '✅'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Mon Profil!</Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Gère tes informations personnelles</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    {user?.profilePictureUrl ? (
                      <Image 
                        source={{ uri: user.profilePictureUrl }} 
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </Text>
                    )}
                    {photoLoading && (
                      <View style={[styles.avatarLoading, { backgroundColor: colors.primary + 'CC' }]}>
                        <Text style={styles.avatarLoadingText}>⏳</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={[styles.changeAvatarButton, { backgroundColor: colors.primary }, photoLoading && { backgroundColor: colors.textTertiary }]}
                    onPress={handleChangePhoto}
                    disabled={photoLoading}
                  >
                    <Text style={styles.changeAvatarText}>
                      {photoLoading ? '⏳' : '📷'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text style={[styles.profileUsername, { color: colors.primary }]}>@{user?.username}</Text>
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                </View>
              </View>
              {user?.bio && (
                <View style={styles.bioContainer}>
                  <Text style={[styles.bioText, { color: colors.text }]}>{user.bio}</Text>
                </View>
              )}
            </View>

            {/* Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Tes statistiques!</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <ImprovedIcon type="event" size="large" />
                  <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Événements créés!</Text>
                </View>
                <View style={styles.statItem}>
                  <ImprovedIcon type="participation" size="large" />
                  <Text style={[styles.statNumber, { color: colors.primary }]}>45</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Participations!</Text>
                </View>
                <View style={styles.statItem}>
                  <ImprovedIcon type="credit" size="large" />
                  <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Crédits gagnés!</Text>
                </View>
              </View>
            </View>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Form Section */}
            {isEditing && (
              <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Modifier tes informations!</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Prénom</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData('firstName', text)}
                    placeholder="Votre prénom"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Nom</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData('lastName', text)}
                    placeholder="Votre nom"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Nom d'utilisateur</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.username}
                    onChangeText={(text) => updateFormData('username', text)}
                    placeholder="Votre nom d'utilisateur"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    placeholder="Votre email"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Téléphone</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.phoneNumber}
                    onChangeText={(text) => updateFormData('phoneNumber', text)}
                    placeholder="Votre numéro de téléphone"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Date de naissance</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.dateOfBirth}
                    onChangeText={(text) => updateFormData('dateOfBirth', text)}
                    placeholder="JJ/MM/AAAA"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Bio</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea, { 
                      borderColor: colors.border, 
                      color: colors.text, 
                      backgroundColor: colors.surface 
                    }]}
                    value={formData.bio}
                    onChangeText={(text) => updateFormData('bio', text)}
                    placeholder="Parlez-nous de vous..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            )}

            {/* Account Info */}
            <View style={[styles.accountInfo, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Informations du compte!</Text>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Membre depuis</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>Décembre 2024</Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Dernière connexion</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>Aujourd'hui</Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Statut</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>Actif</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={[styles.actions, { backgroundColor: colors.surface }]}>
              <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.borderLight }]}>
                <ImprovedIcon type="security" size="medium" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Sécurité!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.borderLight }]}>
                <ImprovedIcon type="notification" size="medium" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Notifications!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.borderLight }]}>
                <ImprovedIcon type="language" size="medium" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Langue!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.borderLight }]}>
                <ImprovedIcon type="help" size="medium" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Aide!</Text>
              </TouchableOpacity>
            </View>

            {/* Logout */}
            <LogoutCard onLogout={handleLogout} loading={logoutLoading} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  userInfo: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  profileCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  avatarLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLoadingText: {
    fontSize: 24,
    color: '#ffffff',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changeAvatarText: {
    fontSize: 16,
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  bioContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  formSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  accountInfo: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
}); 