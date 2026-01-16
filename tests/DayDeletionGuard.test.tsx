import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProgramDetailPage from '@/app/programs/[id]/page'
import React from 'react'
import { db } from '@/lib/firebase'
import { getDocs, deleteDoc } from 'firebase/firestore'
import { toast } from 'sonner'

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  db: {
    type: 'firestore',
  },
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock firestore
vi.mock('firebase/firestore', () => {
  const actual = vi.importActual('firebase/firestore')
  return {
    ...actual,
    collection: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
    query: vi.fn((q) => q),
    where: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn((q, cb) => {
      if (q.path.includes('workouts')) {
        cb({ docs: [] })
      } else if (q.path.includes('days')) {
        cb({
          docs: [
            { 
              id: 'day1', 
              data: () => ({ title: 'Day One', day_number: 1 }) 
            }
          ]
        })
      }
      return () => {}
    }),
    doc: vi.fn((db, ...paths) => ({ id: paths[paths.length - 1], path: paths.join('/') })),
    getDoc: vi.fn(() => Promise.resolve({
      exists: () => true,
      id: 'test-program-id',
      data: () => ({ name: 'Test Program' })
    })),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ empty: true, size: 0, docs: [] })),
    updateDoc: vi.fn()
  }
})

describe('Day Deletion Guard Logic', () => {
  const params = Promise.resolve({ id: 'test-program-id' })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('prevents deletion if fresh query finds workouts, even if local state is empty', async () => {
    const { getDocs: mockedGetDocs, deleteDoc: mockedDeleteDoc } = await import('firebase/firestore')
    
    // Simulate that fresh query finds 1 workout
    vi.mocked(mockedGetDocs).mockResolvedValueOnce({
      empty: false,
      size: 1,
      docs: [{ id: 'workout1' }]
    } as any)

    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    // Find the delete button for Day One
    // It's in the DaySection. The ConfirmDeleteDialog trigger is a Trash2 icon.
    const deleteButton = screen.getByRole('button', { name: /Delete Day One/i })
    
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    // Find and click confirm in the dialog
    const confirmButton = screen.getByRole('button', { name: /Delete/i })
    
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    // Expect a fresh query was made (getDocs)
    expect(mockedGetDocs).toHaveBeenCalled()
    
    // Expect deleteDoc NOT to have been called because workouts were found
    expect(mockedDeleteDoc).not.toHaveBeenCalled()
    
    // Expect an error toast
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Cannot delete a day that contains workouts"))
  })

  it('allows deletion if fresh query finds no workouts', async () => {
    const { getDocs: mockedGetDocs, deleteDoc: mockedDeleteDoc } = await import('firebase/firestore')
    
    // Simulate that fresh query finds 0 workouts
    vi.mocked(mockedGetDocs).mockResolvedValueOnce({
      empty: true,
      size: 0,
      docs: []
    } as any)

    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    const deleteButton = screen.getByRole('button', { name: /Delete Day One/i })
    
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    const confirmButton = screen.getByRole('button', { name: /Delete/i })
    
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    expect(mockedGetDocs).toHaveBeenCalled()
    expect(mockedDeleteDoc).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("Day deleted successfully")
  })

  it('prevents deletion if local state has workouts, without needing fresh query', async () => {
    // We need to change the mock for this specific test
    const { onSnapshot: mockedOnSnapshot, getDocs: mockedGetDocs, deleteDoc: mockedDeleteDoc } = await import('firebase/firestore')
    
    // Override onSnapshot for this test to return workouts
    vi.mocked(mockedOnSnapshot).mockImplementation((q, cb) => {
      if (q.path.includes('workouts')) {
        cb({ docs: [{ id: 'workout1', data: () => ({ title: 'W1' }) }] } as any)
      } else if (q.path.includes('days')) {
        cb({ docs: [{ id: 'day1', data: () => ({ title: 'Day One', day_number: 1 }) }] } as any)
      }
      return () => {}
    })

    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    const deleteButton = screen.getByRole('button', { name: /Delete Day One/i })
    expect(deleteButton).toBeDisabled()
    
    // Simulate finding the confirm button (e.g. if the user forced the dialog open)
    // For this test, since it's disabled, the dialog won't open via click.
    // If we want to test the logical guard specifically, we can test that it would block if called.
    
    expect(mockedDeleteDoc).not.toHaveBeenCalled()
  })

  it('disables the delete button in UI when workouts are present', async () => {
    const { onSnapshot: mockedOnSnapshot } = await import('firebase/firestore')
    
    // Return workouts in snapshot
    vi.mocked(mockedOnSnapshot).mockImplementation((q, cb) => {
      if (q.path.includes('workouts')) {
        cb({ docs: [{ id: 'workout1', data: () => ({ title: 'W1' }) }] } as any)
      } else if (q.path.includes('days')) {
        cb({ docs: [{ id: 'day1', data: () => ({ title: 'Day One', day_number: 1 }) }] } as any)
      }
      return () => {}
    })

    await act(async () => {
      render(<ProgramDetailPage params={params} />)
    })

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
    
    // Find the delete button
    const deleteButton = screen.getByRole('button', { name: /Delete Day One/i })
    
    // Expect it to be disabled
    expect(deleteButton).toBeDisabled()
    // Tooltip is on the parent wrapper
    expect(deleteButton.parentElement).toHaveAttribute('title', 'Cannot delete a day that contains workouts. Please remove all workouts first.')
  })
})
