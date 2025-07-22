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
import { authService } from '../../services/authService';
import LogoutCard from '../../components/LogoutCard';
import { useDeviceInfo, getDeviceMargins } from '../../utils/deviceUtils';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
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

      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
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

      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    try {
      console.log('🖼️ Upload de la photo:', imageUri);
      
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler une URL de photo
      const fakeImageUrl = `https://example.com/profile-${Date.now()}.jpg`;
      
      console.log('📤 Envoi de l\'URL vers le serveur:', fakeImageUrl);
      
      // Mettre à jour le profil avec la nouvelle photo
      const response = await authService.updateProfilePicture({ imageUrl: fakeImageUrl });
      
      console.log('📡 Réponse du serveur:', response);

      if (response.isSuccess) {
        if (response.user) {
          // Si on a reçu l'utilisateur mis à jour
          updateUser(response.user);
          Alert.alert('Succès', 'Photo de profil mise à jour avec succès');
        } else if (response.error) {
          // Si on a seulement un message de succès
          Alert.alert('Succès', response.error);
          // Recharger les données utilisateur depuis le serveur
          try {
            const profileResponse = await authService.getProfile();
            if (profileResponse.isSuccess && profileResponse.user) {
              updateUser(profileResponse.user);
            }
          } catch (profileError) {
            console.error('❌ Erreur lors du rechargement du profil:', profileError);
          }
        }
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour de la photo');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Impossible de mettre à jour la photo de profil';
      Alert.alert('Erreur', errorMessage);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('🔄 Mise à jour du profil...', formData);
      
      const response = await authService.updateProfile({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
      });

      console.log('✅ Réponse du serveur:', response);

      if (response.isSuccess && response.user) {
        updateUser(response.user);
        setIsEditing(false);
        Alert.alert(
          'Succès', 
          'Profil mis à jour avec succès',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        const errorMessage = response.error || 'Erreur lors de la mise à jour';
        console.error('❌ Erreur de mise à jour:', errorMessage);
        Alert.alert('Erreur', errorMessage);
      }
    } catch (error) {
      console.error('❌ Exception lors de la mise à jour:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Remettre les données originales de l'utilisateur
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
    setIsEditing(false);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Modifier la photo',
      'Choisissez une option',
      [
        {
          text: '📷 Appareil photo',
          onPress: takePhoto
        },
        {
          text: '🖼️ Galerie',
          onPress: pickImageFromGallery
        },
        {
          text: 'Annuler',
          style: 'cancel'
        }
      ]
    );
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    } finally {
      setLogoutLoading(false);
    }
  };

  const renderFixedHeader = () => (
    <View style={[styles.fixedHeader, { paddingTop: deviceInfo.statusBarHeight + deviceMargins.statusBarMargin }]}>
      <View style={styles.fixedHeaderContent}>
        <View style={styles.fixedHeaderLeft}>
          <Text style={styles.fixedHeaderTitle}>Mon Profil</Text>
          <Text style={styles.fixedHeaderSubtitle}>Gérez vos informations</Text>
        </View>
        {!isEditing ? (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>✏️ Modifier</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>❌</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
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
    </View>
  );

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
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
              <View style={styles.avatarLoading}>
                <Text style={styles.avatarLoadingText}>⏳</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.changeAvatarButton, photoLoading && styles.changeAvatarButtonDisabled]}
            onPress={handleChangePhoto}
            disabled={photoLoading}
          >
            <Text style={styles.changeAvatarText}>
              {photoLoading ? '⏳' : '📷'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.profileUsername}>@{user?.username}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>
      {user?.bio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      )}
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.sectionTitle}>📊 Statistiques</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Événements</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Amis</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
    </View>
  );

  const renderFormSection = () => (
    <View style={styles.formCard}>
      <Text style={styles.sectionTitle}>📝 Informations Personnelles</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>👤 Pseudo</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(value) => updateFormData('username', value)}
            placeholder="Votre pseudo"
            placeholderTextColor="#9CA3AF"
          />
        ) : (
          <View style={styles.displayValue}>
            <Text style={styles.displayText}>{user?.username}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>👨 Prénom</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              placeholder="Prénom"
              placeholderTextColor="#9CA3AF"
            />
          ) : (
            <View style={styles.displayValue}>
              <Text style={styles.displayText}>{user?.firstName}</Text>
            </View>
          )}
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>👨‍💼 Nom</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Nom"
              placeholderTextColor="#9CA3AF"
            />
          ) : (
            <View style={styles.displayValue}>
              <Text style={styles.displayText}>{user?.lastName}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>📧 Email</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayText}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>📱 Téléphone</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(value) => updateFormData('phoneNumber', value)}
            placeholder="Votre numéro"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
        ) : (
          <View style={styles.displayValue}>
            <Text style={styles.displayText}>{user?.phoneNumber || 'Non renseigné'}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>🎂 Date de naissance</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.dateOfBirth}
            onChangeText={(value) => updateFormData('dateOfBirth', value)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
          />
        ) : (
          <View style={styles.displayValue}>
            <Text style={styles.displayText}>{user?.dateOfBirth || 'Non renseignée'}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>💬 Bio</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.bio}
            onChangeText={(value) => updateFormData('bio', value)}
            placeholder="Parlez-nous un peu de vous..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        ) : (
          <View style={styles.displayValue}>
            <Text style={styles.displayText}>{user?.bio || 'Aucune bio'}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderAccountInfo = () => (
    <View style={styles.accountCard}>
      <Text style={styles.sectionTitle}>🔐 Informations du Compte</Text>
      <View style={styles.accountInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rôle</Text>
          <Text style={styles.infoValue}>{user?.role || 'Utilisateur'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Statut</Text>
          <Text style={styles.infoValue}>{user?.status || 'Actif'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Membre depuis</Text>
          <Text style={styles.infoValue}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsCard}>
      <Text style={styles.sectionTitle}>⚙️ Actions</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔑 Changer mot de passe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔔 Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🌙 Mode sombre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const headerHeight = deviceInfo.statusBarHeight + deviceMargins.statusBarMargin + 60; // 60 pour le contenu de l'en-tête

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {renderFixedHeader()}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContainer, { paddingTop: headerHeight + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {renderProfileCard()}
          {renderStatsCard()}
          {renderFormSection()}
          {renderAccountInfo()}
          {renderActions()}
          <LogoutCard
            title="Compte"
            subtitle="Gérez votre session et vos paramètres de sécurité"
            onLogout={handleLogout}
            loading={logoutLoading}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  fixedHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 60,
  },
  fixedHeaderLeft: {
    flex: 1,
  },
  fixedHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  fixedHeaderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  avatarLoadingText: {
    fontSize: 20,
    color: '#ffffff',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  changeAvatarButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  changeAvatarText: {
    fontSize: 12,
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#3b82f6',
  },
  bioContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bioText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  displayValue: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  displayText: {
    fontSize: 16,
    color: '#1f2937',
  },
  accountCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
}); 