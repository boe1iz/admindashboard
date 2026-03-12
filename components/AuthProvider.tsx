'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          // 1. Check for Admin status
          const adminDoc = await getDoc(doc(db, 'admin_users', firebaseUser.uid))
          const isUserAdmin = adminDoc.exists()
          setIsAdmin(isUserAdmin)

          // 2. Auto-create/Sync profile in 'clients' collection
          // We use the UID as the ID to ensure 1:1 match with Auth
          const clientRef = doc(db, 'clients', firebaseUser.uid)
          const clientDoc = await getDoc(clientRef)
          
          if (!clientDoc.exists()) {
            console.log('Creating initial profile for authenticated user:', firebaseUser.email)
            await setDoc(clientRef, {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New Athlete',
              email: firebaseUser.email?.toLowerCase() || '',
              is_active: true,
              created_at: serverTimestamp(),
              updated_at: serverTimestamp(),
              notes: ''
            })
          }
        } catch (error) {
          console.error('Auth sync error:', error)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
