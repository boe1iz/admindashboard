import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { MobileNav } from '../components/MobileNav'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

describe('Mobile Navigation', () => {
  it('renders the menu trigger button', () => {
    render(<MobileNav />)
    const trigger = screen.getByRole('button', { name: /open menu/i })
    expect(trigger).toBeDefined()
  })

  it('shows navigation items when the trigger is clicked', async () => {
    render(<MobileNav />)
    const trigger = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(trigger)
    
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Programs')).toBeDefined()
    expect(screen.getByText('Clients')).toBeDefined()
    expect(screen.getByText('Inventory')).toBeDefined()
  })
})
