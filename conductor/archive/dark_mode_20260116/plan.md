# Plan: Modern Dark Mode Implementation

This plan outlines the implementation of a comprehensive, toggleable dark mode for the "Sophisticated Studio" interface, utilizing `next-themes` and Tailwind CSS.

## Phase 1: Foundation & Theme Infrastructure
- [x] Task: Setup Theme Management
    - [x] Install `next-themes`.
    - [x] Create `components/ThemeProvider.tsx` wrapper.
    - [x] Integrate `ThemeProvider` into `app/layout.tsx`.
    - [x] Configure `tailwind.config.ts` for class-based dark mode.
- [x] Task: Implement Theme Toggle UI
    - [x] Create a `ThemeToggle` component using `lucide-react` (Sun/Moon).
    - [x] Integrate `ThemeToggle` into the `Sidebar` footer.
- [ ] Task: Conductor - User Manual Verification 'Foundation & Theme Infrastructure' (Protocol in workflow.md)

## Phase 2: Core Layout & Navigation
- [ ] Task: Dark Mode Styling for Sidebar
    - [ ] Write failing tests in `tests/SidebarTheme.test.tsx` to verify theme-aware classes.
    - [ ] Apply `dark:` classes to `Sidebar.tsx` (background, borders, nav items).
    - [ ] Verify transition smoothness and visual consistency.
- [ ] Task: Global CSS Variables
    - [ ] Update `app/globals.css` to define dark mode color variables for the "Sophisticated Studio" palette.
- [ ] Task: Conductor - User Manual Verification 'Core Layout & Navigation' (Protocol in workflow.md)

## Phase 3: Dashboard & High-Level Components
- [ ] Task: Update Stat Cards & Counters
    - [ ] Apply `dark:` classes to `Card` and `AnimatedCounter` components.
    - [ ] Ensure "Concept Blue" accents remain vibrant against dark backgrounds.
- [ ] Task: Update Recent Activity Feed
    - [ ] Apply `dark:` classes to activity items and icons.
    - [ ] Refine "Vault" distinction styling for dark mode.
- [ ] Task: Conductor - User Manual Verification 'Dashboard & High-Level Components' (Protocol in workflow.md)

## Phase 4: Data Views & Management
- [ ] Task: Update Client & Program Roster
    - [ ] Apply `dark:` classes to `ClientCard` and tab triggers.
    - [ ] Implement glassmorphism effects for cards in dark mode.
- [ ] Task: Update Dialogs & Form Elements
    - [ ] Apply `dark:` classes to `DialogContent`, `Input`, `Label`, and `Button`.
    - [ ] Ensure focus states and validation errors are highly visible in dark mode.
- [ ] Task: Conductor - User Manual Verification 'Data Views & Management' (Protocol in workflow.md)

## Phase 5: Final Polish & Verification
- [ ] Task: Visual Audit & Edge Cases
    - [ ] Verify all modals, popovers, and tooltips are themed correctly.
    - [ ] Check mobile responsiveness and touch interactions in dark mode.
- [ ] Task: Conductor - User Manual Verification 'Final Polish & Verification' (Protocol in workflow.md)
