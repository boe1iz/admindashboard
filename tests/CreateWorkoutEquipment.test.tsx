import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CreateWorkoutDialog } from '../components/CreateWorkoutDialog'
import { addDoc } from 'firebase/firestore'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-workout-id' })),
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

// Mock MultiSelectCombobox to simplify testing
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

describe('CreateWorkoutDialog Equipment Integration', () => {
  it('submits the form with selected equipment', async () => {
    render(<CreateWorkoutDialog programId="p1" dayId="d1" nextOrderIndex={0} />)
    
    const trigger = screen.getByRole('button', { name: /Add Workout/i })
    fireEvent.click(trigger)
    
    const titleInput = screen.getByPlaceholderText(/e\.g\. Bench Press/i)
    fireEvent.change(titleInput, { target: { value: 'Strength Session' } })
    
    const select = screen.getByTestId('multi-select')
    fireEvent.change(select, { target: { value: 'eq1' } })
    
    // We need to trigger the form submit directly if the button is hard to find or click in JSDOM dialog
    const form = screen.getByRole('dialog').querySelector('form')
    if (form) fireEvent.submit(form)
    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          title: 'Strength Session',
          equipment_ids: ['eq1']
        })
      )
    })
  })
})
