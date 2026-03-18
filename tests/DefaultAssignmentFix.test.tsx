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
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
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

// Mock activity logging
vi.mock('@/lib/activity', () => ({
  logActivity: vi.fn(),
}))

describe('Strict Assignment Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    sessionStorage.setItem('tab_auth_granted', '1')
  })

  it('should create client profile but NOT assign any programs for a new user', async () => {
    const mockUser = { 
      uid: 'athlete-1', 
      email: 'pro@athlete.com',
      displayName: 'Pro Athlete'
    }

    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })

    vi.mocked(getDoc).mockImplementation(async (docRef: any) => {
      return { exists: () => false } as any
    })

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    )

    // 1. Verify Client Profile Creation
    await waitFor(() => {
      expect(vi.mocked(setDoc)).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'athlete-1', coll: 'clients' }),
        expect.objectContaining({
          name: 'Pro Athlete',
          email: 'pro@athlete.com',
          is_active: true
        })
      )
    })

    // 2. Verify NO Default Program Assignment
    // We explicitly expect addDoc NOT to be called for assignments
    expect(vi.mocked(addDoc)).not.toHaveBeenCalled()
  })
})

