import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { AuthProvider } from '../components/AuthProvider'
import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { getDoc, setDoc, addDoc, collection } from 'firebase/firestore'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}))

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn((db, coll, id) => ({ db, coll, id })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  collection: vi.fn((db, coll) => ({ db, coll })),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth' },
  db: { type: 'db' },
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}))

describe('Default Program Assignment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    sessionStorage.setItem('tab_auth_granted', '1')
  })

  it('should assign default programs when a new client is created', async () => {
    const mockUser = { 
      uid: 'new-user-123', 
      email: 'new@user.com',
      displayName: 'New Athlete'
    }

    // Mock onAuthStateChanged to trigger resolveSession
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })

    // Mock getDoc to simulate new user (no admin doc, no client doc)
    vi.mocked(getDoc).mockImplementation(async (docRef: any) => {
      return { exists: () => false } as any
    })

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    )

    // Wait for resolveSession to complete
    await waitFor(() => {
      expect(vi.mocked(setDoc)).toHaveBeenCalled()
    })

    // This is the expected behavior that is currently "broken" (missing)
    // We expect addDoc to be called to assign a default program
    expect(vi.mocked(addDoc)).toHaveBeenCalledWith(
      expect.objectContaining({ coll: 'assignments' }),
      expect.objectContaining({
        client_id: 'new-user-123',
        program_id: expect.any(String),
      })
    )
  })
})
