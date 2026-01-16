import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import Dashboard from '../app/page'

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
    cb({ docs: [] })
    return () => {}
  }),
}))

describe('Responsive Dashboard', () => {
  it('renders the dashboard (placeholder for actual responsive tests)', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Command Center/i)).toBeDefined()
  })
})
