# Specification: Resolve Login Routing and Session Issue

## Overview
A critical bug prevents users from reaching the dashboard after logging in. Despite entering valid credentials, the application "stalls" on the login page without redirecting. This suggests a failure in the `AuthProvider`'s state transition or the `AuthGuard`'s redirection logic, specifically related to the recent `Auth Logic` updates.

## Functional Requirements
- **Successful Authentication**: Ensure the Firebase Auth sign-in process completes successfully.
- **Session Resolution**: The `AuthProvider` must correctly identify the user's admin status and update the `user` state.
- **Correct Redirection**: Upon successful login, the application must redirect the user from `/login` to `/` (the dashboard) or the intended target route.
- **Session Persistence**: Verify that the session control mechanism correctly maintains the user's authenticated state across refreshes.

## Technical Details (Recent Changes)
- **Investigate `AuthProvider.tsx`**: Check for race conditions or incomplete promises in the role-checking logic.
- **Investigate `AuthGuard`**: Ensure the guard is correctly reacting to state changes and not blocking redirection.

## Acceptance Criteria
- [ ] User can log in with valid credentials and is redirected to the dashboard.
- [ ] The browser console shows no errors related to routing or authentication.
- [ ] Authenticated users are not incorrectly redirected back to the login page.
- [ ] Non-authenticated users are still correctly blocked from dashboard routes.

## Out of Scope
- Redesigning the login UI.
- Modifying the Firebase Auth configuration unless explicitly found to be the root cause.
