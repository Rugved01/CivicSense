import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyA2_whvIldAjDiFdxf060dIGMXoGUscIvg",
  authDomain:        "civix-app-b7ab8.firebaseapp.com",
  projectId:         "civix-app-b7ab8",
  storageBucket:     "civix-app-b7ab8.firebasestorage.app",
  messagingSenderId: "932744215526",
  appId:             "1:932744215526:web:202aa147828476d4d5b427"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app