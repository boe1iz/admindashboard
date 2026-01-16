import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../app/login/page'
import React from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'

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
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}))

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText(/coach@on3athletics.com/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Deploy Dashboard/i })).toBeDefined()
  })

  it('calls signInWithEmailAndPassword on form submission', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as any)
    
    render(<LoginPage />)
    
    fireEvent.change(screen.getByPlaceholderText(/coach@on3athletics.com/i), { target: { value: 'coach@on3.com' } })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Deploy Dashboard/i }))
    
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'coach@on3.com',
        'password123'
      )
    })
  })

  it('shows error message on failed login', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error('Invalid credentials'))
    
    render(<LoginPage />)
    
    fireEvent.change(screen.getByPlaceholderText(/coach@on3athletics.com/i), { target: { value: 'wrong@on3.com' } })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /Deploy Dashboard/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeDefined()
    })
  })
})
