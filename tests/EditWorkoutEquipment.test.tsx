import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EditWorkoutDialog } from '../components/EditWorkoutDialog'
import { updateDoc } from 'firebase/firestore'

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(),
}))

vi.mock('../lib/firebase', () => ({
  db: {}
}))

vi.mock('../hooks/useEquipment', () => ({
  useEquipment: () => ({
    equipment: [
      { label: 'Dumbbells', value: 'eq1' },
      { label: 'Barbell', value: 'eq2' },
    ],
    loading: false
  })
}))

// Mock MultiSelectCombobox
vi.mock('../components/ui/multi-select-combobox', () => ({
  MultiSelectCombobox: ({ onChange, selected }: any) => (
    <select 
      multiple 
      value={selected} 
      onChange={(e) => {
        const values = Array.from(e.target.selectedOptions, (option: any) => option.value)
        onChange(values)
      }}
      data-testid="multi-select"
    >
      <option value="eq1">Dumbbells</option>
      <option value="eq2">Barbell</option>
    </select>
  )
}))

describe('EditWorkoutDialog Equipment Integration', () => {
  const mockWorkout = {
    id: 'w1',
    title: 'Bench Press',
    instructions: '3x10',
    equipment_ids: ['eq2'] // Existing assignment
  }

  it('loads existing equipment and submits updates', async () => {
    render(
      <EditWorkoutDialog 
        programId="p1" 
        dayId="d1" 
        workout={mockWorkout as any} 
        open={true} 
        onOpenChange={() => {}} 
      />
    )
    
    const select = screen.getByTestId('multi-select') as HTMLSelectElement
    expect(select.value).toBe('eq2')
    
    // Update selection
    fireEvent.change(select, { target: { value: 'eq1' } })
    
    const form = screen.getByRole('dialog').querySelector('form')
    if (form) fireEvent.submit(form)
    
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          equipment_ids: ['eq1']
        })
      )
    })
  })
})
