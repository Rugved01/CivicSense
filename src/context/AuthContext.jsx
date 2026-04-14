import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, name) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      role: 'user',
      createdAt: serverTimestamp(),
    })
    return cred
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  async function fetchProfile(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      if (snap.exists()) {
        setUserProfile({ uid, ...snap.data() })
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const value = {
    currentUser,
    userProfile,
    isAdmin: userProfile?.role === 'admin',
    isLoggedIn: !!currentUser,
    signup,
    login,
    logout,
    fetchProfile,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin-slow mx-auto mb-3"></div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading CivicSense...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}