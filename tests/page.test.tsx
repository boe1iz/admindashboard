import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Home page renders correctly', () => {
  render(<Page />)
  expect(screen.getByText(/To get started, edit the page.tsx file/i)).toBeDefined()
})
