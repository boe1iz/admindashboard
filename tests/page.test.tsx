import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Dashboard page renders Command Center', () => {
  render(<Page />)
  expect(screen.getByText('Command Center')).toBeDefined()
  expect(screen.getByText('Active Athletes')).toBeDefined()
  expect(screen.getByText('Concepts')).toBeDefined()
  expect(screen.getByText('Operational Gear')).toBeDefined()
  expect(screen.getByText('Safe Vault')).toBeDefined()
})
