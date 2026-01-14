import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Page from '../app/page'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
}))

// Mock firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    // Return 10 docs, all active
    const docs = Array(10).fill({
      data: () => ({ isArchived: false })
    })
    cb({
      size: 10,
      docs: docs
    })
    return () => {}
  }),
}))

test('Dashboard page renders Command Center and stats', async () => {
  render(<Page />)
  expect(screen.getByText('Command Center')).toBeDefined()
  
  // Wait for mock data to "load"
  await waitFor(() => {
    const values = screen.getAllByText('10')
    expect(values.length).toBeGreaterThan(0)
  })

  expect(screen.getByText(/Live Connection: Active/i)).toBeDefined()
})
