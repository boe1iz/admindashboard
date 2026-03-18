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

describe('Default Program Assignment Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    sessionStorage.setItem('tab_auth_granted', '1')
  })

  it('should create client profile AND assign default programs for a new user', async () => {
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

    // 2. Verify Default Program Assignment
    await waitFor(() => {
      expect(vi.mocked(addDoc)).toHaveBeenCalledWith(
        expect.objectContaining({ coll: 'assignments' }),
        expect.objectContaining({
          client_id: 'athlete-1',
          program_id: 'starter-program',
          program_name: 'Elite Performance Starter',
          current_day_number: 1
        })
      )
    })

    // 3. Verify Activity Logging
    const { logActivity } = await import('@/lib/activity')
    expect(logActivity).toHaveBeenCalledWith({
      type: 'assignment',
      client_name: 'Pro Athlete',
      program_name: 'Elite Performance Starter'
    })
  })

  it('should NOT assign programs if client profile already exists', async () => {
    const mockUser = { uid: 'existing-athlete-1', email: 'old@athlete.com' }

    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any)
      return () => {}
    })

    vi.mocked(getDoc).mockImplementation(async (docRef: any) => {
      // Simulate existing client doc
      if (docRef.coll === 'clients') return { exists: () => true } as any
      return { exists: () => false } as any
    })

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    )

    await waitFor(() => {
      // Should check if it exists
      expect(vi.mocked(getDoc)).toHaveBeenCalled()
    })

    // Should NOT create or assign
    expect(vi.mocked(setDoc)).not.toHaveBeenCalled()
    expect(vi.mocked(addDoc)).not.toHaveBeenCalled()
  })
})

