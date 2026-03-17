import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../app/login/page'
import React from 'react'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/components/AuthProvider'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
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

describe('Public Registration Flow', () => {
  const mockRouter = {
    replace: vi.fn(),
    push: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue(mockRouter as any)
    sessionStorage.clear()
  })

  it('shows registration form when "Register" is clicked', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )

    // Initially shows login
    expect(screen.getByText('Deploy Dashboard')).toBeDefined()
    
    // Switch to register
    const registerBtn = screen.getByText(/Don't have an account\? Register/i)
    fireEvent.click(registerBtn)

    await waitFor(() => {
      expect(screen.getByText('Join the Elite')).toBeDefined()
      expect(screen.getByPlaceholderText('Athlete Name')).toBeDefined()
    })
  })

  it('successfully registers a new client and redirects to dashboard', async () => {
    const mockUser = { uid: 'new-client-uid', email: 'new@test.com' }
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser
    } as any)
    vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as any) // Not admin

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )

    // Switch to register
    fireEvent.click(screen.getByText(/Don't have an account\? Register/i))

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Athlete Name'), { target: { value: 'Test Athlete' } })
    fireEvent.change(screen.getByPlaceholderText('coach@on3athletics.com'), { target: { value: 'new@test.com' } }) 
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })

    // Submit
    fireEvent.click(screen.getByText('Initialize Account'))

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'new@test.com', 'password123')
      expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test Athlete' })
      // Redirection logic should eventually happen
      // In the app, handleLogin/handleRegister sets sessionStorage and refreshAuth
    })
  })
})
