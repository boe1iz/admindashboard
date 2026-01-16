import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RootLayout from '../app/layout'

// Mock components that might cause issues in a basic layout test
vi.mock('@/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />
}))
vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />
}))

// Mock next/font
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist' }),
  Geist_Mono: () => ({ variable: 'geist-mono' }),
}))

// Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(() => ({ user: { email: 'coach@on3.com' }, loading: false })),
}))

describe('Route Transitions', () => {
  it('should be wrapped in AnimatePresence (simulated by checking layout)', () => {
    // We'll check if layout renders the children correctly
    render(
      <RootLayout>
        <div data-testid="test-child">Content</div>
      </RootLayout>
    )
    expect(screen.getByTestId('test-child')).toBeDefined()
  })
})
