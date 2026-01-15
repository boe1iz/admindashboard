import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import InventoryPage from '../app/inventory/page'
import { updateDoc, doc } from 'firebase/firestore'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: { mock: 'db' },
}))

// Mock firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn((db, coll, id) => ({ id })),
  updateDoc: vi.fn(() => Promise.resolve()),
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

// Mock Radix DropdownMenu to render content inline
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

describe('Inventory Page', () => {
  it('renders the inventory page header', () => {
    render(<InventoryPage />)
    expect(screen.getByText('Equipment Inventory')).toBeDefined()
    expect(screen.getByRole('tab', { name: /Operational \(2\)/i })).toBeDefined()
    expect(screen.getByRole('tab', { name: /Archived Vault \(1\)/i })).toBeDefined()
  })

  it('renders active items in the operational tab', () => {
    render(<InventoryPage />)
    expect(screen.getByText('Dumbbell')).toBeDefined()
    expect(screen.getByText('Bands')).toBeDefined()
    // It should NOT render the archived gear in the operational tab
    expect(screen.queryByText('Archived Gear')).toBeNull()
  })

  it('calls updateDoc when archive item is clicked', async () => {
    render(<InventoryPage />)
    
    // Find all "Archive" buttons (one per card in the mock)
    const archiveBtns = screen.getAllByText('Archive')
    fireEvent.click(archiveBtns[0])
    
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { is_active: false })
  })
})
