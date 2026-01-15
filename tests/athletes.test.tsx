import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AthletesPage from '@/app/athletes/page'
// @ts-ignore - Internal component test
import { AthleteCard } from '@/app/athletes/page'
import { updateDoc, doc, onSnapshot } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' },
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
        { id: '1', data: () => ({ name: 'Active Athlete', email: 'active@test.com', is_active: true }) }
      ]
    })
    return () => {} // Unsubscribe
  }),
  getFirestore: vi.fn(),
  doc: vi.fn((db, coll, id) => ({ id })),
  updateDoc: vi.fn(() => Promise.resolve()),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn()
}))

// Mock Radix DropdownMenu to render content inline
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

describe('AthleteCard', () => {
  it('renders athlete info and toggles archive', async () => {
    const athlete = { id: '1', name: 'Test Athlete', email: 'test@test.com', is_active: true }
    const programs = [{ id: 'prog1', name: 'Program Name' }]
    const assignments = [{ id: 'a1', athlete_id: '1', program_id: 'prog1' }]
    
    render(<AthleteCard athlete={athlete} programs={programs} assignments={assignments as any} />)
    
    expect(screen.getByText('Test Athlete')).toBeDefined()
    expect(screen.getByText('test@test.com')).toBeDefined()
    expect(screen.getByText('Program Name')).toBeDefined()

    const archiveBtn = screen.getByText('Archive')
    fireEvent.click(archiveBtn)
    
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { is_active: false })
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'clients', '1')
  })

  it('toggles restore when already archived', async () => {
    const athlete = { id: '2', name: 'Archived Athlete', email: 'archived@test.com', is_active: false }
    render(<AthleteCard athlete={athlete} programs={[]} assignments={[]} />)
    
    const restoreBtn = screen.getByText('Restore')
    fireEvent.click(restoreBtn)
    
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { is_active: true })
  })

  it('opens edit dialog when Edit Details is clicked', async () => {
    const athlete = { id: '1', name: 'Test', email: 'test@test.com', is_active: true }
    render(<AthleteCard athlete={athlete} programs={[]} assignments={[]} />)
    
    const editBtn = screen.getByText('Edit Details')
    fireEvent.click(editBtn)
    
    // Check if dialog title is present
    expect(screen.getByText(/Edit Athlete Details/i)).toBeDefined()
  })
})

describe('AthletesPage', () => {
  it('renders the athletes page with tabs', async () => {
    render(<AthletesPage />)
    await waitFor(() => expect(screen.queryByText('Loading Athletes...')).toBeNull())
    
    expect(screen.getByText('Operational')).toBeDefined()
    expect(screen.getByText('Archived Vault')).toBeDefined()
  })

  it('shows empty state when no athletes', async () => {
    // Mock empty snapshot
    vi.mocked(onSnapshot).mockImplementationOnce((q, cb: any) => {
      cb({ docs: [] })
      return () => {}
    })
    
    render(<AthletesPage />)
    await waitFor(() => expect(screen.queryByText('Loading Athletes...')).toBeNull())
    
    expect(screen.getByText('No Active Athletes')).toBeDefined()
  })
})
