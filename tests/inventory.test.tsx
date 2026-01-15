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
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    cb({
      docs: [
        { id: '1', data: () => ({ name: 'Dumbbell', is_active: true, createdAt: { seconds: 0 } }) },
        { id: '2', data: () => ({ name: 'Bands', is_active: true, createdAt: { seconds: 0 } }) },
        { id: '3', data: () => ({ name: 'Archived Gear', is_active: false, createdAt: { seconds: 0 } }) },
      ]
    })
    return () => {}
  }),
}))

describe('Inventory Page', () => {
  it('renders the inventory page header and item counts', () => {
    render(<InventoryPage />)
    expect(screen.getByText('Equipment Inventory')).toBeDefined()
    expect(screen.getByText(/Operational \(2\)/)).toBeDefined()
    expect(screen.getByText(/Vault \(1\)/)).toBeDefined()
  })

  it('renders active items in the operational tab', () => {
    render(<InventoryPage />)
    expect(screen.getByText('Dumbbell')).toBeDefined()
    expect(screen.getByText('Bands')).toBeDefined()
    // It should NOT render the archived gear in the operational tab
    expect(screen.queryByText('Archived Gear')).toBeNull()
  })

  it('filters items based on search query', async () => {
    const { fireEvent } = await import('@testing-library/react')
    render(<InventoryPage />)
    
    const searchInput = screen.getByPlaceholderText('Search gear...')
    fireEvent.change(searchInput, { target: { value: 'Dumbbell' } })
    
    expect(screen.getByText('Dumbbell')).toBeDefined()
    expect(screen.queryByText('Bands')).toBeNull()
  })
})
