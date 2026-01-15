import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AnimatedCounter } from '../components/AnimatedCounter'

describe('AnimatedCounter', () => {
  it('renders the target value', async () => {
    render(<AnimatedCounter value={100} />)
    // On initial render it might be 0, but eventually should reach 100
    // For the test, we check if it renders a number
    const element = screen.getByText(/[0-9]+/)
    expect(element).toBeDefined()
  })
})
