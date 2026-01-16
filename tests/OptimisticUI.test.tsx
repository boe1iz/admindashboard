import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ClientCard } from '@/app/clients/page'
import { ManageClientProgramsDialog } from '@/components/ManageClientProgramsDialog'

vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(() => new Promise(() => {})), // Never resolves to simulate pending
  addDoc: vi.fn(() => new Promise(() => {})),
  deleteDoc: vi.fn(() => new Promise(() => {})),
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
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

describe('Optimistic UI / Pending States', () => {
  const mockClient = { id: '1', name: 'Test', email: 't@t.com', is_active: true }
  
  it('ClientCard shows pending state during archive', async () => {
    const { container } = render(<ClientCard client={mockClient} programs={[]} assignments={[]} />)
    
    const archiveBtn = screen.getByText('Archive')
    fireEvent.click(archiveBtn)
    
    // The card is inside a motion.div
    const card = container.querySelector('.transition-all')
    expect(card?.className).toContain('opacity-50')
  })

  it('ManageClientProgramsDialog disables buttons during assignment', async () => {
    const mockPrograms = [{ id: 'p1', name: 'Prog 1', isArchived: false }]
    render(<ManageClientProgramsDialog client={mockClient} programs={mockPrograms as any} assignments={[]} open={true} onOpenChange={() => {}} />)
    
    const assignButton = screen.getAllByRole('button', { name: /Assign/i })[0]
    fireEvent.click(assignButton)
    
    // Check if the input or buttons become disabled during processing
    const input = screen.getByPlaceholderText(/Search programs.../i)
    expect(input.hasAttribute('disabled')).toBe(true)
  })
})
