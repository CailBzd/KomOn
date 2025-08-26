import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import KomOnIcon from '../../components/KomOnIcons';
import MainLayout from '../../components/MainLayout';
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
      // Ici, vous pouvez implémenter la logique d'upload vers votre serveur
      // Pour l'instant, on simule juste la mise à jour
      if (updateUser) {
        await updateUser({ ...user, profilePictureUrl: imageUri });
      }
      Alert.alert('Succès', 'Photo de profil mise à jour!');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la photo de profil.');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (updateUser) {
        await updateUser({ ...user, ...formData });
      }
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès!');
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
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Galerie', onPress: pickImageFromGallery },
        { text: 'Annuler', style: 'cancel' }
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

  const renderEditButton = () => {
    if (!isEditing) {
      return (
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsEditing(true)}
        >
          <View style={styles.editButtonContent}>
            <KomOnIcon name="edit" size={16} style={{ color: '#ffffff', marginRight: 6 }} />
            <Text style={styles.editButtonText}>Modifier!</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
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
      );
    }
  };

  return (
    <MainLayout
      headerTitle="Mon Profil!"
      headerSubtitle="Gère tes informations personnelles"
      headerRightComponent={renderEditButton()}
    >
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
                      <KomOnIcon name="loading" size={20} style={{ color: '#ffffff' }} />
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={[styles.changeAvatarButton, { backgroundColor: colors.primary }, photoLoading && { backgroundColor: colors.textTertiary }]}
                  onPress={handleChangePhoto}
                  disabled={photoLoading}
                >
                  {photoLoading ? (
                    <KomOnIcon name="loading" size={16} style={{ color: '#ffffff' }} />
                  ) : (
                    <KomOnIcon name="camera" size={16} style={{ color: '#ffffff' }} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {user?.email}
                </Text>
                <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
                  @{user?.username}
                </Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informations personnelles</Text>
            
            <View style={styles.formRow}>
              <Text style={[styles.label, { color: colors.text }]}>Prénom</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData('firstName', text)}
                  placeholder="Votre prénom"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={[styles.value, { color: colors.textSecondary }]}>{user?.firstName || 'Non renseigné'}</Text>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.label, { color: colors.text }]}>Nom</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData('lastName', text)}
                  placeholder="Votre nom"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={[styles.value, { color: colors.textSecondary }]}>{user?.lastName || 'Non renseigné'}</Text>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  placeholder="Votre email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={[styles.value, { color: colors.textSecondary }]}>{user?.email || 'Non renseigné'}</Text>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.label, { color: colors.text }]}>Téléphone</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateFormData('phoneNumber', text)}
                  placeholder="Votre numéro de téléphone"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={[styles.value, { color: colors.textSecondary }]}>{user?.phoneNumber || 'Non renseigné'}</Text>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.label, { color: colors.text }]}>Date de naissance</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={formData.dateOfBirth}
                  onChangeText={(text) => updateFormData('dateOfBirth', text)}
                  placeholder="JJ/MM/AAAA"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={[styles.value, { color: colors.textSecondary }]}>{user?.dateOfBirth || 'Non renseigné'}</Text>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={formData.bio}
                  onChangeText={(text) => updateFormData('bio', text)}
                  placeholder="Parlez-nous de vous..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              ) : (
                <Text style={[styles.value, { color: colors.textSecondary }]}>{user?.bio || 'Aucune bio renseignée'}</Text>
              )}
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Préférences</Text>
            <ThemeSelector />
          </View>

          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <LogoutCard onLogout={handleLogout} loading={logoutLoading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
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
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 15, // Espace uniforme pour tous les écrans
    paddingBottom: 90,
  },
  profileCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 24,
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
  changeAvatarButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  value: {
    fontSize: 16,
    paddingVertical: 10,
  },
  settingsSection: {
    marginBottom: 24,
  },
  logoutSection: {
    marginBottom: 24,
  },
}); 