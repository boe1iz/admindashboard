import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ManageClientProgramsDialog } from '@/components/ManageClientProgramsDialog'
import { updateDoc, doc, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    cb({
      docs: [
        { id: 'prog-1', data: () => ({ name: 'Program 1', isArchived: false }) },
        { id: 'prog-2', data: () => ({ name: 'Program 2', isArchived: false }) }
      ]
    })
    return () => {}
  }),
  doc: vi.fn((db, coll, id) => ({ id })),
  updateDoc: vi.fn(() => Promise.resolve()),
  addDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => 'timestamp'),
  where: vi.fn()
}))

describe('ManageClientProgramsDialog', () => {
  const mockClient = { id: 'client-1', name: 'John Doe', is_active: true }
  const mockPrograms = [
    { id: 'prog-1', name: 'Program 1', isArchived: false },
    { id: 'prog-2', name: 'Program 2', isArchived: false }
  ]
  const mockAssignments = [
    { id: 'asgn-1', client_id: 'client-1', program_id: 'prog-1' }
  ]

  it('renders the dialog with client name and assigned programs', () => {
    render(<ManageClientProgramsDialog client={mockClient as any} programs={mockPrograms as any} assignments={mockAssignments as any} open={true} onOpenChange={() => {}} />)
    
    expect(screen.getByText(/Manage Programs/i)).toBeDefined()
    expect(screen.getByText('Program 1')).toBeDefined()
  })

  it('calls deleteDoc when unassign button is clicked', async () => {
    render(<ManageClientProgramsDialog client={mockClient as any} programs={mockPrograms as any} assignments={mockAssignments as any} open={true} onOpenChange={() => {}} />)
    
    const unassignBtn = screen.getByLabelText('Unassign Program 1')
    fireEvent.click(unassignBtn)
    
    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled()
    })
  })

  it('calls addDoc when a program is assigned', async () => {
    render(<ManageClientProgramsDialog client={mockClient as any} programs={mockPrograms as any} assignments={mockAssignments as any} open={true} onOpenChange={() => {}} />)
    
    // Find a program that is NOT assigned (Program 2)
    const assignBtn = await screen.findByLabelText('Assign Program 2')
    fireEvent.click(assignBtn)
    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled()
    })
  })
})