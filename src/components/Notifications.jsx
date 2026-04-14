import { useState, useEffect, useRef } from 'react'
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import { useTranslation } from 'react-i18next'

export default function Notifications() {
  const { currentUser, isAdmin } = useAuth()
  const { t } = useTranslation()
  const [notifs, setNotifs] = useState([])
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'notifications'),
      orderBy('timestamp', 'desc'),
      limit(30)
    )

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Filter notifications based on user
      const filtered = isAdmin
        ? data
        : data.filter(n =>
            n.type === 'new_issue' ||
            n.userId === currentUser.uid
          )
      setNotifs(filtered)
    })

    return unsub
  }, [currentUser, isAdmin])

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifs.filter(n => !n.readBy?.includes(currentUser?.uid)).length

  const markAllRead = async () => {
    if (!currentUser) return
    for (const n of notifs) {
      if (!n.readBy?.includes(currentUser.uid)) {
        try {
          await updateDoc(doc(db, 'notifications', n.id), {
            readBy: arrayUnion(currentUser.uid)
          })
        } catch (error) {
          console.error('Failed to mark notification as read:', error)
        }
      }
    }
  }

  const handleOpen = () => {
    setOpen(o => !o)
    if (!open) markAllRead()
  }

  const timeAgo = (ts) => {
    if (!ts) return t('notifications.justNow')
    return ts.toDate().toLocaleString()
  }

  const getNotificationMessage = (n) => {
    if (n.type === 'new_issue') {
      return t('notifications.newIssueMessage', {
        category: t(`category.${n.category || 'Other'}`),
        location: n.location?.split(',')[0] || n.location || 'your area',
        name: n.userName || 'a citizen'
      })
    }
    if (n.type === 'status_change') {
      return `🔄 ${n.message || 'Issue status updated'}`
    }
    return n.message || 'New notification'
  }

  if (!currentUser) return null

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg transition"
        style={{ 
          background: open ? 'rgba(59,130,246,0.15)' : 'transparent',
          border: open ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: '#ef4444', border: '2px solid var(--bg-card)' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[450px] rounded-xl shadow-xl overflow-hidden z-50"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              🔔 {t('notifications.title')}
            </span>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' }}>
                {unreadCount} {t('notifications.new')}
              </span>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[350px]">
            {notifs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🔕</div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('notifications.empty')}</p>
              </div>
            ) : (
              notifs.map(n => {
                const isUnread = !n.readBy?.includes(currentUser?.uid)
                return (
                  <div key={n.id} 
                    className="p-3 border-b transition"
                    style={{ 
                      borderColor: 'var(--border)',
                      background: isUnread ? 'rgba(59,130,246,0.03)' : 'transparent'
                    }}>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: 'rgba(59,130,246,0.1)' }}>
                        {n.type === 'new_issue' ? '📍' : '🔔'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {getNotificationMessage(n)}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: 'var(--accent)' }} />
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="p-2 border-t text-center" style={{ borderColor: 'var(--border)' }}>
              <button onClick={markAllRead} className="text-xs hover:opacity-70 transition"
                style={{ color: 'var(--text-muted)' }}>
                {t('notifications.markAllRead')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}