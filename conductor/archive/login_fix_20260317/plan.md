# Plan: Resolve Login Routing and Session Issue

## Phase 1: Reproduction & Diagnostic Tests
- [x] Task: Create Reproduction Test Case
    - [x] Write a failing integration test in `tests/AuthRouting.test.tsx` that simulates a successful login but asserts a redirect failure or state stall.
    - [x] Run the test and confirm it fails (Red Phase).
- [x] Task: Diagnostic Logging & State Inspection
    - [x] Add temporary logging to `AuthProvider.tsx` to trace the `onAuthStateChanged` and role-checking flow.
    - [x] Verify if the `user` state is being set but the UI isn't reacting.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Diagnostics' (Protocol in workflow.md)

## Phase 2: Auth Logic Correction
- [x] Task: Fix `AuthProvider` State Transition
    - [x] Modify `AuthProvider.tsx` to ensure the `loading` state is correctly resolved after the admin role check.
    - [x] Ensure that `router.push('/')` (or the appropriate redirect) is triggered upon successful login if not already handled by a guard.
    - [x] Run tests to confirm the fix (Green Phase).
- [x] Task: Refactor & Cleanup
    - [x] Remove diagnostic logs.
    - [x] Improve error handling in the role-checking logic.
    - [x] Run tests to ensure no regressions.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Logic Fix' (Protocol in workflow.md)

## Phase 4: Browser-Session Persistence (Across Tabs)
- [ ] Task: Replace `sessionStorage` with Session Cookie
    - [ ] Modify `LoginPage.tsx` to set a session cookie (no expiry) called `auth_session` instead of `tab_auth_granted`.
    - [ ] Modify `AuthProvider.tsx` to check for this `auth_session` cookie instead of `sessionStorage`.
    - [ ] Ensure `signOut` clears the cookie.
- [ ] Task: Verify Cross-Tab Behavior
    - [ ] Verify that opening a new tab or closing/reopening a tab doesn't require re-authentication if the browser remained open.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Session Persistence' (Protocol in workflow.md)
