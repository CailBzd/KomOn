import React, { useState } from 'react';
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
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import LoadingButton from '../../components/LoadingButton';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    bio: user?.bio || '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authService.updateProfile({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
      });

      if (response.isSuccess && response.user) {
        updateUser(response.user);
        setIsEditing(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
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

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            setLogoutLoading(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la déconnexion');
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Mon Profil</Text>
              {!isEditing ? (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Profile Picture */}
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePicture}>
                <Text style={styles.profilePictureText}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Text>
              </View>
              {isEditing && (
                <TouchableOpacity style={styles.changePictureButton}>
                  <Text style={styles.changePictureText}>Changer</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.username}>@{user?.username}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pseudo</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(value) => updateFormData('username', value)}
                    placeholder="Votre pseudo"
                  />
                ) : (
                  <Text style={styles.value}>{user?.username}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Prénom</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={formData.firstName}
                      onChangeText={(value) => updateFormData('firstName', value)}
                      placeholder="Prénom"
                    />
                  ) : (
                    <Text style={styles.value}>{user?.firstName}</Text>
                  )}
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Nom</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={formData.lastName}
                      onChangeText={(value) => updateFormData('lastName', value)}
                      placeholder="Nom"
                    />
                  ) : (
                    <Text style={styles.value}>{user?.lastName}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={formData.phoneNumber}
                    onChangeText={(value) => updateFormData('phoneNumber', value)}
                    placeholder="Votre numéro"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.value}>{user?.phoneNumber || 'Non renseigné'}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date de naissance</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={formData.dateOfBirth}
                    onChangeText={(value) => updateFormData('dateOfBirth', value)}
                    placeholder="YYYY-MM-DD"
                  />
                ) : (
                  <Text style={styles.value}>{user?.dateOfBirth || 'Non renseignée'}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.bio}
                    onChangeText={(value) => updateFormData('bio', value)}
                    placeholder="Parlez-nous un peu de vous..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                ) : (
                  <Text style={styles.value}>{user?.bio || 'Aucune bio'}</Text>
                )}
              </View>
            </View>

            {/* Account Info */}
            <View style={styles.accountSection}>
              <Text style={styles.sectionTitle}>Informations du compte</Text>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Rôle</Text>
                <Text style={styles.infoValue}>{user?.role}</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Statut</Text>
                <Text style={styles.infoValue}>{user?.status}</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Membre depuis</Text>
                <Text style={styles.infoValue}>
                  {new Date(user?.createdAt || '').toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Changer le mot de passe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Paramètres de confidentialité</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Supprimer mon compte</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <LoadingButton
                title="Se déconnecter"
                loadingTitle="Déconnexion..."
                onPress={handleLogout}
                loading={logoutLoading}
                variant="outline"
                style={styles.logoutButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  editButton: {
    backgroundColor: '#319795',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#319795',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    width: 100,
    height: 100,
    backgroundColor: '#319795',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePictureText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  changePictureButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changePictureText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#a0aec0',
  },
  formSection: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3748',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#4a5568',
    paddingVertical: 12,
  },
  accountSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  actionsSection: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2d3748',
    textAlign: 'center',
  },
  logoutSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logoutButton: {
    borderColor: '#dc2626',
  },
}); 