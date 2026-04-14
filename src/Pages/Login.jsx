import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError('') }

  const friendlyError = code => {
    const m = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/email-already-in-use': 'Email already registered. Try logging in.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Wait a moment and retry.',
    }
    return m[code] || 'Something went wrong. Please try again.'
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (mode === 'signup' && !form.name.trim()) { setError('Please enter your full name.'); return }
    setLoading(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await signup(form.email, form.password, form.name.trim())
      navigate('/')
    } catch (err) { setError(friendlyError(err.code)) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <div className="hidden lg:flex lg:w-1/2 relative p-12" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>🏛️</div>
            <span className="text-xl font-bold text-white">CivicSense</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Your voice shapes<br/>your city.</h1>
          <p className="text-gray-300 mb-8">Join thousands of citizens making Indian cities better — one honest report at a time.</p>
          <div className="space-y-3">
            {['📍 Report civic issues with exact GPS pin', '👍 Upvote issues that matter most', '🔔 Live notifications on status updates'].map(text => (
              <div key={text} className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">✓</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === m ? 'text-white' : ''}`}
                style={mode === m ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' } : { color: 'var(--text-secondary)' }}>
                {m === 'login' ? '🔑 Sign In' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{mode === 'login' ? t('login.welcome') : t('signup.title')}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{mode === 'login' ? t('login.subtitle') : t('signup.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('signup.name')}</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Arjun Mehta" className="input-field" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('login.email')}</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('login.password')}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field" required />
            </div>

            {error && <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>⚠️ {error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-70" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-slow mx-auto"></div> : (mode === 'login' ? t('login.button') : t('signup.button'))}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? t('login.noAccount') : t('signup.haveAccount')}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }} className="ml-1 font-medium" style={{ color: 'var(--accent)' }}>
              {mode === 'login' ? t('login.signup') : t('signup.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}