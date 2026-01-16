import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../components/AuthProvider'
import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth' },
}))

function TestComponent() {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return <div>{user ? `User: ${user.email}` : 'No User'}</div>
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    vi.mocked(onAuthStateChanged).mockReturnValue(() => {})
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByText('Loading...')).toBeDefined()
  })

  it('shows unauthenticated state after loading', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(null) // Unauthenticated
      return () => {}
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('No User')).toBeDefined()
    })
  })

  it('shows authenticated state after loading', async () => {
    const mockUser = { email: 'coach@on3.com' }
    vi.mocked(onAuthStateChanged).mockImplementation((auth, cb) => {
      cb(mockUser as any) // Authenticated
      return () => {}
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('User: coach@on3.com')).toBeDefined()
    })
  })
})