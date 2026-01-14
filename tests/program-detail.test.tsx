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
    // We need to return different data depending on the query
    // But for this test, we can just return a day if it's the days query
    // and a workout if it's the workouts query.
    // To keep it simple, we'll check the mock call count.
    
    // First call is usually the days query
    cb({
      docs: [
        { id: 'day1', data: () => ({ name: 'Day One', orderIndex: 0 }) }
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
    expect(screen.getAllByText('Day One').length).toBeGreaterThan(0)
    expect(screen.getByText('Add Day')).toBeDefined()
  })

  it('shows reorder buttons for workouts', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    // We expect to find Up/Down arrow buttons (Chevrons)
    const buttons = screen.getAllByRole('button')
    const hasUp = buttons.some(b => b.innerHTML.includes('lucide-chevron-up'))
    const hasDown = buttons.some(b => b.innerHTML.includes('lucide-chevron-down'))
    
    expect(hasUp).toBe(true)
    expect(hasDown).toBe(true)
  })

  it('shows add workout button for each day', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    expect(screen.getByText('Add Workout')).toBeDefined()
  })
})
