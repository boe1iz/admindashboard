import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CreateProgramDialog } from '@/components/CreateProgramDialog'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-id' })),
  serverTimestamp: vi.fn(),
}))

describe('CreateProgramDialog', () => {
  it('renders the dialog trigger', () => {
    render(<CreateProgramDialog />)
    expect(screen.getByText('New Program')).toBeDefined()
  })

  it('opens the dialog when clicked', () => {
    render(<CreateProgramDialog />)
    fireEvent.click(screen.getByText('New Program'))
    expect(screen.getByRole('heading', { name: 'Create Program' })).toBeDefined()
    expect(screen.getByLabelText(/Program Name/i)).toBeDefined()
  })
})
