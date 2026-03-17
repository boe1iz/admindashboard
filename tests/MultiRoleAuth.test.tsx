import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../components/AuthProvider'
import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
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

function TestComponent() {
  const { user, isAdmin, isClient, loading } = (useAuth() as any)
  if (loading) return <div>Loading...</div>
  return (
    <div>
      {user ? `User: ${user.email}, Admin: ${isAdmin ? 'yes' : 'no'}, Client: ${isClient ? 'yes' : 'no'}` : 'No User'}
    </div>
  )
}

describe('AuthProvider Multi-Role Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    // Default mock implementation for getDoc
    vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as any)
  })

  it('identifies user as Admin if in admin_users collection', async () => {
    const mockUser = { uid: 'admin-123', email: 'admin@test.com' }
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })
    
    // First call for admin_users exists, second for clients exists
    vi.mocked(getDoc)
      .mockResolvedValueOnce({ exists: () => true } as any) // admin_users
      .mockResolvedValueOnce({ exists: () => true } as any) // clients (sync check)

    sessionStorage.setItem('tab_auth_granted', '1')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('User: admin@test.com, Admin: yes, Client: no')).toBeDefined()
    })
  })

  it('identifies user as Client if NOT in admin_users but in clients collection', async () => {
    const mockUser = { uid: 'client-123', email: 'client@test.com' }
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })
    
    vi.mocked(getDoc)
      .mockResolvedValueOnce({ exists: () => false } as any) // admin_users
      .mockResolvedValueOnce({ exists: () => true } as any)  // clients

    sessionStorage.setItem('tab_auth_granted', '1')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('User: client@test.com, Admin: no, Client: yes')).toBeDefined()
    })
  })

  it('handles user in neither collection (fallback to client after sync)', async () => {
    const mockUser = { uid: 'new-user', email: 'new@test.com' }
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })
    
    vi.mocked(getDoc)
      .mockResolvedValueOnce({ exists: () => false } as any) // admin_users
      .mockResolvedValueOnce({ exists: () => false } as any) // clients (needs creation)

    sessionStorage.setItem('tab_auth_granted', '1')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('User: new@test.com, Admin: no, Client: yes')).toBeDefined()
    })
  })
})
