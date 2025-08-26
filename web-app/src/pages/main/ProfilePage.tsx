import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Veuillez saisir une adresse email valide'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().min(1, 'La date de naissance est requise'),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      bio: user?.bio || '',
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    
    try {
      // Simulation de mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = { ...user, ...data }
      updateUser(updatedUser)
      setIsEditing(false)
      reset(data)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos préférences</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </button>
        )}
      </div>

      {/* Photo de profil */}
      <div className="card">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="Photo de profil"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-primary-600" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">@{user?.username}</p>
            <p className="text-sm text-gray-500">Membre depuis {new Date(user?.createdAt || '').toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      {/* Formulaire de profil */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Nom d'utilisateur */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur *
              </label>
              <input
                {...register('username')}
                type="text"
                id="username"
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                {...register('phoneNumber')}
                type="tel"
                id="phoneNumber"
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance *
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                id="dateOfBirth"
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                {...register('bio')}
                id="bio"
                rows={4}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Parlez-nous un peu de vous, vos sports préférés..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </button>
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
          </div>
        )}
      </form>

      {/* Statistiques */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistiques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">5</div>
            <div className="text-gray-600">Événements créés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">12</div>
            <div className="text-gray-600">Événements participés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">8</div>
            <div className="text-gray-600">Crédits disponibles</div>
          </div>
        </div>
      </div>
    </div>
  )
} 