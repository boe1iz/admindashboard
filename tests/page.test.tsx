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
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    // If it's the assignments query (we check by observing mock setup if needed)
    // For now, return different data based on common query patterns
    
    const docs = Array(10).fill({
      data: () => ({ 
        isArchived: false,
        client_name: 'Test Athlete',
        program_name: 'Test Program',
        assigned_at: { seconds: Date.now() / 1000 }
      })
    })
    cb({
      size: 10,
      docs: docs
    })
    return () => {}
  }),
}))

it('Dashboard page renders Command Center, stats and activity', async () => {
  render(<Page />)
  expect(screen.getByText('Command Center')).toBeDefined()
  
  // Wait for mock data to "load" and animation to complete
  await waitFor(() => {
    expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Test Athlete/i).length).toBeGreaterThan(0)
  }, { timeout: 3000 })

  expect(screen.getByText(/Live Connection: Active/i)).toBeDefined()
})

it('Quick Actions navigate correctly', () => {
  render(<Page />)
  const buildBtn = screen.getByRole('link', { name: /Build Concept/i })
  expect(buildBtn.getAttribute('href')).toBe('/programs')

  const manageGearBtn = screen.getByRole('link', { name: /Manage Gear/i })
  expect(manageGearBtn.getAttribute('href')).toBe('/inventory')
})
