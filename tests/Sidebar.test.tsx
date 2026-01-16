import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from '../components/Sidebar'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

describe('Sidebar Component', () => {
  it('renders with the studio design classes', () => {
    const { container } = render(<Sidebar />)
    const sidebarDiv = container.firstChild as HTMLElement
    
    // Check for theme-aware card background and border
    expect(sidebarDiv.className).toContain('bg-card')
    expect(sidebarDiv.className).toContain('border-r')
    
    // Check for logo text
    expect(screen.getByText('ON3 ATHLETICS')).toBeDefined()
  })

  it('renders navigation items with correct active state styling', () => {
    render(<Sidebar />)
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    // In my force-reset, I used bg-[#0057FF] for active items
    expect(dashboardLink.className).toContain('bg-[#0057FF]')
    expect(dashboardLink.className).toContain('text-white')
  })
})