import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EditEquipmentDialog } from '@/components/EditEquipmentDialog'
import { updateDoc, doc } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, coll, id) => ({ id })),
  updateDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => 'timestamp')
}))

describe('EditEquipmentDialog', () => {
  it('submits the form with updated equipment name', async () => {
    const equipment = { id: 'eq-1', name: 'Old Name' }
    const onOpenChange = vi.fn()
    
    render(<EditEquipmentDialog equipment={equipment} open={true} onOpenChange={onOpenChange} />)
    
    // Fill form
    const input = screen.getByLabelText(/Equipment Name/i)
    fireEvent.change(input, { target: { value: 'New Name' } })
    
    // Submit
    const submitBtn = screen.getByText('Save Changes', { selector: 'button[type="submit"]' })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        name: 'New Name'
      }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
