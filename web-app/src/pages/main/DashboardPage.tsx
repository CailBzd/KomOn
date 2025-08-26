import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Plus, 
  Search, 
  Users, 
  CreditCard, 
  Calendar,
  MapPin,
  Clock,
  User
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()
  const { colors } = useTheme()

  const quickActions = [
    {
      icon: Plus,
      title: 'Créer un événement',
      description: 'Organise une activité',
      path: '/create-event',
      color: 'bg-blue-500'
    },
    {
      icon: Search,
      title: 'Rechercher',
      description: 'Trouve des événements',
      path: '/events',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Rejoins des groupes',
      path: '/events',
      color: 'bg-purple-500'
    },
    {
      icon: CreditCard,
      title: 'Mes crédits',
      description: 'Gère ton solde',
      path: '/credits',
      color: 'bg-yellow-500'
    }
  ]

  const recentEvents = [
    {
      id: 1,
      title: 'Match de foot amical',
      location: 'Stade municipal',
      time: 'Aujourd\'hui, 15h00',
      participants: 8,
      credits: 1
    },
    {
      id: 2,
      title: 'Course à pied matinale',
      location: 'Parc central',
      time: 'Demain, 7h00',
      participants: 12,
      credits: 1
    }
  ]

  const stats = [
    { label: 'Événements créés', value: '5', icon: Calendar },
    { label: 'Événements participés', value: '12', icon: Users },
    { label: 'Crédits disponibles', value: '8', icon: CreditCard },
    { label: 'Amis sportifs', value: '24', icon: User }
  ]

  return (
    <div className="space-y-8">
      {/* En-tête de bienvenue */}
      <div className="bg-komon-gradient rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-white/80 font-medium">🚀 Prêt à bouger? KomOn!</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Bonjour, {user?.firstName || 'Sportif'} !
          </h1>
          <p className="text-white/90 text-xl font-medium">
            Prêt pour une nouvelle activité ?
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 bg-komon-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Événements récents */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Événements récents</h2>
        <div className="space-y-4">
          {recentEvents.map((event) => (
            <div key={event.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-orange-600 font-medium">
                    👥 {event.participants} participants
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    💎 {event.credits} crédit
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistiques */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="w-12 h-12 bg-komon-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-komon-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
} 