import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from '../components/Sidebar'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

// Mock version.json
vi.mock('@/lib/version.json', () => ({
  default: { commitId: 'a1b2c3d' }
}))

describe('Sidebar Version Display', () => {
  it('renders the git commit id below the version text', async () => {
    render(<Sidebar />)
    
    // Check for version text
    expect(screen.getByText(/Admin Dashboard v2.0/i)).toBeDefined()
    
    // Check for commit SHA text
    await waitFor(() => {
      expect(screen.getByText(/Commit: a1b2c3d/i)).toBeDefined()
    }, { timeout: 2000 })
  })
})
