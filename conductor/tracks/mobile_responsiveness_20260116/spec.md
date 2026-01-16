# Specification: Mobile & Responsive Design Overhaul

## Overview
This track ensures the ON3 Athletics Admin Dashboard is fully compatible with mobile devices. It adapts the "Sophisticated Studio" aesthetic for smaller screens, providing administrators and coaches with high-performance operational capabilities on the go.

## Functional Requirements
- **Mobile Navigation**:
    - Implement a slide-over Hamburger Menu to replace the Sidebar on small screens.
    - Ensure the toggle is easily accessible and follows the brand's energetic blue aesthetic.
- **Adaptive Layouts**:
    - **Responsive Grids**: Automatically transition card grids (Dashboard, Clients, Programs, Inventory) from multi-column to single-column on mobile.
    - **Typography Scaling**: Scale headers (e.g., 4xl -> 2xl) to fit mobile widths without overflow.
- **Component Optimization**:
    - **Touch Targets**: Increase minimum touch target sizes to 44x44px for all interactive elements.
    - **Card Refinement**: Reduce card padding and border-radius on mobile to maximize content space.
- **Sequence Builder (Mobile Focus)**:
    - Days and Workouts will expand to full-width.
    - Implement full-screen mobile sheets for all CRUD dialogs (Add/Edit Workout, Add/Edit Client, etc.).

## Technical Requirements
- **Tailwind Media Queries**: Use `sm:`, `md:`, `lg:`, and `xl:` prefixes extensively to handle breakpoint transitions.
- **Shadcn/UI Mobile Sheets**: Transition dialogs to `Sheet` components or adaptive dialogs that switch to sheets on mobile.
- **Viewport Meta**: Ensure the viewport is correctly configured for device-width scaling.
- **Framer Motion Transitions**: Optimize mobile transitions for performance and reduced motion preferences.

## Acceptance Criteria
1. The application is fully navigable and functional on a standard smartphone (e.g., iPhone 13/14).
2. The hamburger menu works smoothly without layout shifts.
3. All dialogs and forms are easily fillable on a touch keyboard.
4. Grids and typography adapt fluidly to screen width changes.
5. No horizontal scrolling occurs on the main workspace.

## Out of Scope
- Native mobile app development (iOS/Android).
- Offline-first capabilities (remains dependent on Firebase live connection).
