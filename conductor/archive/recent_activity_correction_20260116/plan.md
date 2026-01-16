# Plan: Recent Activity Correction

This plan outlines the implementation of an accurate and unified Recent Activity feed on the Dashboard, correctly capturing program assignments and client status changes.

## Phase 1: Logging Infrastructure
- [x] Task: Create Activity Logging Utility [73dc884]
    - [x] Implement a `logActivity` helper in `lib/firebase.ts` or a separate hook.
    - [x] Integrate `logActivity` into `CreateClientDialog`, `EditClientDialog` (archive/restore), and `ManageClientProgramsDialog` (assign/unassign).
- [ ] Task: Conductor - User Manual Verification 'Logging Infrastructure' (Protocol in workflow.md)

## Phase 2: Dashboard Integration
- [x] Task: Update Dashboard to Read from Activity Collection [9534a4f]
    - [x] Refactor `app/page.tsx` to use a single `onSnapshot` listener on the `activity` collection.
    - [x] Update UI rendering to support the 'unassigned' type.
- [ ] Task: Conductor - User Manual Verification 'Dashboard Integration' (Protocol in workflow.md)

## Phase 3: Final Verification
- [x] Task: End-to-End Functional Check [9534a4f]
    - [x] Verify that assigning a program triggers the correct activity entry.
    - [x] Verify that archiving/restoring a client triggers the correct activity entry.
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
