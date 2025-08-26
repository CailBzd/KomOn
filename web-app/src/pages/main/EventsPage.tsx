import { useState } from 'react'
import { Search, Filter, MapPin, Calendar, Users, CreditCard } from 'lucide-react'

interface Event {
  id: number
  title: string
  description: string
  location: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  credits: number
  sport: string
  organizer: string
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')

  const events: Event[] = [
    {
      id: 1,
      title: 'Match de foot amical',
      description: 'Match de football amical ouvert à tous niveaux. Venez vous amuser !',
      location: 'Stade municipal',
      date: '2024-01-15',
      time: '15:00',
      participants: 8,
      maxParticipants: 22,
      credits: 1,
      sport: 'Football',
      organizer: 'Club Sportif Local'
    },
    {
      id: 2,
      title: 'Course à pied matinale',
      description: 'Course à pied dans le parc central. Départ à 7h00.',
      location: 'Parc central',
      date: '2024-01-16',
      time: '07:00',
      participants: 12,
      maxParticipants: 30,
      credits: 1,
      sport: 'Course à pied',
      organizer: 'Running Club'
    },
    {
      id: 3,
      title: 'Tennis en double',
      description: 'Session de tennis en double. Niveau intermédiaire requis.',
      location: 'Tennis Club',
      date: '2024-01-17',
      time: '18:00',
      participants: 4,
      maxParticipants: 8,
      credits: 2,
      sport: 'Tennis',
      organizer: 'Tennis Pro'
    }
  ]

  const sports = ['all', 'Football', 'Course à pied', 'Tennis', 'Basketball', 'Natation']

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSport = selectedSport === 'all' || event.sport === selectedSport
    
    return matchesSearch && matchesSport
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Événements sportifs</h1>
        <p className="text-gray-600 mt-2">Découvrez et participez à des événements sportifs près de chez vous</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="input-field min-w-[150px]"
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'Tous les sports' : sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="grid gap-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Image de l'événement (placeholder) */}
                <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-primary-600 font-semibold text-center">
                    <div className="text-2xl mb-2">⚽</div>
                    <div className="text-sm">{event.sport}</div>
                  </div>
                </div>

                {/* Informations de l'événement */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
                      {event.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {event.sport}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{event.participants}/{event.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span>{event.credits} crédit{event.credits > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Organisé par <span className="font-medium text-gray-700">{event.organizer}</span>
                    </div>
                    <button className="btn-primary">
                      Participer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 