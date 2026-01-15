import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ManageProgramsDialog } from '@/components/ManageProgramsDialog'
import { updateDoc, doc } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, coll, id) => ({ id })),
  updateDoc: vi.fn(() => Promise.resolve()),
  arrayRemove: vi.fn((val) => `arrayRemove(${val})`)
}))

describe('ManageProgramsDialog', () => {
  const mockAthlete = { id: 'athlete-1', name: 'John Doe', assignedPrograms: ['prog1'] }

  it('renders the dialog with athlete name and assigned programs', () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} open={true} onOpenChange={() => {}} />)
    
    expect(screen.getByText(/Manage Programs for John Doe/i)).toBeDefined()
    expect(screen.getByText('prog1')).toBeDefined()
  })

  it('calls updateDoc with arrayRemove when unassign button is clicked', async () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} open={true} onOpenChange={() => {}} />)
    
    // Find the X button for prog1
    const unassignBtn = screen.getByLabelText('Unassign prog1')
    fireEvent.click(unassignBtn)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled()
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'athletes', 'athlete-1')
    })
  })

  it('handles errors when unassigning', async () => {
    vi.mocked(updateDoc).mockRejectedValueOnce(new Error('Firestore Error'))
    render(<ManageProgramsDialog athlete={mockAthlete as any} open={true} onOpenChange={() => {}} />)
    
    const unassignBtn = screen.getByLabelText('Unassign prog1')
    fireEvent.click(unassignBtn)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled()
    })
  })
})
