import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProgramsPage from '@/app/programs/page'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-user' } }
}))

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    // Return some dummy data
    cb({
      docs: [
        { id: '1', data: () => ({ name: 'Active Program', isArchived: false, description: 'Desc 1' }) },
        { id: '2', data: () => ({ name: 'Archived Program', isArchived: true, description: 'Desc 2' }) }
      ]
    })
    return () => {} // Unsubscribe
  }),
  getFirestore: vi.fn()
}))

describe('ProgramsPage', () => {
  it('renders the programs page with tabs', async () => {
    render(<ProgramsPage />)
    
    expect(screen.getByText('Operational')).toBeDefined()
    expect(screen.getByText('Archived Vault')).toBeDefined()
  })

  it('shows active programs by default', async () => {
    render(<ProgramsPage />)
    
    expect(screen.getByText('Active Program')).toBeDefined()
    expect(screen.queryByText('Archived Program')).toBeNull()
  })
})
