import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RootLayout from '../app/layout'
import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import { usePathname, useRouter } from 'next/navigation'

// Mock components used in layout
vi.mock('@/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}))
vi.mock('@/components/MobileNav', () => ({
  MobileNav: () => <div data-testid="mobile-nav">MobileNav</div>,
}))

// Mock Auth context
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}))

describe('Client Portal Layout & Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides admin Sidebar and MobileNav for clients', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' } as any,
      isAdmin: false,
      isClient: true,
      loading: false,
    })
    vi.mocked(usePathname).mockReturnValue('/')

    render(
      <RootLayout>
        <div data-testid="client-content">Portal Content</div>
      </RootLayout>
    )

    await waitFor(() => {
      expect(screen.getByTestId('client-content')).toBeDefined()
      expect(screen.queryByTestId('sidebar')).toBeNull()
      expect(screen.queryByTestId('mobile-nav')).toBeNull()
    })
  })

  it('renders ClientBottomNav for clients on mobile/tablet', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'client-123' } as any,
      isAdmin: false,
      isClient: true,
      loading: false,
    })
    vi.mocked(usePathname).mockReturnValue('/')

    render(
      <RootLayout>
        <div>Portal Content</div>
      </RootLayout>
    )

    await waitFor(() => {
      // This should fail initially as ClientBottomNav isn't implemented
      expect(screen.getByTestId('client-bottom-nav')).toBeDefined()
    })
  })
})
