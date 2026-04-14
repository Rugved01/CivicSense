import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Login from './Pages/Login'
import ReportIssue from './Pages/ReportIssue'
import Dashboard from './Pages/Dashboard'

function Protected({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<><Navbar /><Home /></>} />
      <Route path="/report" element={<><Navbar /><Protected><ReportIssue /></Protected></>} />
      <Route path="/dashboard" element={<><Navbar /><Protected><Dashboard /></Protected></>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}