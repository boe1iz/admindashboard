# Specification: Mobile Visibility Fix for Assigned Programs

## Overview
A bug has been reported where clients (specifically `elifoner99@gmail.com`) can view their assigned programs on the desktop web version of the portal, but the list appears empty on mobile devices (iOS/Mobile Browser). Preliminary investigation shows that the navigation tab is visible and other data (Profile, History) loads correctly, suggesting the issue is specific to the "Programs" view rendering on small viewports.

## Functional Requirements
1.  **Uniform Visibility**: Assigned programs must be visible across all device types (Desktop, Tablet, Mobile).
2.  **Parity with Web View**: Any program assigned to a client must render correctly in the mobile interface if it is already rendering in the desktop interface.
3.  **Cross-Browser Stability**: Ensure compatibility with iOS Safari and Chrome.

## Technical Scope
- **UI Inspection**: Check for CSS classes (e.g., `hidden`, `md:block`) that might be accidentally hiding the program list or cards on smaller screens in `app/programs/page.tsx` or related components.
- **Conditional Rendering**: Review logic in `ProgramsPage` or `ProgramCard` that might be checking for screen width or user agent before rendering content.
- **Data Fetching Audit**: Verify that the Firestore subscription/query for assignments is active and properly updating the state on mobile.

## Acceptance Criteria
- [ ] Assigned programs for `elifoner99@gmail.com` (and other clients) are visible on iOS mobile browsers.
- [ ] The "No Programs Found" message only appears when a client truly has zero assignments.
- [ ] Layout remains responsive and visually consistent with the "Elite Performance" aesthetic.

## Out of Scope
- Backend changes to program assignment logic (logic is confirmed working on desktop).
- Styling improvements unrelated to visibility.
