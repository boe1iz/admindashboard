import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from '../app/login/page'
import React from 'react'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth' },
}))

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

describe('Login Page Alignment', () => {
  it('has the correct responsive alignment classes on the container', () => {
    const { container } = render(<LoginPage />)
    const mainDiv = container.querySelector('div')
    
    // Check for the container classes
    // We expect: items-start pt-8 (mobile) and sm:items-center (tablet/desktop)
    // The current implementation is items-center justify-center p-4
    
    const classList = mainDiv?.className || ''
    
    // These should FAIL initially as they are not yet implemented
    expect(classList).toContain('items-start')
    expect(classList).toContain('pt-8')
    expect(classList).toContain('sm:items-center')
    expect(classList).toContain('sm:pt-4') // Or whatever we decide for desktop pt
  })
})
