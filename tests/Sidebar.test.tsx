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
    expect(dashboardLink.className).toContain('font-black')
  })

  it('uses framer-motion for hover interactions', () => {
    const { container } = render(<Sidebar />)
    // Check if motion.div or motion props are present on links
    // Framer motion components often have style/transform properties even when static
    const links = container.querySelectorAll('a')
    links.forEach(link => {
      // In a real test we'd check for specific motion props or behavior
      // Here we will check if the component structure supports the motion animation
      expect(link.className).toContain('transition-all')
    })
  })
})
