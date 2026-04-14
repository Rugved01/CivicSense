import { useCallback, useEffect, useRef, useState } from 'react'

function MapPicker({ onConfirm, onClose, initialAddress }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [address, setAddress] = useState('Move the pin to select exact location...')
  const [searchQuery, setSearchQuery] = useState(initialAddress || '')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [currentCoords, setCurrentCoords] = useState(null)

  // Reverse geocode from coordinates
  const reverseGeocode = useCallback(async (lat, lng) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.display_name) {
        const parts = data.display_name.split(', ')
        setAddress(parts.slice(0, 4).join(', '))
      } else {
        setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update marker position and get address
  const updateMarkerPosition = useCallback((lat, lng, shouldReverseGeocode = true) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    }
    setCurrentCoords({ lat, lng })
    if (shouldReverseGeocode) {
      reverseGeocode(lat, lng)
    }
  }, [reverseGeocode])

  // Geocode search and move map
  const geocodeAndFly = useCallback(async (query) => {
    if (!query || !mapRef.current) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        mapRef.current.setView([lat, lng], 16, { animate: true })
        updateMarkerPosition(lat, lng, true)
      }
    } catch (e) {
      console.error('Geocode failed', e)
    } finally {
      setSearching(false)
    }
  }, [updateMarkerPosition])

  // Initialize map
  useEffect(() => {
    if (!window.L || mapRef.current) return
    const L = window.L

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Create draggable marker
    const marker = L.marker([20.5937, 78.9629], { draggable: true }).addTo(map)
    
    marker.on('dragend', () => {
      const position = marker.getLatLng()
      updateMarkerPosition(position.lat, position.lng, true)
    })

    markerRef.current = marker
    mapRef.current = map

    // If user already typed an address, fly there
    if (initialAddress && initialAddress.trim().length > 3) {
      setTimeout(() => geocodeAndFly(initialAddress), 400)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          map.setView([latitude, longitude], 14)
          updateMarkerPosition(latitude, longitude, true)
        },
        () => {},
        { timeout: 5000 }
      )
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markerRef.current = null
    }
  }, [geocodeAndFly, initialAddress, updateMarkerPosition])

  const handleSearch = async (e) => {
    e.preventDefault()
    await geocodeAndFly(searchQuery)
  }

  const handleConfirm = () => {
    if (currentCoords) {
      onConfirm(address, currentCoords)
    } else if (mapRef.current) {
      const center = mapRef.current.getCenter()
      onConfirm(address, { lat: center.lat, lng: center.lng })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.95)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">📍</span>
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Select Exact Location</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Drag the pin to the exact spot on map</p>
          </div>
        </div>
        <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm font-medium transition" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
          ✕ Close
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 p-3 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search address, area or landmark..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
        >
          {searching ? '...' : '→ Go'}
        </button>
      </form>

      {/* Map with draggable pin */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Instruction overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs z-10 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
          👆 Drag the red pin to exact location
        </div>
      </div>

      {/* Bottom bar with address */}
      <div className="p-4 border-t" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 p-3 rounded-lg mb-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin-slow"></div>
          ) : (
            <span>📍</span>
          )}
          <span className="text-sm truncate flex-1" style={{ color: loading ? 'var(--text-muted)' : 'var(--text-primary)' }}>
            {loading ? 'Getting address...' : address}
          </span>
          {currentCoords && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' }}>
              ✓ Pin placed
            </span>
          )}
        </div>
        
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-medium transition disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
        >
          ✅ Confirm This Location
        </button>
      </div>
    </div>
  )
}

export default MapPicker