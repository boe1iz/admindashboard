import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelectCombobox } from '../components/ui/multi-select-combobox'

const options = [
  { label: 'Dumbbells', value: '1' },
  { label: 'Barbell', value: '2' },
  { label: 'Bench', value: '3' },
]

describe('MultiSelectCombobox', () => {
  it('allows selecting multiple options', async () => {
    const onChange = vi.fn()
    render(<MultiSelectCombobox options={options} selected={[]} onChange={onChange} placeholder="Select gear..." />)
    
    const trigger = screen.getByText('Select gear...')
    fireEvent.click(trigger)
    
    const dumbbells = screen.getByText('Dumbbells')
    fireEvent.click(dumbbells)
    
    expect(onChange).toHaveBeenCalledWith(['1'])
  })

  it('filters options based on search input', async () => {
    render(<MultiSelectCombobox options={options} selected={[]} onChange={() => {}} placeholder="Select gear..." />)
    
    const trigger = screen.getByText('Select gear...')
    fireEvent.click(trigger)
    
    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'Bar' } })
    
    expect(screen.queryByText('Dumbbells')).toBeNull()
    expect(screen.getByText('Barbell')).toBeDefined()
  })
})
