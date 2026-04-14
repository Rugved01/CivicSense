import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import { useTranslation } from 'react-i18next'

const catIcons = { 
  Road: '🛣️', 
  Electricity: '⚡', 
  Water: '💧', 
  Sanitation: '🗑️', 
  Parks: '🌳', 
  Other: '📌' 
}

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth()
  const { t } = useTranslation()
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (!currentUser) return
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (isAdmin) {
        setIssues(data)
      } else {
        setIssues(data.filter(i => i.userId === currentUser.uid))
      }
    })
    return unsub
  }, [currentUser, isAdmin])

  const filtered = issues
    .filter(i => {
      const searchTerm = search.toLowerCase()
      return i.title?.toLowerCase().includes(searchTerm) ||
             i.location?.toLowerCase().includes(searchTerm) ||
             i.userName?.toLowerCase().includes(searchTerm)
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    })

  const uniqueLocations = isAdmin ? [...new Set(issues.map(i => i.location?.split(',')[0] || i.location))] : []

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {isAdmin ? t('dashboard.admin.title') : t('dashboard.user.title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isAdmin ? t('dashboard.admin.subtitle') : t('dashboard.user.subtitle')}
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.totalReports')}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent)' }}>{issues.length}</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          
          {isAdmin && (
            <>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.uniqueLocations')}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent)' }}>{uniqueLocations.length}</p>
                  </div>
                  <div className="text-3xl">📍</div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.totalUpvotes')}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent)' }}>{issues.reduce((sum, i) => sum + (i.votes || 0), 0)}</p>
                  </div>
                  <div className="text-3xl">👍</div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('stats.recentWeek')}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent)' }}>
                      {issues.filter(i => {
                        const date = i.createdAt?.toDate?.() || new Date(i.date?.split('/').reverse().join('-'))
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return date >= weekAgo
                      }).length}
                    </p>
                  </div>
                  <div className="text-3xl">📅</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder={isAdmin ? t('search.placeholderAdmin') : t('search.placeholder')} 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="input-field" 
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-36">
            <option value="newest">{t('sort.newest')}</option>
            <option value="oldest">{t('sort.oldest')}</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('showing')} <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{filtered.length}</span> {t('of')} {issues.length} {t('issues')}
        </div>

        {/* Cards Grid - 3 per row */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('noIssues')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('noIssuesDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(issue => (
              <div 
                key={issue.id} 
                onClick={() => setSelected(issue)} 
                className="rounded-xl transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                {issue.imageUrl && (
                  <div className="aspect-[4/3] p-2" style={{ background: 'var(--bg-secondary)' }}>
                    <img
                      src={issue.imageUrl}
                      alt="Issue"
                      className="w-full h-full rounded-lg object-contain transition duration-300 hover:scale-[1.02]"
                      style={{ background: 'var(--bg-primary)' }}
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{catIcons[issue.category] || '📌'}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' }}>
                        {t(`category.${issue.category}`) || issue.category}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{issue.date}</span>
                  </div>

                  <h3 className="font-bold text-base mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {issue.title}
                  </h3>
                  
                  <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    📍 {issue.location?.split(',')[0] || issue.location}
                  </p>
                  
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👍</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{issue.votes || 0} {t('issue.upvotes')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">✅</span>
                        <span className="text-xs font-medium" style={{ color: '#10b981' }}>{t('issue.reported')}</span>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                          {(issue.userName || '?')[0].toUpperCase()}
                        </div>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {issue.userName?.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {isAdmin && issue.location && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        📍 {t('dashboard.admin.fullLocation')}: {issue.location.length > 35 ? issue.location.substring(0, 35) + '...' : issue.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for details */}
      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} className="max-w-md w-full max-h-[85vh] overflow-y-auto p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{catIcons[selected.category] || '📌'}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' }}>
                  {t(`category.${selected.category}`) || selected.category}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl hover:opacity-70" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>

            {selected.imageUrl && (
              <div className="mb-3 rounded-lg p-2" style={{ background: 'var(--bg-secondary)' }}>
                <img
                  src={selected.imageUrl}
                  alt="Issue"
                  className="w-full max-h-[60vh] rounded-md object-contain"
                  style={{ background: 'var(--bg-primary)' }}
                />
              </div>
            )}

            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{selected.title}</h2>
            
            <p className="text-sm mb-2 flex items-start gap-1" style={{ color: 'var(--text-secondary)' }}>
              <span>📍</span> {selected.location}
            </p>
            
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{selected.description}</p>

            {isAdmin && (
              <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#f59e0b' }}>📋 {t('dashboard.admin.reporterInfo')}</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    {(selected.userName || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.userName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected.userEmail}</p>
                  </div>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>📅 {t('dashboard.admin.reportedOn')}: {selected.date}</p>
              </div>
            )}

            {selected.coords && (
              <div className="p-2 rounded-lg mb-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-xs" style={{ color: 'var(--accent)' }}>📍 {t('dashboard.admin.gpsCoords')}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selected.coords.lat.toFixed(5)}, {selected.coords.lng.toFixed(5)}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <span>👍</span>
                <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{selected.votes || 0} {t('issue.upvotes')}</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>🆔 {t('dashboard.admin.issueId')}: {selected.id?.slice(-6)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}