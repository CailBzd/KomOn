import { useState } from 'react'
import { Calendar, MapPin, Users, CreditCard, Edit, Trash2, Eye } from 'lucide-react'

interface MyEvent {
  id: number
  title: string
  location: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  credits: number
  sport: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isOrganizer: boolean
}

export default function MyEventsPage() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming')

  const myEvents: MyEvent[] = [
    {
      id: 1,
      title: 'Match de foot amical',
      location: 'Stade municipal',
      date: '2024-01-15',
      time: '15:00',
      participants: 8,
      maxParticipants: 22,
      credits: 1,
      sport: 'Football',
      status: 'upcoming',
      isOrganizer: true
    },
    {
      id: 2,
      title: 'Course à pied matinale',
      location: 'Parc central',
      date: '2024-01-16',
      time: '07:00',
      participants: 12,
      maxParticipants: 30,
      credits: 1,
      sport: 'Course à pied',
      status: 'upcoming',
      isOrganizer: false
    },
    {
      id: 3,
      title: 'Tennis en double',
      location: 'Tennis Club',
      date: '2024-01-10',
      time: '18:00',
      participants: 4,
      maxParticipants: 8,
      credits: 2,
      sport: 'Tennis',
      status: 'completed',
      isOrganizer: false
    }
  ]

  const tabs = [
    { id: 'upcoming', label: 'À venir', count: myEvents.filter(e => e.status === 'upcoming').length },
    { id: 'past', label: 'Passés', count: myEvents.filter(e => e.status === 'completed').length }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir'
      case 'ongoing': return 'En cours'
      case 'completed': return 'Terminé'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const filteredEvents = myEvents.filter(event => {
    if (selectedTab === 'upcoming') {
      return event.status === 'upcoming'
    } else {
      return event.status === 'completed'
    }
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes événements</h1>
        <p className="text-gray-600 mt-2">Gérez vos événements et suivez vos participations</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'upcoming' | 'past')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Liste des événements */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedTab === 'upcoming' ? 'Aucun événement à venir' : 'Aucun événement passé'}
            </h3>
            <p className="text-gray-600">
              {selectedTab === 'upcoming' 
                ? 'Vous n\'avez pas encore d\'événements programmés'
                : 'Vous n\'avez pas encore participé à d\'événements'
              }
            </p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="card hover:shadow-md transition-shadow">
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
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                      {event.isOrganizer && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Organisateur
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
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

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="btn-secondary flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Voir détails</span>
                      </button>
                      
                      {event.isOrganizer && event.status === 'upcoming' && (
                        <>
                          <button className="btn-secondary flex items-center space-x-2">
                            <Edit className="h-4 w-4" />
                            <span>Modifier</span>
                          </button>
                          <button className="btn-secondary text-red-600 hover:text-red-700 flex items-center space-x-2">
                            <Trash2 className="h-4 w-4" />
                            <span>Annuler</span>
                          </button>
                        </>
                      )}
                    </div>

                    {!event.isOrganizer && event.status === 'upcoming' && (
                      <button className="btn-secondary text-red-600 hover:text-red-700">
                        Se désinscrire
                      </button>
                    )}
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