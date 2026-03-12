# Specification: Simple Firestore-Based Role Separation

## Overview
This track implements a simplified role-based access control (RBAC) system for ON3 Athletics. Instead of complex Firebase Custom Claims, user roles will be determined by checking for the existence of the user's UID in a specific Firestore collection (`admin_users`).

## Functional Requirements

### 1. Admin Verification
- **Firestore Check**: The Admin Dashboard will verify if the authenticated user's UID exists as a document in the `admin_users` Firestore collection.
- **Admin-Only Dashboard Access**:
    - Users whose UIDs are NOT in the `admin_users` collection will be considered "Clients".
    - Non-admin users attempting to log into the Admin Dashboard will be denied access and signed out.
    - Provide a clear error message: "Access Denied: You do not have administrator privileges."

### 2. Authentication Flow
- **AuthProvider Update**: Modify the `AuthProvider` to fetch the admin status from Firestore after successful Firebase Auth authentication.
- **AuthGuard Update**: Ensure the `AuthGuard` waits for the Firestore role check to complete before allowing or denying access to dashboard routes.

### 3. Management
- **Manual Setup (Initial)**: The first admin UID can be manually added to the `admin_users` collection via the Firebase Console.
- **Dashboard Management (Future)**: Admins will eventually be able to manage this list from within the dashboard.

## Acceptance Criteria
- [ ] Users with UIDs in `admin_users` can log in and stay in the dashboard.
- [ ] Users with UIDs NOT in `admin_users` are signed out and shown an error message.
- [ ] The dashboard remains protected against unauthorized access.

## Out of Scope
- Implementation of the iOS application.
- UI for managing the `admin_users` collection (this will be a future track).
