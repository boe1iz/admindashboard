import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RootLayout from '../app/layout'
import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import { usePathname, useRouter } from 'next/navigation'

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans' }),
  Geist_Mono: () => ({ variable: 'geist-mono' }),
}))

// Mock components
vi.mock('@/components/Sidebar', () => ({ Sidebar: () => <div data-testid="sidebar">Sidebar</div> }))
vi.mock('@/components/MobileNav', () => ({ MobileNav: () => <div data-testid="mobilenav">MobileNav</div> }))
vi.mock('@/components/ThemeProvider', () => ({ ThemeProvider: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/AuthProvider', () => ({
  AuthProvider: ({ children }: any) => <>{children}</>,
  useAuth: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

describe('SimpleAuthGuard (within RootLayout)', () => {
  const mockReplace = vi.fn()
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ replace: mockReplace, push: mockPush } as any)
  })

  it('redirects to /login if user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, isAdmin: false, loading: false })
    vi.mocked(usePathname).mockReturnValue('/')

    render(<RootLayout><div>Content</div></RootLayout>)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login')
    })
  });

  it('redirects to /login if user is authenticated but not an admin or client', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { email: 'unknown@on3.com' } as any, isAdmin: false, isClient: false, loading: false })
    vi.mocked(usePathname).mockReturnValue('/')

    render(<RootLayout><div>Content</div></RootLayout>)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login')
    })
  });

  it('allows access if user is an admin and shows Sidebar', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { email: 'admin@on3.com' } as any, isAdmin: true, isClient: false, loading: false })
    vi.mocked(usePathname).mockReturnValue('/')

    render(<RootLayout><div>Content</div></RootLayout>)

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeDefined()
      expect(screen.getByTestId('sidebar')).toBeDefined()
    })
  });

  it('allows access if user is a client but hides Sidebar', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { email: 'client@on3.com' } as any, isAdmin: false, isClient: true, loading: false })
    vi.mocked(usePathname).mockReturnValue('/')

    render(<RootLayout><div>Content</div></RootLayout>)

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeDefined()
      expect(screen.queryByTestId('sidebar')).toBeNull()
    })
  });
});
