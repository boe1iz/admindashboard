import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CreateEquipmentDialog } from '@/components/CreateEquipmentDialog'
import { addDoc, collection } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, path) => ({ db, path })),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-id' })),
  serverTimestamp: vi.fn(() => 'timestamp')
}))

describe('CreateEquipmentDialog', () => {
  it('submits the form with equipment name', async () => {
    render(<CreateEquipmentDialog />)
    
    // Open dialog
    const openBtn = screen.getByText('Add Gear')
    fireEvent.click(openBtn)
    
    // Fill form
    const input = screen.getByLabelText(/Equipment Name/i)
    fireEvent.change(input, { target: { value: 'New Dumbbell' } })
    
    // Submit
    const submitBtn = screen.getByText('Add Equipment', { selector: 'button[type="submit"]' })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        name: 'New Dumbbell',
        is_active: true
      }))
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'equipment')
    })
  })
})
