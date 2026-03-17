# Plan: Unified Login & Client Portal

## Phase 1: Multi-Role Auth & Registration Foundation
- [x] Task: Multi-Role `AuthProvider` & `AuthGuard` [TDD] [b483a66]
    - [x] Write tests for multi-collection role detection.
    - [x] Update `AuthProvider` to check both `admin_users` and `clients` collections.
    - [x] Update `AuthGuard` to handle dynamic root routing based on role.
- [x] Task: Public Registration Flow [TDD] [a47d4c9]
    - [x] Write tests for new user registration.
    - [x] Implement registration form components.
    - [x] Create Firestore sync logic for newly registered clients.
- [ ] Task: Account Security (Password Reset/Forgot) [TDD]
    - [ ] Write tests for password reset dispatch.
    - [ ] Implement "Forgot Password" UI and Firebase Auth integration.
    - [ ] Implement "Change Password" in profile settings.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Multi-Role Auth' (Protocol in workflow.md)

## Phase 2: Client Portal Shell & Core Training Views
- [ ] Task: Client Portal Layout & Navigation [TDD]
    - [ ] Write tests for client-specific navigation.
    - [ ] Create `ClientPortalLayout` with mobile-first navigation.
    - [ ] Implement dynamic root (/) landing page for clients.
- [ ] Task: Client Program & Workout Detail Views [TDD]
    - [ ] Write tests for program/workout data fetching.
    - [ ] Implement Program List View (Current/Assigned).
    - [ ] Implement Workout Sequence Builder (Read-only) for clients.
    - [ ] Integrate Video Modal for workout exercises.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Client Portal Core' (Protocol in workflow.md)

## Phase 3: Training History & Profile Management
- [ ] Task: Training History & Completion Tracking [TDD]
    - [ ] Write tests for workout completion logging.
    - [ ] Implement "Mark as Complete" logic for workouts.
    - [ ] Create Training History view for clients.
- [ ] Task: Client Profile Editing & Coach Feedback [TDD]
    - [ ] Write tests for profile updates and feedback submission.
    - [ ] Implement profile edit form for clients.
    - [ ] Implement feedback interface within workout views.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Client Engagement' (Protocol in workflow.md)

## Phase 4: Final Polish & UI Consistency
- [ ] Task: Mobile Responsiveness & Design Polish [TDD]
    - [ ] Verify 40px/24px border-radius adaptive geometry.
    - [ ] Audit all client-facing UI for "Elite Performance" aesthetic.
    - [ ] Final end-to-end routing and role-check verification.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)
