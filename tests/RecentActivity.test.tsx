import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from '../app/page'
import React from 'react'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { type: 'firestore' },
}))

// Mock firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, path) => ({ path })),
  query: vi.fn((q) => q),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    if (q.path === 'activity') {
      cb({
        docs: [
          { 
            id: 'log1', 
            data: () => ({
              type: 'assignment',
              client_name: 'Athlete One', 
              program_name: 'Strength Power', 
              timestamp: { seconds: Math.floor(Date.now() / 1000) - 30 } 
            }) 
          },
          { 
            id: 'log2', 
            data: () => ({
              type: 'unassigned',
              client_name: 'Athlete One', 
              program_name: 'Old Program', 
              timestamp: { seconds: Math.floor(Date.now() / 1000) - 3600 } 
            }) 
          }
        ]
      })
    } else {
      cb({ docs: [] })
    }
    return () => {}
  }),
}))

describe('Recent Activity Feed Logic', () => {
  it('displays items from the activity collection with icons and relative time', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      const elements = screen.getAllByText('Athlete One')
      expect(elements.length).toBeGreaterThan(0)
      expect(screen.getByText(/was assigned to Strength Power/i)).toBeDefined()
      expect(screen.getByText(/was unassigned from Old Program/i)).toBeDefined()
      expect(screen.getAllByText(/Just now/i).length).toBeGreaterThan(0)
    })
  })
})
