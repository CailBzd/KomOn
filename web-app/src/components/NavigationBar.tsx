import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  Plus, 
  Users, 
  User, 
  CreditCard,
  MapPin,
  Settings
} from 'lucide-react'

const navigationItems = [
  { path: '/', icon: Home, label: 'Tableau de bord' },
  { path: '/events', icon: Calendar, label: 'Événements' },
  { path: '/create-event', icon: Plus, label: 'Créer un événement' },
  { path: '/my-events', icon: Users, label: 'Mes événements' },
  { path: '/profile', icon: User, label: 'Profil' },
  { path: '/credits', icon: CreditCard, label: 'Mes crédits' },
]

export default function NavigationBar() {
  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-komon-gradient text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <NavLink
          to="/settings"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Paramètres</span>
        </NavLink>
      </div>
    </nav>
  )
} 