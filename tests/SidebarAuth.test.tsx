import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Sidebar } from '../components/Sidebar'
import React from 'react'
import { signOut } from 'firebase/auth'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signOut: vi.fn(() => Promise.resolve()),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth' },
}))

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: vi.fn(() => '/'),
}))

// Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/components/AuthProvider'

describe('Sidebar Auth Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the logged-in user email', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'coach@on3.com' } as any,
      loading: false
    })

    render(<Sidebar />)
    expect(screen.getByText('coach@on3.com')).toBeDefined()
  })

  it('calls signOut when logout button is clicked', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'coach@on3.com' } as any,
      loading: false
    })

    render(<Sidebar />)
    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled()
    })
  })
})
