import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AthletesPage from '@/app/athletes/page'
// @ts-ignore - Internal component test
import { AthleteCard } from '@/app/athletes/page'
import { updateDoc, doc } from 'firebase/firestore'

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
        { id: '1', data: () => ({ name: 'Active Athlete', email: 'active@test.com', isArchived: false, assignedPrograms: [] }) }
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
    const athlete = { id: '1', name: 'Test Athlete', email: 'test@test.com', isArchived: false, assignedPrograms: ['prog1'] }
    render(<AthleteCard athlete={athlete} />)
    
    expect(screen.getByText('Test Athlete')).toBeDefined()
    expect(screen.getByText('test@test.com')).toBeDefined()
    expect(screen.getByText('prog1')).toBeDefined()

    const archiveBtn = screen.getByText('Archive')
    fireEvent.click(archiveBtn)
    
    expect(updateDoc).toHaveBeenCalled()
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'athletes', '1')
  })
})

describe('AthletesPage', () => {
  it('renders the athletes page with tabs', async () => {
    render(<AthletesPage />)
    await waitFor(() => expect(screen.queryByText('Loading Athletes...')).toBeNull())
    
    expect(screen.getByText('Operational')).toBeDefined()
    expect(screen.getByText('Archived Vault')).toBeDefined()
  })

  it('shows active athletes by default', async () => {
    render(<AthletesPage />)
    await waitFor(() => expect(screen.queryByText('Loading Athletes...')).toBeNull())
    
    expect(screen.getByText('Active Athlete')).toBeDefined()
    expect(screen.getByText('active@test.com')).toBeDefined()
  })
})
