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
}))

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth' },
  db: { type: 'db' },
}))

function TestComponent() {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return (
    <div>
      {user ? `User: ${user.email}, Admin: ${isAdmin ? 'yes' : 'no'}` : 'No User'}
    </div>
  )
}

describe('AuthProvider with Firestore Roles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets isAdmin to true if UID exists in admin_users collection', async () => {
    const mockUser = { uid: 'admin-uid', email: 'admin@on3.com' }
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })
    vi.mocked(getDoc).mockResolvedValue({ exists: () => true } as any)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('User: admin@on3.com, Admin: yes')).toBeDefined()
    })
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'admin_users', 'admin-uid')
  })

  it('sets isAdmin to false if UID does not exist in admin_users collection', async () => {
    const mockUser = { uid: 'client-uid', email: 'client@on3.com' }
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })
    vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as any)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('User: client@on3.com, Admin: no')).toBeDefined()
    })
  })
});
