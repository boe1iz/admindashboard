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
- [x] Task: Account Security (Password Reset/Forgot) [TDD] [76b9c85]
    - [x] Write tests for password reset dispatch.
    - [x] Implement "Forgot Password" UI and Firebase Auth integration.
    - [x] Implement "Change Password" in profile settings.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Multi-Role Auth' (Protocol in workflow.md)

## Phase 2: Client Portal Shell & Core Training Views
- [x] Task: Client Portal Layout & Navigation [TDD]
    - [x] Write tests for client-specific navigation.
    - [x] Create `ClientPortalLayout` with mobile-first navigation.
    - [x] Implement dynamic root (/) landing page for clients.
- [x] Task: Client Program & Workout Detail Views [TDD]
    - [x] Write tests for program/workout data fetching.
    - [x] Implement Program List View (Current/Assigned).
    - [x] Implement Workout Sequence Builder (Read-only) for clients.
    - [x] Integrate Video Modal for workout exercises.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Client Portal Core' (Protocol in workflow.md)

## Phase 3: Training History & Profile Management
- [x] Task: Training History & Completion Tracking [TDD]
    - [x] Write tests for workout completion logging.
    - [x] Implement "Mark as Complete" logic for workouts.
    - [x] Create Training History view for clients.
- [x] Task: Client Profile Editing & Coach Feedback [TDD]
    - [x] Write tests for profile updates and feedback submission.
    - [x] Implement profile edit form for clients.
    - [x] Implement feedback interface within workout views.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Client Engagement' (Protocol in workflow.md)

## Phase 4: Final Polish & UI Consistency
- [x] Task: Mobile Responsiveness & Design Polish [TDD]
    - [x] Verify 40px/24px border-radius adaptive geometry.
    - [x] Audit all client-facing UI for "Elite Performance" aesthetic.
    - [x] Final end-to-end routing and role-check verification.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)
