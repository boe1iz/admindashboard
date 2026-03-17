'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'sonner'

const IDLE_TIMEOUT_MS     = 120 * 60 * 1000  // 120 minutes
const IDLE_WARNING_MS     = 118 * 60 * 1000  // warn 2 minutes before logout
const ABSOLUTE_SESSION_MS =   8 * 60 * 60 * 1000  // 8 hours
const CHECK_INTERVAL_MS   =  60 * 1000        // check every 60 seconds

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
  const lastActivityRef = useRef<number>(Date.now())
  const warnedRef = useRef<boolean>(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let sessionCleanup: (() => void) | null = null

    const startSessionGuard = () => {
      // Preserve existing session_start across page refreshes within the same tab
      if (!sessionStorage.getItem('session_start')) {
        sessionStorage.setItem('session_start', String(Date.now()))
      }
      lastActivityRef.current = Date.now()
      warnedRef.current = false

      const handleActivity = () => {
        lastActivityRef.current = Date.now()
        warnedRef.current = false
      }

      const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const
      ACTIVITY_EVENTS.forEach(event =>
        window.addEventListener(event, handleActivity, { passive: true })
      )

      const interval = setInterval(() => {
        const now = Date.now()
        const idleMs = now - lastActivityRef.current
        const storedStart = sessionStorage.getItem('session_start')
        const sessionAgeMs = storedStart ? now - Number(storedStart) : 0

        if (sessionAgeMs >= ABSOLUTE_SESSION_MS) {
          toast.error('Your session has expired after 8 hours. Please log in again.')
          signOut(auth)
          return
        }

        if (idleMs >= IDLE_TIMEOUT_MS) {
          toast.error('You have been logged out due to inactivity.')
          signOut(auth)
          return
        }

        if (idleMs >= IDLE_WARNING_MS && !warnedRef.current) {
          warnedRef.current = true
          toast.warning('You will be logged out in 2 minutes due to inactivity.')
        }
      }, CHECK_INTERVAL_MS)

      intervalRef.current = interval

      return () => {
        ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, handleActivity))
        clearInterval(interval)
        intervalRef.current = null
        sessionStorage.removeItem('session_start')
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          // 1. Check for Admin status
          const adminDoc = await getDoc(doc(db, 'admin_users', firebaseUser.uid))
          const isUserAdmin = adminDoc.exists()
          setIsAdmin(isUserAdmin)

          // 2. Auto-create/Sync profile in 'clients' collection
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

          // 3. Start session guard (idle + absolute timeout)
          if (!intervalRef.current) {
            sessionCleanup = startSessionGuard()
          }
        } catch (error) {
          console.error('Auth sync error:', error)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
        if (sessionCleanup) {
          sessionCleanup()
          sessionCleanup = null
        }
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
      if (sessionCleanup) {
        sessionCleanup()
      }
    }
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
