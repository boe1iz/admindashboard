# Implementation Plan: Simple Firestore-Based Role Separation

## Phase 1: Authentication & Role Check [checkpoint: 7797348]
- [x] Task: Update `AuthProvider.tsx` to check Firestore for Admin status [7797348]
    - [x] Create Failing Tests (Red Phase)
    - [x] Implement Firestore lookup in `onAuthStateChanged`
    - [x] Update `AuthContext` to include `isAdmin` boolean
- [x] Task: Update `AuthGuard` in `layout.tsx` to use `isAdmin` [7797348]
    - [x] Create Failing Tests (Red Phase)
    - [x] Ensure non-admins are redirected to login
- [x] Task: Update Login Page logic to show Admin Access Denied error [7797348]
    - [x] Verify that non-admin users see the correct error message and are signed out
- [x] Task: Conductor - User Manual Verification 'Simple Role Check' (Protocol in workflow.md)

## Phase 2: Security Rules (Optional/Future) [checkpoint: pending]
- [ ] Task: Update Firestore Security Rules to protect collections
    - [ ] Restrict write access to `admin_users` and core training collections to admins only
- [ ] Task: Conductor - User Manual Verification 'Security Rules' (Protocol in workflow.md)
