# Plan: Mobile & Responsive Design Overhaul

This plan outlines the systematic adaptation of the ON3 Athletics Admin Dashboard for mobile devices, ensuring a high-performance "Elite" experience across all screen sizes.

## Phase 1: Navigation & Global Foundation [checkpoint: 0b8ea11]
- [x] Task: Implement Mobile Hamburger Menu [7bcb3f1]
    - [x] Write failing tests (Red Phase) in `tests/MobileNav.test.tsx` for menu toggle visibility and behavior.
    - [x] Create a `MobileNav` component with a slide-over overlay.
    - [x] Update `Sidebar.tsx` to be hidden on mobile and visible on `lg` screens.
    - [x] Implement the energetic blue hamburger toggle in the main layout.
- [x] Task: Responsive Typography & Padding [0fed52f]
    - [x] Update `app/globals.css` with responsive font scaling variables.
    - [x] Apply `sm:`, `md:`, `lg:` padding adjustments to the main layout container.
- [x] Task: Conductor - User Manual Verification 'Foundation' (Protocol in workflow.md)

## Phase 2: Dashboard & Core Grids
- [x] Task: Responsive Stat Cards & Activity Feed [04a5610]
    - [x] Write failing tests (Red Phase) in `tests/ResponsiveDashboard.test.tsx` for grid column counts.
    - [x] Update `app/page.tsx` to transition from 3-column to 1-column grids on mobile.
    - [x] Adjust Activity Feed item density and icon sizing for small screens.
- [x] Task: Adaptive Client & Program Rosters [04a5610]
    - [x] Update `app/clients/page.tsx` and `app/programs/page.tsx` for single-column card layouts.
    - [x] Reduce card border-radius and padding for `sm` breakpoints.
- [x] Task: Conductor - User Manual Verification 'Dashboard & Grids' (Protocol in workflow.md)

## Phase 3: Sequence Builder & Dialogs [checkpoint: 036c1d9]
- [x] Task: Mobile-First Sequence Builder [9428d64]
    - [x] Update `app/programs/[id]/page.tsx` to ensure Day cards and Workouts fill full screen width.
    - [x] Increase touch targets for reordering handles and chevron toggles.
- [x] Task: Adaptive CRUD Sheets [036c1d9]
    - [x] Refactor Dialogs (Workout, Client, Program, Equipment) to use `Sheet` or adaptive dialogs that occupy full height on mobile.
    - [x] Ensure all form inputs are optimized for mobile touch keyboards.
- [x] Task: Conductor - User Manual Verification 'Sequence Builder & Dialogs' (Protocol in workflow.md)

## Phase 4: Final Polish & Audit
- [ ] Task: Cross-Device Visual Audit
    - [ ] Perform a comprehensive audit of all pages on simulated mobile devices (iPhone/Pixel).
    - [ ] Fix any remaining horizontal scrolling or layout shifts.
- [ ] Task: Performance & Transition Optimization
    - [ ] Verify Framer Motion animations are fluid on mobile hardware.
    - [ ] Implement `reduced-motion` accessible alternatives where necessary.
- [ ] Task: Conductor - User Manual Verification 'Final Polish' (Protocol in workflow.md)
