import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import NavigationBar from './NavigationBar'
import Header from './Header'

export default function Layout() {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />
      <div className="flex">
        <NavigationBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 