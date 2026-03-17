import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../app/login/page'
import React from 'react'
import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/components/AuthProvider'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}))

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}))

// Mock lib/firebase
vi.mock('@/lib/firebase', () => ({
  auth: { type: 'auth', currentUser: null },
  db: { type: 'db' },
}))

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(() => '/login'),
}))

describe('Account Security Flow', () => {
  const mockRouter = {
    replace: vi.fn(),
    push: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue(mockRouter as any)
    sessionStorage.clear()
  })

  it('shows password reset UI when "Forgot Password?" is clicked', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )

    // Switch to forgot password
    const forgotBtn = screen.getByText(/Forgot Password\?/i)
    fireEvent.click(forgotBtn)

    await waitFor(() => {
      expect(screen.getByText('Reset Access')).toBeDefined()
      expect(screen.getByText('Send Reset Link')).toBeDefined()
    })
  })

  it('successfully sends password reset email', async () => {
    vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )

    // Switch to forgot password
    fireEvent.click(screen.getByText(/Forgot Password\?/i))

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('coach@on3athletics.com'), { target: { value: 'coach@test.com' } })

    // Submit
    fireEvent.click(screen.getByText('Send Reset Link'))

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'coach@test.com')
    })
  })
})
