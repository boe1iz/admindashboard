import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useEquipment } from '../hooks/useEquipment'
import { collection, onSnapshot } from 'firebase/firestore'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    cb({
      docs: [
        { id: '1', data: () => ({ name: 'Dumbbells', is_active: true }) },
        { id: '2', data: () => ({ name: 'Barbell', is_active: true }) },
      ]
    })
    return () => {}
  }),
  getFirestore: vi.fn(),
}))

vi.mock('../lib/firebase', () => ({
  db: {}
}))

describe('useEquipment', () => {
  it('fetches and returns active equipment', async () => {
    const { result } = renderHook(() => useEquipment())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.equipment).toHaveLength(2)
    expect(result.current.equipment[0]).toEqual({ label: 'Dumbbells', value: '1' })
  })
})
