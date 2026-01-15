import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorkoutCard } from '@/app/programs/[id]/page'

vi.mock('@/lib/firebase', () => ({
  db: {}
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  orderBy: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
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

describe('WorkoutCard Equipment Rendering', () => {
  const mockWorkout = {
    id: 'w1',
    title: 'Bench Press',
    instructions: '3x10',
    equipment_ids: ['eq1', 'eq2']
  }

  it('displays equipment names as tags when present', () => {
    render(
      <WorkoutCard 
        workout={mockWorkout as any} 
        programId="p1" 
        dayId="d1" 
        isFirst={true} 
        isLast={true} 
        onMove={() => {}} 
      />
    )
    
    expect(screen.getByText('Dumbbells')).toBeDefined()
    expect(screen.getByText('Barbell')).toBeDefined()
  })
})