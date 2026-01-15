# Plan: Equipment Inventory Page

This plan outlines the implementation of the Equipment Inventory page, following the TDD workflow and the "Archive, Don't Delete" philosophy.

## Phase 1: Foundation & Data Layer [checkpoint: 3cb2eb4]
- [x] Task: Initialize Inventory Page and Navigation (4fbe261)
- [x] Task: Equipment Data Service (6ce83eb)
- [x] Task: Conductor - User Manual Verification 'Foundation & Data Layer' (Protocol in workflow.md) (3cb2eb4)

## Phase 2: Inventory UI & Listing [checkpoint: 8ef520c]
- [x] Task: Tabbed Layout & Search State (d04c84d)
- [x] Task: Equipment List Rendering (d04c84d)
- [x] Task: Conductor - User Manual Verification 'Inventory UI & Listing' (Protocol in workflow.md) (8ef520c)

## Phase 3: CRUD Operations
- [ ] Task: Create Equipment
    - [ ] Write failing tests for creation dialog and database submission
    - [ ] Implement CreateEquipmentDialog component
- [ ] Task: Edit & Status Toggling
    - [ ] Write failing tests for editing name and toggling `is_active`
    - [ ] Implement Edit dialog and Archive/Restore functionality with Optimistic UI
- [ ] Task: Delete Functionality
    - [ ] Write failing tests for permanent deletion
    - [ ] Implement Delete confirmation dialog and Firestore delete call
- [ ] Task: Conductor - User Manual Verification 'CRUD Operations' (Protocol in workflow.md)

## Phase 4: Seeding & Finalization
- [ ] Task: Default Seeding Feature
    - [ ] Write failing tests for equipment seeding logic
    - [ ] Implement Seeding button and Firestore batch update
- [ ] Task: Final Polish & Mobile Optimization
    - [ ] Write failing tests for mobile responsive layout
    - [ ] Polish UI transitions and ensure full mobile responsiveness
- [ ] Task: Conductor - User Manual Verification 'Seeding & Finalization' (Protocol in workflow.md)
