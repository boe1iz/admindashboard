import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { MobileNav } from '../components/MobileNav'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

// Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/components/AuthProvider'

describe('Mobile Session Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the user profile trigger button', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'coach@on3.com' } as any,
      loading: false
    })

    render(<MobileNav />)
    const trigger = screen.getByRole('button', { name: /open user settings/i })
    expect(trigger).toBeDefined()
  })

  it('opens the user settings sheet when the trigger is clicked', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'coach@on3.com' } as any,
      loading: false
    })

    render(<MobileNav />)
    const trigger = screen.getByRole('button', { name: /open user settings/i })
    fireEvent.click(trigger)
    
    expect(screen.getByText('coach@on3.com')).toBeDefined()
    expect(screen.getByText(/Logout Session/i)).toBeDefined()
    expect(screen.getByText(/Change Password/i)).toBeDefined()
    // Theme toggle should also be there
    expect(screen.getByTitle(/Switch to/i)).toBeDefined()
  })
})
