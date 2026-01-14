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
    cb({
      docs: [
        { id: 'item1', data: () => ({ title: 'Day One', day_number: 1, instructions: 'Test Instructions', video_url: 'https://youtube.com/watch?v=123', order_index: 0 }) }
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
  updateDoc: vi.fn()
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