import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import InventoryPage from '../app/inventory/page'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
}))

// Mock firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    cb({
      docs: []
    })
    return () => {}
  }),
}))

describe('Inventory Page', () => {
  it('renders the inventory page header', () => {
    render(<InventoryPage />)
    expect(screen.getByText('Equipment Inventory')).toBeDefined()
    expect(screen.getByText('Operational')).toBeDefined()
    expect(screen.getByText('Vault')).toBeDefined()
  })
})
