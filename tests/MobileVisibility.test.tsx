import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProgramsPage from '@/app/programs/page'
import React from 'react'
import { useAuth } from '@/components/AuthProvider'

// Mock useAuth
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { type: 'firestore' },
  auth: { currentUser: { uid: 'client-123' } }
}))

// Mock firestore
const mockOnSnapshot = vi.fn()
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, path) => ({ path })),
  query: vi.fn((q, ...constraints) => ({ q, constraints })),
  where: vi.fn((field, op, val) => ({ field, op, val })),
  onSnapshot: (q, onNext, onError) => mockOnSnapshot(q, onNext, onError),
  getFirestore: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  getDocs: vi.fn(),
}))

describe('Mobile Visibility Reproduction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders assigned programs for a client', async () => {
    // 1. Mock user as a client
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' },
      isAdmin: false,
      isClient: true,
      loading: false,
      refreshAuth: vi.fn(),
    })

    // 2. Setup snapshot behavior
    // First call is for 'programs', second is for 'assignments'
    mockOnSnapshot.mockImplementation((q, cb) => {
      if (q.q && q.q.path === 'programs') {
        cb({
          docs: [
            { id: 'prog-1', data: () => ({ name: 'Assigned Program', isArchived: false, description: 'Desc' }) }
          ]
        })
      } else if (q.q && q.q.path === 'assignments') {
        cb({
          docs: [
            { id: 'assign-1', data: () => ({ client_id: 'client-123', program_id: 'prog-1' }) }
          ]
        })
      }
      return () => {}
    })

    render(<ProgramsPage />)

    // Wait for sync
    await waitFor(() => {
      expect(screen.queryByText(/Synchronizing/i)).toBeNull()
    })

    // Assert program is visible
    expect(screen.getByText('Assigned Program')).toBeDefined()
  })

  it('fails to render if assignment uses clientId instead of client_id (Reproduction of inconsistency)', async () => {
    // 1. Mock user as a client
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' },
      isAdmin: false,
      isClient: true,
      loading: false,
      refreshAuth: vi.fn(),
    })

    // 2. Setup snapshot behavior with camelCase 'clientId'
    mockOnSnapshot.mockImplementation((q, cb) => {
      if (q.q && q.q.path === 'programs') {
        cb({
          docs: [
            { id: 'prog-1', data: () => ({ name: 'Hidden Program', isArchived: false, description: 'Desc' }) }
          ]
        })
      } else if (q.q && q.q.path === 'assignments') {
        // Here we simulate an assignment that might exist in DB but doesn't match the snake_case interface
        cb({
          docs: [
            { id: 'assign-1', data: () => ({ clientId: 'client-123', programId: 'prog-1' }) }
          ]
        })
      }
      return () => {}
    })

    render(<ProgramsPage />)

    await waitFor(() => {
      expect(screen.queryByText(/Synchronizing/i)).toBeNull()
    })

    // Assert program is visible
    expect(screen.getByText('Hidden Program')).toBeDefined()
  })

  it('shows "No Programs Found" if assignment query fails (Reproduction of Rules issue)', async () => {
    // 1. Mock user as a client
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' },
      isAdmin: false,
      isClient: true,
      loading: false,
      refreshAuth: vi.fn(),
    })

    // 2. Setup snapshot behavior with error
    mockOnSnapshot.mockImplementation((q, cb, errCb) => {
      if (q.q && q.q.path === 'programs') {
        cb({
          docs: [
            { id: 'prog-1', data: () => ({ name: 'Assigned Program', isArchived: false, description: 'Desc' }) }
          ]
        })
      } else if (q.q && q.q.path === 'assignments') {
        // Simulate a Firebase Permission Denied error (Rules)
        if (errCb) errCb(new Error('Permission Denied'))
      }
      return () => {}
    })

    render(<ProgramsPage />)

    await waitFor(() => {
      expect(screen.queryByText(/Synchronizing/i)).toBeNull()
    })

    // Should NOT show the program
    expect(screen.queryByText('Assigned Program')).toBeNull()
    // Should show the "No Programs" card
    expect(screen.getByText(/No assigned programs available/i)).toBeDefined()
  })
})
