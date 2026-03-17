import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuthProvider, useAuth } from '../components/AuthProvider'
import LoginPage from '../app/login/page.tsx'
import React from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { useRouter, usePathname } from 'next/navigation'

// We need to mock AuthGuard as well or at least the parts it uses
// For simplicity, we will test the logic inside AuthProvider and its interaction with a mock Guard

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}))

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth', currentUser: null },
  db: { type: 'db' },
}))

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

describe('Auth Routing & Guard Verification', () => {
  const mockRouter = {
    replace: vi.fn(),
    push: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue(mockRouter as any)
    vi.mocked(usePathname).mockReturnValue('/login')
    sessionStorage.clear()
  })

  it('resolves login stall: user is logged in and admin, and redirect happens after refreshAuth', async () => {
    const mockUser = { uid: 'admin-123', email: 'admin@test.com' }
    
    // 1. Mock onAuthStateChanged
    let authCallback: any
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      authCallback = cb
      cb(null)
      return () => {}
    })

    // 2. Mock Firestore
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'admin' })
    } as any)

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )

    // 3. Simulate login
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser
    } as any)

    // Simulate AuthProvider seeing the user after handleLogin triggers refreshAuth
    // In our test, we manually trigger the callback
    await authCallback(mockUser)

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/')
    }, { timeout: 2000 })
  })

  it('correctly handles unauthorized non-admin users', async () => {
    const mockUser = { uid: 'client-123', email: 'client@test.com' }
    
    let authCallback: any
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      authCallback = cb
      cb(null)
      return () => {}
    })

    // Mock Firestore: Admin check FAILS
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => false
    } as any)

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )

    // Force auth granted for test
    sessionStorage.setItem('tab_auth_granted', '1')
    await authCallback(mockUser)

    // Should NOT redirect to dashboard
    await waitFor(() => {
      expect(mockRouter.replace).not.toHaveBeenCalledWith('/')
    })
  })
})
