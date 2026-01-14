import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from '@/components/Sidebar'

describe('Sidebar', () => {
  it('renders navigation links', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Programs')).toBeDefined()
    expect(screen.getByText('Athletes')).toBeDefined()
    expect(screen.getByText('Inventory')).toBeDefined()
  })
})
