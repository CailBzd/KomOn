import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, MapPin, Users, CreditCard, Clock, FileText } from 'lucide-react'

const createEventSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  sport: z.string().min(1, 'Veuillez sélectionner un sport'),
  location: z.string().min(3, 'L\'emplacement doit contenir au moins 3 caractères'),
  date: z.string().min(1, 'La date est requise'),
  time: z.string().min(1, 'L\'heure est requise'),
  maxParticipants: z.number().min(2, 'Minimum 2 participants').max(100, 'Maximum 100 participants'),
  credits: z.number().min(1, 'Minimum 1 crédit').max(10, 'Maximum 10 crédits'),
  level: z.string().min(1, 'Veuillez sélectionner un niveau'),
  equipment: z.string().optional(),
})

type CreateEventFormData = z.infer<typeof createEventSchema>

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      maxParticipants: 10,
      credits: 1,
      level: 'Tous niveaux',
    }
  })

  const sports = [
    'Football', 'Basketball', 'Tennis', 'Course à pied', 'Natation', 
    'Volleyball', 'Badminton', 'Ping-pong', 'Golf', 'Autre'
  ]

  const levels = [
    'Tous niveaux', 'Débutant', 'Intermédiaire', 'Avancé', 'Expert'
  ]

  const onSubmit = async (data: CreateEventFormData) => {
    setLoading(true)
    
    try {
      // Simulation d'une création d'événement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Événement créé:', data)
      setIsSuccess(true)
      reset()
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Événement créé avec succès !</h2>
          <p className="text-gray-600 mb-6">Votre événement est maintenant visible par la communauté</p>
          <button
            onClick={() => setIsSuccess(false)}
            className="btn-primary"
          >
            Créer un autre événement
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Créer un événement</h1>
        <p className="text-gray-600 mt-2">Organisez une activité sportive et invitez la communauté à y participer</p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Informations générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'événement *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="input-field"
                placeholder="Ex: Match de foot amical"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Sport */}
            <div>
              <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
                Sport *
              </label>
              <select
                {...register('sport')}
                id="sport"
                className="input-field"
              >
                <option value="">Sélectionner un sport</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
              {errors.sport && (
                <p className="mt-1 text-sm text-red-600">{errors.sport.message}</p>
              )}
            </div>

            {/* Niveau */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Niveau requis
              </label>
              <select
                {...register('level')}
                id="level"
                className="input-field"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="input-field"
                placeholder="Décrivez votre événement, les règles, l'équipement nécessaire..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Localisation et horaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emplacement */}
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Emplacement *
              </label>
              <input
                {...register('location')}
                type="text"
                id="location"
                className="input-field"
                placeholder="Ex: Stade municipal, Parc central..."
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                {...register('date')}
                type="date"
                id="date"
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Heure */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Heure *
              </label>
              <input
                {...register('time')}
                type="time"
                id="time"
                className="input-field"
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Participants et coûts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre maximum de participants */}
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre maximum de participants *
              </label>
              <input
                {...register('maxParticipants', { valueAsNumber: true })}
                type="number"
                id="maxParticipants"
                min="2"
                max="100"
                className="input-field"
              />
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
              )}
            </div>

            {/* Coût en crédits */}
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                Coût en crédits *
              </label>
              <input
                {...register('credits', { valueAsNumber: true })}
                type="number"
                id="credits"
                min="1"
                max="10"
                className="input-field"
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
              )}
            </div>

            {/* Équipement nécessaire */}
            <div className="md:col-span-2">
              <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-2">
                Équipement nécessaire (optionnel)
              </label>
              <input
                {...register('equipment')}
                type="text"
                id="equipment"
                className="input-field"
                placeholder="Ex: Chaussures de sport, raquette, ballon..."
              />
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-secondary"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création en cours...
              </div>
            ) : (
              'Créer l\'événement'
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 