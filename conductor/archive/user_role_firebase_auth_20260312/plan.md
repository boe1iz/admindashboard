# Implementation Plan: Unified User & Profile Management

## Phase 1: Authentication & Role Check [checkpoint: 7797348] (COMPLETED)
- [x] Task: Update `AuthProvider.tsx` to check Firestore for Admin status
- [x] Task: Update `AuthGuard` in `layout.tsx` to use `isAdmin`
- [x] Task: Update Login Page logic to show Admin Access Denied error

## Phase 2: Security Rules [checkpoint: 64274fa] (COMPLETED)
- [x] Task: Update Firestore Security Rules to protect collections

## Phase 3: Client UI Cleanup (COMPLETED)
- [x] Task: Remove "Onboard Athlete" / "Create Client" button and logic
- [x] Task: Update Edit Client logic to disable email editing (managed by Auth)

## Phase 4: Data Sync & Profile Management [checkpoint: pending]
- [ ] Task: Create and run Sync Script (`scripts/sync-users.js`)
    - [ ] List all users from Firebase Auth using Admin SDK
    - [ ] Create documents in Firestore `clients` collection for each user using their UID
    - [ ] Set default `is_active: true` and `name` from Auth display name or email
- [ ] Task: Update `EditClientDialog` to include "Additional Info" fields
    - [ ] Add a `notes` or `bio` field to the Firestore document
    - [ ] Allow Admin to edit these fields
- [ ] Task: Implement Auto-Profile Creation in `AuthProvider`
    - [ ] If a user logs in and no Firestore doc exists, create one automatically
- [ ] Task: Conductor - User Manual Verification 'Profile Sync' (Protocol in workflow.md)
