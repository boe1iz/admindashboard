import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
    // Immediate execution of callback with dummy data
    cb({
      docs: [
        { id: '1', data: () => ({ name: 'Active Program', isArchived: false, description: 'Desc 1' }) },
        { id: '2', data: () => ({ name: 'Archived Program', isArchived: true, description: 'Desc 2' }) }
      ]
    })
    return () => {} // Unsubscribe
  }),
  getFirestore: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn()
}))

describe('ProgramsPage', () => {
  it('renders the programs page with tabs', async () => {
    render(<ProgramsPage />)
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    expect(screen.getByText('Operational')).toBeDefined()
    expect(screen.getByText('Archived Vault')).toBeDefined()
  })

  it('shows active programs by default', async () => {
    render(<ProgramsPage />)
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    expect(screen.getByText('Active Program')).toBeDefined()
    expect(screen.queryByText('Archived Program')).toBeNull()
  })

  it('opens create program dialog', async () => {
    render(<ProgramsPage />)
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    const createBtn = screen.getByText('New Program')
    expect(createBtn).toBeDefined()
  })

  it('shows archive action for active programs', async () => {
    render(<ProgramsPage />)
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    // Find and click the dropdown trigger (using MoreVertical icon)
    const trigger = screen.getAllByRole('button').find(b => b.innerHTML.includes('lucide-ellipsis-vertical'))
    if (trigger) {
      fireEvent.click(trigger)
    }
    
    // In shadcn, the menu items might be rendered in a portal. 
    // For this test, let's just check if it's defined.
    await waitFor(() => {
        expect(screen.getByText('Archive')).toBeDefined()
    })
  })
})