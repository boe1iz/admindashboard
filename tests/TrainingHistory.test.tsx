import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WorkoutCard } from '../app/programs/[id]/page'
import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

// Mock Auth
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  doc: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}))

// Mock hooks
vi.mock('@/hooks/useEquipment', () => ({
  useEquipment: () => ({ equipment: [], loading: false }),
}))

describe('Training History & Completion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows clients to mark a workout as complete', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123', email: 'test@test.com' } as any,
      isAdmin: false,
      isClient: true,
      loading: false,
    } as any)

    const mockWorkout = {
      id: 'work-123',
      title: 'Heavy Bench',
      instructions: '5x5',
      order_index: 0
    }

    render(
      <WorkoutCard 
        workout={mockWorkout} 
        programId="prog-123" 
        dayId="day-123" 
        isFirst={true} 
        isLast={true} 
        onMove={() => {}} 
      />
    )

    const completeBtn = screen.getByLabelText(/Mark as complete/i)
    fireEvent.click(completeBtn)

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled()
      // We expect it to add to a 'history' collection or similar
    })
  })
})
