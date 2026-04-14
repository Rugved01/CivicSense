import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'
import { useTranslation } from 'react-i18next'
import Notifications from './Notifications'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile, isAdmin, isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const langRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.report'), path: '/report' },
    { name: t('nav.dashboard'), path: '/dashboard' },
  ]

  const displayLinks = isAdmin ? navLinks.filter(l => l.path !== '/report') : navLinks

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setLangOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Translated App Name */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
              🏛️
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{t('app.name')}</span>
            {isAdmin && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                {t('nav.admin')}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {displayLinks.map(link => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                  }}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notifications Bell - ONLY FOR ADMIN */}
            {isLoggedIn && isAdmin && <Notifications />}

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
              >
                🌐 {i18n.language.toUpperCase()}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {['en', 'hi', 'mr'].map(lng => (
                    <button
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {lng === 'en' && '🇬🇧 ' + t('language.english')}
                      {lng === 'hi' && '🇮🇳 ' + t('language.hindi')}
                      {lng === 'mr' && '🇮🇳 ' + t('language.marathi')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                    {(userProfile?.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {userProfile?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition"
                  style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium transition" style={{ color: 'var(--text-secondary)' }}>
                  {t('nav.login')}
                </Link>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-white transition" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t p-4 flex flex-col gap-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          {displayLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: location.pathname === link.path ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t pt-3 mt-2 flex gap-2" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={toggleTheme}
              className="flex-1 px-4 py-2 rounded-lg text-sm transition"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <div className="relative flex-1">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
              >
                🌐 {i18n.language.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute bottom-full mb-1 left-0 right-0 rounded-lg shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {['en', 'hi', 'mr'].map(lng => (
                    <button
                      key={lng}
                      onClick={() => { changeLanguage(lng); setMenuOpen(false) }}
                      className="block w-full text-left px-4 py-2 text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {lng === 'en' && '🇬🇧 English'}
                      {lng === 'hi' && '🇮🇳 हिन्दी'}
                      {lng === 'mr' && '🇮🇳 मराठी'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}
            >
              {t('nav.logout')}
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-center text-white transition" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
              {t('nav.getStarted')}
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}