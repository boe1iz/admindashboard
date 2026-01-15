import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ManageProgramsDialog } from '@/components/ManageProgramsDialog'
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

describe('ManageProgramsDialog', () => {
  const mockAthlete = { id: 'athlete-1', name: 'John Doe', is_active: true }
  const mockPrograms = [
    { id: 'prog-1', name: 'Program 1', isArchived: false },
    { id: 'prog-2', name: 'Program 2', isArchived: false }
  ]
  const mockAssignments = [
    { id: 'asgn-1', athlete_id: 'athlete-1', program_id: 'prog-1' }
  ]

  it('renders the dialog with athlete name and assigned programs', () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} programs={mockPrograms as any} assignments={mockAssignments as any} open={true} onOpenChange={() => {}} />)
    
    expect(screen.getByText(/Manage Programs for John Doe/i)).toBeDefined()
    expect(screen.getByText('Program 1')).toBeDefined()
  })

  it('calls deleteDoc when unassign button is clicked', async () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} programs={mockPrograms as any} assignments={mockAssignments as any} open={true} onOpenChange={() => {}} />)
    
    const unassignBtn = screen.getByLabelText('Unassign Program 1')
    fireEvent.click(unassignBtn)
    
    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled()
    })
  })

  it('calls addDoc when a program is assigned', async () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} programs={mockPrograms as any} assignments={mockAssignments as any} open={true} onOpenChange={() => {}} />)
    
    // Find a program that is NOT assigned (Program 2)
    const assignBtn = await screen.findByLabelText('Assign Program 2')
    fireEvent.click(assignBtn)
    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled()
    })
  })
})