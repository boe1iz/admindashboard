import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProgramDetailPage from '@/app/programs/[id]/page'
import React from 'react'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
}))

// Mock firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    // Return dummy data immediately
    cb({
      docs: [
        { id: 'day1', data: () => ({ name: 'Day 1', orderIndex: 0 }) }
      ]
    })
    return () => {}
  }),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({
    exists: () => true,
    id: 'test-program-id',
    data: () => ({ name: 'Test Program' })
  })),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ size: 0 })),
}))

describe('ProgramDetailPage', () => {
  const params = Promise.resolve({ id: 'test-program-id' })

  it('renders the program detail page with days', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    expect(screen.getByText('Test Program')).toBeDefined()
    expect(screen.getByText('Day 1')).toBeDefined()
    expect(screen.getByText('Add Day')).toBeDefined()
  })

  it('shows delete button for days', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    const deleteBtns = screen.getAllByRole('button').filter(b => b.innerHTML.includes('lucide-trash-2') || b.textContent?.includes('Delete Day 1'))
    expect(deleteBtns.length).toBeGreaterThan(0)
  })
})