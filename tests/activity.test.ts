import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logActivity } from '@/lib/activity'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection' })),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new_doc_id' })),
  serverTimestamp: vi.fn(() => 'server_timestamp'),
  getFirestore: vi.fn(),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  db: { type: 'db' },
}))

describe('logActivity utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls addDoc with the correct collection and data', async () => {
    const activityData = {
      type: 'assignment' as const,
      client_name: 'John Doe',
      program_name: 'Intense Workout'
    }

    await logActivity(activityData)

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'activity')
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...activityData,
        timestamp: 'server_timestamp'
      })
    )
  })

  it('logs an error when addDoc fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(addDoc).mockRejectedValueOnce(new Error('Firestore error'))

    await logActivity({
      type: 'restore' as const,
      client_name: 'Jane Doe'
    })

    expect(consoleSpy).toHaveBeenCalledWith("Failed to log activity:", expect.any(Error))
    consoleSpy.mockRestore()
  })
})
