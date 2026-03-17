# Specification: Unified Login & Client Portal

## Overview
This feature track implements a unified entry point for all user types (Admins, Coaches, and Clients). The system will automatically detect the user's role upon successful authentication and provide tailored experiences: the existing Admin Dashboard for administrators and a new, comprehensive Client Portal for athletes/students.

## Functional Requirements
- **Unified Login Screen**: A single login interface at `/login` that accepts credentials for both Admins and Clients.
- **Auto-Role Detection**: Upon login, the system will check the user's role in the `admin_users` and `clients` Firestore collections to determine their access level.
- **Dynamic Root Routing (/)**:
    - **Admins**: Render the existing Admin Dashboard components.
    - **Clients**: Render the new Client Portal home view.
- **Client Portal Features**:
    - **Dashboard**: View assigned programs and workouts.
    - **Detail Views**: Drill down into program details and individual workout sequences.
    - **Video Playback**: Full integration for training video modals.
    - **Profile Management**: Ability for clients to update their own contact information.
    - **Training History**: A log of completed sessions and performance data.
    - **Coach Feedback**: A simple interface for providing feedback on assigned workouts.
- **User Management Lifecycle**:
    - **Registration**: A new public signup flow to collect basic profile info (name, email, password).
    - **Account Security**: Implementation of "Forgot Password" (email reset) and "Change Password" (within profile) functionality.

## Technical Details
- **Role Guard**: Update the existing `AuthGuard` and `AuthProvider` to handle multi-role resolution.
- **Firebase Integration**: Leverage Firebase Auth for registration and password reset emails.
- **Conditional Rendering**: Use the root layout and page structure to conditionally load components based on the resolved `role`.

## Acceptance Criteria
- [ ] Users can log in from a single screen and reach their respective homepages.
- [ ] Clients cannot access any admin-specific routes or components.
- [ ] New users can successfully register and automatically receive a "Client" role.
- [ ] Password reset emails are correctly dispatched and functional.
- [ ] Client home successfully displays mock/live assigned training data.

## Out of Scope
- Direct messaging between coaches and clients (deferred to future track).
- Billing/Subscription management for clients.
