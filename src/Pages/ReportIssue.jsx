import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import MapPicker from '../components/MapPicker'
import { uploadImage } from '../services/imageUpload'
import { useTranslation } from 'react-i18next'

const categories = [
  { value: 'Road', icon: '🛣️' },
  { value: 'Electricity', icon: '⚡' },
  { value: 'Water', icon: '💧' },
  { value: 'Sanitation', icon: '🗑️' },
  { value: 'Parks', icon: '🌳' },
  { value: 'Other', icon: '📌' },
]

export default function ReportIssue() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ title: '', category: '', location: '', description: '' })
  const [coords, setCoords] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadError, setUploadError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed')
      return
    }
    setUploadError('')
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleMapConfirm = (address, c) => {
    setForm(f => ({ ...f, location: address }))
    setCoords(c)
    setShowMap(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.category || !form.location || !form.description) {
      alert('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setUploadError('')
    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      await addDoc(collection(db, 'issues'), {
        title: form.title,
        category: form.category,
        location: form.location,
        description: form.description,
        coords: coords || null,
        imageUrl: imageUrl,
        userId: currentUser.uid,
        userName: userProfile?.name || 'Anonymous',
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-IN'),
      })

      await addDoc(collection(db, 'notifications'), {
        type: 'new_issue',
        message: `📍 New ${form.category} issue reported in ${form.location.split(',')[0]} by ${userProfile?.name || 'a citizen'}`,
        category: form.category,
        userId: currentUser.uid,
        userName: userProfile?.name || 'Anonymous',
        location: form.location,
        timestamp: serverTimestamp(),
        readBy: [],
      })

      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setUploadError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ title: '', category: '', location: '', description: '' })
    setCoords(null)
    setStep(1)
    setSubmitted(false)
    setImageFile(null)
    setImagePreview(null)
    setUploadError('')
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-md w-full p-8 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5" style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}>
          ✅
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t('success.title')}</h2>
        <p className="mb-5" style={{ color: 'var(--text-secondary)' }}>{t('success.message')}</p>
        {imagePreview && (
          <div className="mb-5 rounded-xl border p-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
            <img
              src={imagePreview}
              alt="Submitted"
              className="w-full max-h-72 rounded-lg object-contain"
              style={{ background: 'var(--bg-primary)' }}
            />
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {t('success.reportAnother')}
          </button>
          <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 rounded-xl font-medium text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
            {t('success.goDashboard')}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {showMap && <MapPicker onConfirm={handleMapConfirm} onClose={() => setShowMap(false)} initialAddress={form.location} />}

      <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('report.title')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{t('report.subtitle')}</p>
          </div>

          <div className="flex gap-2 mb-8 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            {[
              { num: '1', label: t('report.step1') },
              { num: '2', label: t('report.step2') },
              { num: '3', label: t('report.step3') }
            ].map((s, i) => (
              <div key={s.num} className={`flex-1 text-center py-2 rounded-lg text-sm font-medium transition ${step === i + 1 ? 'text-white' : ''}`}
                style={step === i + 1 ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' } : { color: 'var(--text-muted)' }}>
                {step > i + 1 ? '✓' : s.num}. {s.label}
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('report.titleLabel')} *</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder={t('report.titlePlaceholder')} className="input-field" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('report.categoryLabel')} *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(cat => (
                        <button key={cat.value} type="button" onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                          className="py-2 rounded-lg text-sm font-medium transition text-center"
                          style={form.category === cat.value 
                            ? { background: 'rgba(59,130,246,0.15)', border: '2px solid var(--accent)', color: 'var(--accent)' }
                            : { border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          <span className="text-lg block mb-1">{cat.icon}</span>{cat.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('report.descriptionLabel')} *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder={t('report.descriptionPlaceholder')} className="input-field resize-none" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('report.photoLabel')} {t('report.photoOptional')}</label>
                    {imagePreview ? (
                      <div className="relative rounded-xl border p-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-h-80 rounded-lg object-contain"
                          style={{ background: 'var(--bg-primary)' }}
                        />
                        <button type="button" onClick={removeImage} className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium text-white" style={{ background: 'rgba(239,68,68,0.9)' }}>✕ Remove</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-12 rounded-xl border-2 border-dashed transition" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                        <div className="text-3xl mb-2">📷</div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t('report.photoClick')}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('report.photoHint')}</p>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                    {uploadError && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{uploadError}</p>}
                  </div>

                  <button type="button" onClick={() => { if (!form.title || !form.category || !form.description) { alert('Fill in title, category and description first.'); return } setStep(2) }} className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                    {t('report.next')} →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('report.locationLabel')} *</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder={t('report.locationPlaceholder')} className="input-field" />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('report.locationHint')}</p>
                  </div>

                  <button type="button" onClick={() => setShowMap(true)} className="w-full py-4 rounded-xl border-2 border-dashed transition" style={{ borderColor: coords ? 'rgba(16,185,129,0.5)' : 'var(--border)', background: 'var(--bg-secondary)' }}>
                    <div className="text-3xl mb-2">🗺️</div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{coords ? t('report.locationPinned') : t('report.pickMap')}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('report.mapHint')}</p>
                  </button>

                  {form.location && (
                    <div className="p-3 rounded-lg flex gap-2" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <span>📍</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{form.location}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>← {t('report.back')}</button>
                    <button type="button" onClick={() => { if (!form.location) { alert('Please enter or pick a location.'); return } setStep(3) }} className="flex-1 py-3 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>{t('report.review')} →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{t('report.reviewTitle')}</h3>
                  
                  {imagePreview && (
                    <div className="rounded-xl border p-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-80 rounded-lg object-contain"
                        style={{ background: 'var(--bg-primary)' }}
                      />
                    </div>
                  )}

                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                    {[
                      ['Title', form.title],
                      ['Category', form.category],
                      ['Location', form.location],
                      ['Description', form.description],
                      ['Photo', imageFile ? '✓ Attached' : 'None'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex p-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs font-semibold w-24" style={{ color: 'var(--text-muted)' }}>{k}</span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v || '—'}</span>
                      </div>
                    ))}
                  </div>

                  {uploadError && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{uploadError}</p>}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>← {t('report.back')}</button>
                    <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-70" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-slow mx-auto"></div> : `🚀 ${t('report.submit')}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}