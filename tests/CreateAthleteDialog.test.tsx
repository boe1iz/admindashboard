import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CreateAthleteDialog } from '@/components/CreateAthleteDialog'
import { addDoc, collection } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' }
}))

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-id' })),
  serverTimestamp: vi.fn(() => 'timestamp')
}))

describe('CreateAthleteDialog', () => {
  it('submits the form with athlete details', async () => {
    render(<CreateAthleteDialog />)
    
    // Open dialog
    const openBtn = screen.getByText('Onboard Athlete')
    fireEvent.click(openBtn)
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@doe.com' } })
    
    // Submit
    const submitBtn = screen.getByText('Onboard Athlete', { selector: 'button[type="submit"]' })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled()
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'clients')
    })
  })
})