# Implementation Plan: Role Separation and Firebase Auth Integration

## Phase 1: Foundation & Firebase Admin SDK Integration [checkpoint: pending]
- [x] Task: Integrate Firebase Admin SDK in `lib/firebase-admin.ts` [b6f323c]
    - [x] Create Failing Tests (Red Phase)
    - [x] Implement to Pass Tests (Green Phase)
    - [x] Verify Coverage & Quality Gates
    - [x] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Implement Role Verification Middleware/Guard in Dashboard Login
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation' (Protocol in workflow.md)

## Phase 2: Role Management UI & Logic [checkpoint: pending]
- [ ] Task: Create Server Action/API to Assign/Update Custom Claims (`admin` vs `client`)
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Update Athlete Roster to view Unassigned Firebase Auth Users
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Implement Role Assignment Button in User Detail View
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Role Management' (Protocol in workflow.md)

## Phase 3: Client Creation & Editing Workflow [checkpoint: pending]
- [ ] Task: Update Client Creation to use Firebase Admin SDK (Optionally for Admins to create clients)
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Implement Profile Editing (Name, Email) for Firebase Auth Users via Dashboard
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Client Creation & Editing' (Protocol in workflow.md)

## Phase 4: Migration Utility [checkpoint: pending]
- [ ] Task: Implement Automated Migration Script (Firestore to Firebase Auth + Claims)
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Verify Migration with Sample Data
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Migration' (Protocol in workflow.md)

## Phase 5: Security & Final Polish [checkpoint: pending]
- [ ] Task: Update Firestore Security Rules to Enforce `request.auth.token.admin`
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Final End-to-End Auth & Access Control Verification
    - [ ] Create Failing Tests (Red Phase)
    - [ ] Implement to Pass Tests (Green Phase)
    - [ ] Verify Coverage & Quality Gates
    - [ ] Commit & Record Task (Git Notes, SHA)
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Security & Polish' (Protocol in workflow.md)
