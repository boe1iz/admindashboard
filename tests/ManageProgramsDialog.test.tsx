import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ManageProgramsDialog } from '@/components/ManageProgramsDialog'

describe('ManageProgramsDialog', () => {
  const mockAthlete = { id: '1', name: 'John Doe', assignedPrograms: ['prog1'] }

  it('renders the dialog with athlete name and assigned programs', () => {
    render(<ManageProgramsDialog athlete={mockAthlete as any} open={true} onOpenChange={() => {}} />)
    
    expect(screen.getByText(/Manage Programs for John Doe/i)).toBeDefined()
    expect(screen.getByText('prog1')).toBeDefined()
  })
})
