import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProgramDetailPage from '@/app/programs/[id]/page'
import React from 'react'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
}))

// Mock firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    // Return a mock day with 2 workouts
    cb({
      docs: [
        { id: 'day1', data: () => ({ title: 'Day One', day_number: 1 }) }
      ]
    })
    return () => {}
  }),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({
    exists: () => true,
    id: 'test-program-id',
    data: () => ({ name: 'Test Program' })
  })),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ size: 0 })),
  updateDoc: vi.fn()
}))

// Mock useEquipment hook
vi.mock('@/hooks/useEquipment', () => ({
  useEquipment: () => ({ equipment: [], loading: false })
}))

describe('Collapsible Training Days', () => {
  const params = Promise.resolve({ id: 'test-program-id' })

  it('should be collapsed by default', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    
    await waitFor(() => expect(screen.queryByText('Synchronizing Data...')).toBeNull(), { timeout: 2000 })
    
    // Check if the Day title is present to ensure loading is complete
    expect(screen.getByText('Day One')).toBeDefined()
    
    // Check if workout count summary is visible
    expect(screen.getByText(/1 Workout/i)).toBeDefined()
    
    const toggleButton = screen.getByRole('button', { name: /Expand day/i })
    expect(toggleButton).not.toBeNull()

    // Expand the day
    await act(async () => {
      fireEvent.click(toggleButton)
    })

    // Now CardContent should be visible. We check for "No workouts added yet" 
    // or the workout list. Since our mock returns 1 doc, it should show 1 WorkoutCard.
    // However, WorkoutCard needs 'workout' data. Our mock doc is just {title, day_number}.
    // It should render "Day One" as the workout title in the Card.
    expect(screen.getAllByText('Day One').length).toBeGreaterThan(1) // Header + Card
  })

  it('should handle global expand/collapse', async () => {
    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })
    
    await waitFor(() => expect(screen.queryByText('Synchronizing Data...')).toBeNull(), { timeout: 2000 })

    const expandAllBtn = screen.getByRole('button', { name: /Expand All/i })
    const collapseAllBtn = screen.getByRole('button', { name: /Collapse All/i })

    // Global Expand
    await act(async () => {
      fireEvent.click(expandAllBtn)
    })
    
    // Check if the content is visible (more than one "Day One" text)
    expect(screen.getAllByText('Day One').length).toBeGreaterThan(1)

    // Global Collapse
    await act(async () => {
      fireEvent.click(collapseAllBtn)
    })
    
    // Check if the content is hidden (only one "Day One" text in the header)
    // We wait for the animation to finish or at least for the state to update
    await waitFor(() => {
      expect(screen.getAllByText('Day One').length).toBe(1)
    })
  })
})
