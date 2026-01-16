# Plan: Firebase Authentication & Session Management

This plan outlines the implementation of a secure authentication layer using Firebase Auth, including login/logout flows, route protection, and password management.

## Phase 1: Auth Infrastructure & Provider [checkpoint: 609d8b2]
- [x] Task: Create Authentication Context [a830030]
    - [x] Create `components/AuthProvider.tsx` to wrap the app and manage `onAuthStateChanged`.
    - [x] Export a `useAuth` hook for components to access user state.
- [x] Task: Implement Global Route Guard [a830030]
    - [x] Create a higher-order component or update `app/layout.tsx` to handle redirects based on auth status.
    - [x] Ensure `/login` is the only accessible route for unauthenticated users.
- [x] Task: Conductor - User Manual Verification 'Auth Infrastructure' (Protocol in workflow.md)

## Phase 2: Login Experience
- [x] Task: Implement Login Page [7e51376]
    - [x] Write failing tests (Red Phase) in `tests/Login.test.tsx` for form rendering and validation.
    - [x] Create `app/login/page.tsx` with "Sophisticated Studio" styling.
    - [x] Implement `signInWithEmailAndPassword` logic with error handling.
- [x] Task: Update Application Layout for Auth [7e51376]
    - [x] Ensure the Sidebar and MobileNav only render when the user is authenticated.
- [ ] Task: Conductor - User Manual Verification 'Login Experience' (Protocol in workflow.md)

## Phase 3: Sidebar Integration & Management
- [ ] Task: Update Sidebar with User Profile & Logout
    - [ ] Add user email display to the Sidebar footer.
    - [ ] Implement the "Logout" button with `signOut` logic.
    - [ ] Write tests in `tests/SidebarAuth.test.tsx` to verify visibility and logout behavior.
- [ ] Task: Implement Change Password Dialog
    - [ ] Create `components/ChangePasswordDialog.tsx`.
    - [ ] Integrate the dialog trigger into the Sidebar footer.
    - [ ] Implement `updatePassword` logic with success/error toasts.
- [ ] Task: Conductor - User Manual Verification 'Sidebar & Management' (Protocol in workflow.md)

## Phase 4: Final Security Audit & Polish
- [ ] Task: End-to-End Auth Verification
    - [ ] Verify session persistence across page refreshes.
    - [ ] Audit all protected routes to ensure no data leaks before auth is confirmed.
- [ ] Task: Conductor - User Manual Verification 'Final Audit' (Protocol in workflow.md)
