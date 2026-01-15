import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AthleteCard } from '@/app/athletes/page'
import { ManageProgramsDialog } from '@/components/ManageProgramsDialog'

vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(() => new Promise(() => {})), // Never resolves to simulate pending
  arrayRemove: vi.fn(),
  arrayUnion: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn(() => () => {})
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

describe('Optimistic UI / Pending States', () => {
  const mockAthlete = { id: '1', name: 'Test', email: 't@t.com', isArchived: false, assignedPrograms: [] }
  
  it('AthleteCard shows pending state during archive', async () => {
    const { container } = render(<AthleteCard athlete={mockAthlete} programs={[]} />)
    
    const archiveBtn = screen.getByText('Archive')
    fireEvent.click(archiveBtn)
    
    const card = container.querySelector('.bg-card')
    expect(card?.className).toContain('opacity-50')
  })

  it('ManageProgramsDialog disables buttons during assignment', async () => {
    render(<ManageProgramsDialog athlete={mockAthlete} open={true} onOpenChange={() => {}} />)
    
    // This requires implementing a loading state in the dialog
    // ...
  })
})
