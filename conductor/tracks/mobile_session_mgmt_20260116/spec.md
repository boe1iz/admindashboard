# Specification: Mobile Session Management Visibility

## Overview
This track fixes a visibility issue where session management actions (User Identity, Logout, Change Password, and Theme Toggle) are inaccessible on mobile and responsive views. It introduces a dedicated User Profile sheet in the mobile header to ensure coaches have full control over their session across all devices.

## Functional Requirements
- **Mobile Header Update**:
    - Add a "User" icon (e.g., `User` or `Settings` from `lucide-react`) to the far right of the mobile header.
    - This icon will trigger a dedicated "User Settings" sheet.
- **User Settings Sheet**:
    - **Coach Identity**: Display the authenticated user's email.
    - **Session Actions**: Include "Change Password" and "Logout Session" buttons (mirroring the desktop Sidebar footer).
    - **Theme Management**: Integrate the `ThemeToggle` component within this sheet for mobile access.
- **Visual Consistency**:
    - Follow the "Sophisticated Studio" design language.
    - Use centered, high-contrast typography and polished adaptive components.

## Technical Requirements
- **Component Modification**:
    - Update `components/MobileNav.tsx` to include the user icon and the new sheet logic.
    - Reuse `components/ChangePasswordDialog.tsx` or its logic within the mobile context.
    - Reuse `components/ThemeToggle.tsx`.
- **Responsive Logic**:
    - Ensure the user icon only appears on mobile/tablet breakpoints (consistent with `MobileNav` visibility).
- **Mobile Hardware Optimization**:
    - Ensure all buttons in the User Settings sheet meet the 44x44px touch target minimum.

## Acceptance Criteria
1. On mobile screens, a user icon is visible in the top navigation bar.
2. Tapping the user icon opens a bottom sheet or slide-over containing the user email, Change Password button, Logout button, and Theme toggle.
3. All session management actions work correctly on mobile touch interfaces.
4. The desktop Sidebar footer remains unchanged and fully functional.

## Out of Scope
- Redesigning the desktop authentication flow.
- Adding additional user profile fields (e.g., Avatar uploads).
