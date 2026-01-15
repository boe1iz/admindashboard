# Plan: Collapsible Training Days

This plan outlines the implementation of accordion-style functionality for training days, providing a cleaner overview of training programs while maintaining rapid access to workout details.

## Phase 1: Local Collapsible Logic
- [x] Task: Implement Toggable State in DaySection
    - [x] Write failing test for local expanded/collapsed state toggle
    - [x] Implement `useState` for expanded state and wrap workout list in `AnimatePresence` / `motion.div`
- [x] Task: Add Workout Count Summary to Header
    - [x] Write test verifying workout count is displayed in the header
    - [x] Update `DaySection` header to show the total number of workouts (e.g., "8 Workouts")
- [x] Task: Conductor - User Manual Verification 'Local Collapsible Logic' (Protocol in workflow.md)

## Phase 2: Global Controls & Default State
- [x] Task: Implement Default Overview State
    - [x] Write test ensuring `DaySection` defaults to collapsed on mount
    - [x] Update initial state logic to respect the "All Collapsed" requirement
- [x] Task: Add Global Expand/Collapse Toggle
    - [x] Write failing test for global state override
    - [x] Implement "Expand All" and "Collapse All" buttons in the Program header and sync with child components
- [x] Task: Conductor - User Manual Verification 'Global Controls & Default State' (Protocol in workflow.md)

## Phase 3: Visual Polish & UX
- [x] Task: Refine Accordion Animations
    - [x] Optimize Framer Motion transitions for smooth, flicker-free height changes
- [~] Task: Visual QA & Mobile Responsiveness
    - [ ] Ensure the chevron and global toggles are easily interactable on touch devices
- [ ] Task: Conductor - User Manual Verification 'Visual Polish & UX' (Protocol in workflow.md)
