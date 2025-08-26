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
  ActivityIndicator,
} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, Sport } from '../../services/apiService';
import MainLayout from '../../components/MainLayout';
import KomOnIcon from '../../components/KomOnIcons';

interface CreateEventForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  sport_id: string;
  max_participants: number;
  price: number;
  difficulty_level: string;
  requirements: string;
  // Nouvelles options avancées
  visibility: 'public' | 'private' | 'invitation';
  registration_type: 'automatic' | 'approval' | 'invitation_only';
  waiting_list_enabled: boolean;
  max_waiting_list: number;
  contribution_type: 'none' | 'fixed' | 'variable';
  contribution_amount: number;
  contribution_description: string;
  allow_guests: boolean;
  max_guests_per_participant: number;
  auto_approve_registrations: boolean;
  require_phone_number: boolean;
  require_emergency_contact: boolean;
  cancellation_policy: string;
  refund_policy: string;
}

export default function CreateEventScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [formData, setFormData] = useState<CreateEventForm>({
    title: '',
    description: '',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h par défaut
    location: '',
    sport_id: '',
    max_participants: 10,
    price: 0,
    difficulty_level: 'Débutant',
    requirements: '',
    // Nouvelles options avancées
    visibility: 'public',
    registration_type: 'automatic',
    waiting_list_enabled: false,
    max_waiting_list: 5,
    contribution_type: 'none',
    contribution_amount: 0,
    contribution_description: '',
    allow_guests: false,
    max_guests_per_participant: 1,
    auto_approve_registrations: true,
    require_phone_number: false,
    require_emergency_contact: false,
    cancellation_policy: '',
    refund_policy: '',
  });

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      const response = await apiService.getAllSports();
      if (response.success && response.data) {
        setSports(response.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des sports:', error);
    }
  };

  const updateFormData = (field: keyof CreateEventForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date, isStartDate = true) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }

    if (selectedDate) {
      const field = isStartDate ? 'start_date' : 'end_date';
      updateFormData(field, selectedDate.toISOString());
      
      // Si on change la date de début, ajuster la date de fin si nécessaire
      if (isStartDate && new Date(formData.end_date) <= selectedDate) {
        const newEndDate = new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000); // +2h
        updateFormData('end_date', newEndDate.toISOString());
      }
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Le titre est requis';
    if (!formData.description.trim()) return 'La description est requise';
    if (!formData.location.trim()) return 'Le lieu est requis';
    if (!formData.sport_id) return 'Veuillez sélectionner un sport';
    if (formData.max_participants < 1) return 'Le nombre de participants doit être supérieur à 0';
    if (formData.price < 0) return 'Le prix ne peut pas être négatif';
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const now = new Date();
    
    if (startDate <= now) return 'La date de début doit être dans le futur';
    if (endDate <= startDate) return 'La date de fin doit être après la date de début';
    
    return null;
  };

  const handleCreateEvent = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Erreur de validation', error);
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        ...formData,
        organizer_id: user?.id,
        type: 'public',
        status: 'active',
      };

      const response = await apiService.createEvent(eventData);
      
      if (response.success && response.data) {
        Alert.alert(
          'Succès', 
          'Événement créé avec succès !',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de créer l\'événement');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'événement');
    } finally {
      setLoading(false);
    }
  };

  const difficultyLevels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

  return (
    <MainLayout
      headerTitle="Créer un événement"
      headerSubtitle="Organise ton prochain défi sportif"
      headerRightComponent={
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateEvent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.createButtonText}>Créer</Text>
          )}
        </TouchableOpacity>
      }
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Titre */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informations générales</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Titre de l'événement *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.title}
                onChangeText={(text) => updateFormData('title', text)}
                placeholder="Ex: Match de foot amical"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                placeholder="Décrivez votre événement..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Dates et lieu */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Date et lieu</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Date et heure de début *</Text>
              <TouchableOpacity
                style={[styles.dateButton, { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }]}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: colors.text }]}>
                  {formatDate(formData.start_date)} à {formatTime(formData.start_date)}
                </Text>
                <KomOnIcon name="calendar" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Date et heure de fin *</Text>
              <TouchableOpacity
                style={[styles.dateButton, { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }]}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: colors.text }]}>
                  {formatDate(formData.end_date)} à {formatTime(formData.end_date)}
                </Text>
                <KomOnIcon name="calendar" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Lieu *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.location}
                onChangeText={(text) => updateFormData('location', text)}
                placeholder="Ex: Parc des Sports, Lyon"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Sport et participants */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sport et participants</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Sport *</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }]}>
                <Text style={[styles.pickerText, { color: colors.text }]}>
                  {formData.sport_id 
                    ? sports.find(s => s.id === formData.sport_id)?.name || 'Sélectionner un sport'
                    : 'Sélectionner un sport'
                  }
                </Text>
                <KomOnIcon name="chevron-down" size={20} color={colors.textSecondary} />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
                {sports.map((sport) => (
                  <TouchableOpacity
                    key={sport.id}
                    style={[
                      styles.sportChip,
                      formData.sport_id === sport.id && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => updateFormData('sport_id', sport.id)}
                  >
                    <Text style={[
                      styles.sportChipText,
                      { color: formData.sport_id === sport.id ? '#ffffff' : colors.text }
                    ]}>
                      {sport.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: colors.text }]}>Participants max</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={formData.max_participants.toString()}
                  onChangeText={(text) => updateFormData('max_participants', parseInt(text) || 0)}
                  placeholder="10"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: colors.text }]}>Prix (€)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={formData.price.toString()}
                  onChangeText={(text) => updateFormData('price', parseFloat(text) || 0)}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Niveau de difficulté</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }]}>
                <Text style={[styles.pickerText, { color: colors.text }]}>
                  {formData.difficulty_level}
                </Text>
                <KomOnIcon name="chevron-down" size={20} color={colors.textSecondary} />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyScroll}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyChip,
                      formData.difficulty_level === level && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => updateFormData('difficulty_level', level)}
                  >
                    <Text style={[
                      styles.difficultyChipText,
                      { color: formData.difficulty_level === level ? '#ffffff' : colors.text }
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Visibilité et inscription */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Visibilité et inscription</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Visibilité de l'événement</Text>
              <View style={styles.optionsContainer}>
                {[
                  { value: 'public', label: 'Public', description: 'Visible par tous' },
                  { value: 'private', label: 'Privé', description: 'Visible par les participants' },
                  { value: 'invitation', label: 'Sur invitation', description: 'Visible par invitation uniquement' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      formData.visibility === option.value && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                    ]}
                    onPress={() => updateFormData('visibility', option.value as any)}
                  >
                    <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Type d'inscription</Text>
              <View style={styles.optionsContainer}>
                {[
                  { value: 'automatic', label: 'Automatique', description: 'Inscription immédiate' },
                  { value: 'approval', label: 'Sur approbation', description: 'Validation requise' },
                  { value: 'invitation_only', label: 'Invitation uniquement', description: 'Par invitation seulement' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      formData.registration_type === option.value && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                    ]}
                    onPress={() => updateFormData('registration_type', option.value as any)}
                  >
                    <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: colors.text }]}>File d'attente</Text>
                <TouchableOpacity
                  style={[styles.switchContainer, { backgroundColor: colors.surface }]}
                  onPress={() => updateFormData('waiting_list_enabled', !formData.waiting_list_enabled)}
                >
                  <Text style={[styles.switchLabel, { color: colors.text }]}>
                    {formData.waiting_list_enabled ? 'Activée' : 'Désactivée'}
                  </Text>
                  <View style={[
                    styles.switch,
                    formData.waiting_list_enabled && { backgroundColor: colors.primary }
                  ]}>
                    <View style={[
                      styles.switchThumb,
                      formData.waiting_list_enabled && { transform: [{ translateX: 20 }] }
                    ]} />
                  </View>
                </TouchableOpacity>
              </View>

              {formData.waiting_list_enabled && (
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={[styles.label, { color: colors.text }]}>Max file d'attente</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.surface, 
                      color: colors.text,
                      borderColor: colors.border 
                    }]}
                    value={formData.max_waiting_list.toString()}
                    onChangeText={(text) => updateFormData('max_waiting_list', parseInt(text) || 0)}
                    placeholder="5"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Cotisations */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cotisations et paiements</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Type de cotisation</Text>
              <View style={styles.optionsContainer}>
                {[
                  { value: 'none', label: 'Gratuit', description: 'Aucune cotisation' },
                  { value: 'fixed', label: 'Montant fixe', description: 'Cotisation fixe' },
                  { value: 'variable', label: 'Montant variable', description: 'Cotisation libre' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      formData.contribution_type === option.value && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                    ]}
                    onPress={() => updateFormData('contribution_type', option.value as any)}
                  >
                    <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {formData.contribution_type !== 'none' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Montant de la cotisation (€)</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.surface, 
                      color: colors.text,
                      borderColor: colors.border 
                    }]}
                    value={formData.contribution_amount.toString()}
                    onChangeText={(text) => updateFormData('contribution_amount', parseFloat(text) || 0)}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Description de la cotisation</Text>
                  <TextInput
                    style={[styles.textArea, { 
                      backgroundColor: colors.surface, 
                      color: colors.text,
                      borderColor: colors.border 
                    }]}
                    value={formData.contribution_description}
                    onChangeText={(text) => updateFormData('contribution_description', text)}
                    placeholder="Ex: Cotisation pour l'équipement, les boissons..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>
              </>
            )}
          </View>

          {/* Options avancées */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Options avancées</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: colors.text }]}>Autoriser les invités</Text>
                <TouchableOpacity
                  style={[styles.switchContainer, { backgroundColor: colors.surface }]}
                  onPress={() => updateFormData('allow_guests', !formData.allow_guests)}
                >
                  <Text style={[styles.switchLabel, { color: colors.text }]}>
                    {formData.allow_guests ? 'Oui' : 'Non'}
                  </Text>
                  <View style={[
                    styles.switch,
                    formData.allow_guests && { backgroundColor: colors.primary }
                  ]}>
                    <View style={[
                      styles.switchThumb,
                      formData.allow_guests && { transform: [{ translateX: 20 }] }
                    ]} />
                  </View>
                </TouchableOpacity>
              </View>

              {formData.allow_guests && (
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={[styles.label, { color: colors.text }]}>Max invités/participant</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.surface, 
                      color: colors.text,
                      borderColor: colors.border 
                    }]}
                    value={formData.max_guests_per_participant.toString()}
                    onChangeText={(text) => updateFormData('max_guests_per_participant', parseInt(text) || 0)}
                    placeholder="1"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: colors.text }]}>Approbation auto</Text>
                <TouchableOpacity
                  style={[styles.switchContainer, { backgroundColor: colors.surface }]}
                  onPress={() => updateFormData('auto_approve_registrations', !formData.auto_approve_registrations)}
                >
                  <Text style={[styles.switchLabel, { color: colors.text }]}>
                    {formData.auto_approve_registrations ? 'Oui' : 'Non'}
                  </Text>
                  <View style={[
                    styles.switch,
                    formData.auto_approve_registrations && { backgroundColor: colors.primary }
                  ]}>
                    <View style={[
                      styles.switchThumb,
                      formData.auto_approve_registrations && { transform: [{ translateX: 20 }] }
                    ]} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: colors.text }]}>Téléphone requis</Text>
                <TouchableOpacity
                  style={[styles.switchContainer, { backgroundColor: colors.surface }]}
                  onPress={() => updateFormData('require_phone_number', !formData.require_phone_number)}
                >
                  <Text style={[styles.switchLabel, { color: colors.text }]}>
                    {formData.require_phone_number ? 'Oui' : 'Non'}
                  </Text>
                  <View style={[
                    styles.switch,
                    formData.require_phone_number && { backgroundColor: colors.primary }
                  ]}>
                    <View style={[
                      styles.switchThumb,
                      formData.require_phone_number && { transform: [{ translateX: 20 }] }
                    ]} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Contact d'urgence requis</Text>
              <TouchableOpacity
                style={[styles.switchContainer, { backgroundColor: colors.surface }]}
                onPress={() => updateFormData('require_emergency_contact', !formData.require_emergency_contact)}
              >
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  {formData.require_emergency_contact ? 'Oui' : 'Non'}
                </Text>
                <View style={[
                  styles.switch,
                  formData.require_emergency_contact && { backgroundColor: colors.primary }
                ]}>
                  <View style={[
                    styles.switchThumb,
                    formData.require_emergency_contact && { transform: [{ translateX: 20 }] }
                  ]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Politiques */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Politiques (optionnel)</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Politique d'annulation</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.cancellation_policy}
                onChangeText={(text) => updateFormData('cancellation_policy', text)}
                placeholder="Ex: Annulation possible jusqu'à 24h avant l'événement..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Politique de remboursement</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.refund_policy}
                onChangeText={(text) => updateFormData('refund_policy', text)}
                placeholder="Ex: Remboursement intégral en cas d'annulation..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Prérequis */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Prérequis (optionnel)</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Équipement ou prérequis</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.requirements}
                onChangeText={(text) => updateFormData('requirements', text)}
                placeholder="Ex: Prévoir des chaussures de sport, bouteille d'eau..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Date Pickers - Temporairement désactivé */}
        {/* {showStartPicker && (
          <DateTimePicker
            value={new Date(formData.start_date)}
            mode="datetime"
            display="default"
            onChange={(event: any, date?: Date) => handleDateChange(event, date, true)}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={new Date(formData.end_date)}
            mode="datetime"
            display="default"
            onChange={(event: any, date?: Date) => handleDateChange(event, date, false)}
            minimumDate={new Date(formData.start_date)}
          />
        )} */}
      </KeyboardAvoidingView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 90,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
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
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
  },
  sportsScroll: {
    marginTop: 8,
  },
  sportChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  sportChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyScroll: {
    marginTop: 8,
  },
  difficultyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  difficultyChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
}); 