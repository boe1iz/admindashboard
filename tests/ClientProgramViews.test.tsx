import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProgramsPage from '../app/programs/page'
import ProgramDetailPage from '../app/programs/[id]/page'
import React, { Suspense } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { db } from '@/lib/firebase'
import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore'

// Mock Auth
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  doc: vi.fn(),
  getDoc: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
  serverTimestamp: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}))

// Mock hooks
vi.mock('@/hooks/useEquipment', () => ({
  useEquipment: () => ({ equipment: [], loading: false }),
}))

describe('Client Program & Workout Views', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides "Create Program" button for clients on Programs page', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' } as any,
      isAdmin: false,
      isClient: true,
      loading: false,
      refreshAuth: vi.fn(),
    })

    // Mock empty programs list
    vi.mocked(onSnapshot).mockImplementation((q: any, cb: any) => {
      cb({ docs: [] })
      return () => {}
    })

    render(<ProgramsPage />)

    await waitFor(() => {
      expect(screen.queryByText(/Create Program/i)).toBeNull()
      expect(screen.queryByText(/Add Program/i)).toBeNull()
    })
  })

  it('hides edit/add actions for clients on Program Detail page', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' } as any,
      isAdmin: false,
      isClient: true,
      loading: false,
      refreshAuth: vi.fn(),
    })

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: 'prog-123',
      data: () => ({ name: 'Test Program' })
    } as any)

    // Mock empty days list
    vi.mocked(onSnapshot).mockImplementation((q: any, cb: any) => {
      // If query involves 'days' subcollection
      cb({ docs: [] })
      return () => {}
    })

    render(
      <Suspense fallback={<div data-testid="loading">Loading...</div>}>
        <ProgramDetailPage params={Promise.resolve({ id: 'prog-123' })} />
      </Suspense>
    )

    // Wait for the program title to appear
    await waitFor(() => {
      expect(screen.getByText('Test Program')).toBeDefined()
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(screen.queryByText(/Add Day/i)).toBeNull()
      expect(screen.queryByText(/Create Workout/i)).toBeNull()
    })
  })
})
