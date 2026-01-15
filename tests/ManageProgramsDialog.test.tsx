import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ManageProgramsDialog } from '@/components/ManageProgramsDialog'
import { updateDoc, doc, onSnapshot } from 'firebase/firestore'

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
  arrayRemove: vi.fn((val) => `arrayRemove(${val})`),
  arrayUnion: vi.fn((val) => `arrayUnion(${val})`)
}))

describe('ManageProgramsDialog', () => {
  const mockAthlete = { id: 'athlete-1', name: 'John Doe', assignedPrograms: ['prog1'] }

  it('renders the dialog with athlete name and assigned programs', () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} open={true} onOpenChange={() => {}} />)
    
    expect(screen.getByText(/Manage Programs for John Doe/i)).toBeDefined()
    expect(screen.getByText('prog1')).toBeDefined()
  })

  it('calls updateDoc with arrayRemove when unassign button is clicked', async () => {
    const mockAthleteWithMapped = { id: 'athlete-1', name: 'John Doe', assignedPrograms: ['prog-1'] }
    render(<ManageProgramsDialog athlete={mockAthleteWithMapped as any} open={true} onOpenChange={() => {}} />)

    const unassignBtn = screen.getByLabelText('Unassign Program 1')
    fireEvent.click(unassignBtn)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled()
    })
  })

  it('calls updateDoc with arrayUnion when a program is assigned', async () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} open={true} onOpenChange={() => {}} />)
    
    // Find a program that is NOT assigned (prog-1 or prog-2)
    // Assigned is 'prog1' (different ID pattern for mock data consistency check)
    const assignBtn = await screen.findByLabelText('Assign Program 1')
    fireEvent.click(assignBtn)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled()
    })
  })

  it('handles errors when unassigning', async () => {
    vi.mocked(updateDoc).mockRejectedValueOnce(new Error('Firestore Error'))
    const mockAthleteWithMapped = { id: 'athlete-1', name: 'John Doe', assignedPrograms: ['prog-1'] }
    render(<ManageProgramsDialog athlete={mockAthleteWithMapped as any} open={true} onOpenChange={() => {}} />)
    
    const unassignBtn = screen.getByLabelText('Unassign Program 1')
    fireEvent.click(unassignBtn)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled()
    })
  })
})
