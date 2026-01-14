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
    // If query includes 'workouts', return workout
    // If query includes 'days', return day
    // q.path is not available in mock, so we check mock calls or return both
    // Actually, onSnapshot is called for days first, then workouts.
    
    cb({
      docs: [
        { id: 'item1', data: () => ({ name: 'Day One', orderIndex: 0, videoUrl: 'https://youtube.com/watch?v=123' }) }
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

  it('renders the program detail page', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    expect(screen.getByText('Test Program')).toBeDefined()
  })

  it('shows reorder buttons for workouts', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    const buttons = screen.getAllByRole('button')
    const hasChevron = buttons.some(b => b.innerHTML.includes('lucide-chevron'))
    expect(hasChevron).toBe(true)
  })

  it('shows add workout button', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    expect(screen.getByText('Add Workout')).toBeDefined()
  })
})