import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const [stats, setStats] = useState({ total: 0 })
  const { t } = useTranslation()

  useEffect(() => {
    const q = query(collection(db, 'issues'))
    const unsub = onSnapshot(q, snap => {
      setStats({ total: snap.docs.length })
    })
    return unsub
  }, [])

  const features = [
    { icon: '📍', title: t('home.feature1Title'), desc: t('home.feature1Desc') },
    { icon: '👍', title: t('home.feature2Title'), desc: t('home.feature2Desc') },
    { icon: '🔔', title: t('home.feature3Title'), desc: t('home.feature3Desc') },
    { icon: '🔒', title: t('home.feature4Title'), desc: t('home.feature4Desc') },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{t('home.empowering')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            {t('home.heroTitle')}{' '}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {t('home.heroTitleGradient')}
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            {t('home.heroDesc')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/report" className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
              📍 {t('nav.report')}
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded-xl font-semibold transition" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              📊 {t('nav.dashboard')}
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stats.total}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.totalReports')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>24/7</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.liveMonitoring')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>Free</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.freeForAll')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t('home.featuresTitle')}</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{t('home.featuresDesc')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl transition-all hover:-translate-y-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span>🏛️</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('app.name')}</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('app.footer')}</p>
      </footer>
    </div>
  )
}