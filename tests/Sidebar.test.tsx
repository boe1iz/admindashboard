import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from '../components/Sidebar'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

describe('Sidebar Component', () => {
  it('renders with the new design system classes', () => {
    const { container } = render(<Sidebar />)
    const sidebarDiv = container.firstChild as HTMLElement
    
    // Check for glassmorphism and background classes
    expect(sidebarDiv.className).toContain('bg-card')
    expect(sidebarDiv.className).toContain('glass-dark')
    
    // Check for primary color on logo
    const logo = screen.getByText('13CONCEPT')
    expect(logo.className).toContain('text-primary')
  })

  it('renders navigation items with correct active state styling', () => {
    render(<Sidebar />)
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    expect(dashboardLink.className).toContain('bg-primary')
    expect(dashboardLink.className).toContain('font-bold')
  })
})
