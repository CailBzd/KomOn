import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages d'authentification
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Pages principales
import DashboardPage from './pages/main/DashboardPage'
import EventsPage from './pages/main/EventsPage'
import CreateEventPage from './pages/main/CreateEventPage'
import MyEventsPage from './pages/main/MyEventsPage'
import ProfilePage from './pages/main/ProfilePage'
import CreditsPage from './pages/main/CreditsPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Routes protégées */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="my-events" element={<MyEventsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="credits" element={<CreditsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 