import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun, LogOut, User } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-komon-gradient">KomOn</h1>
          <span className="text-gray-600 font-medium">Application Sportive</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Profil"
              >
                <User className="h-5 w-5" />
              </button>
              
                        <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:bg-red-100"
            title="Déconnexion"
          >
            <LogOut className="h-5 w-5" />
          </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 