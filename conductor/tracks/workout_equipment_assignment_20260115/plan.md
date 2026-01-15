# Plan: Workout Equipment Assignment

This plan outlines the integration of facility equipment selection into the workout creation and editing lifecycle, ensuring a clear operational manifest for training sessions.

## Phase 1: Selection Infrastructure
- [x] Task: Create Multi-Select Combobox Component [0dac1c5]
    - [x] Write failing test for multi-select state management and search filtering
    - [x] Implement `MultiSelectCombobox` using shadcn/ui Popover and Command primitives
- [x] Task: Equipment Data Fetching Logic [161b909]
    - [x] Write failing test for fetching active equipment from Firestore
    - [x] Implement `useEquipment` hook or utility to provide gear options to dialogs
- [ ] Task: Conductor - User Manual Verification 'Selection Infrastructure' (Protocol in workflow.md)

## Phase 2: Creation & Update Integration
- [ ] Task: Integrate Equipment into CreateWorkoutDialog
    - [ ] Write failing test for saving workout document with equipment IDs
    - [ ] Update form schema and UI to include the new multi-select field
- [ ] Task: Integrate Equipment into EditWorkoutDialog
    - [ ] Write failing test for loading existing equipment data into the form
    - [ ] Implement state initialization and update logic for assigned gear
- [ ] Task: Conductor - User Manual Verification 'Creation & Update Integration' (Protocol in workflow.md)

## Phase 3: Visual Display & Consistency
- [ ] Task: Render Equipment Tags on WorkoutCard
    - [ ] Write failing test for conditional rendering of gear badges
    - [ ] Update `WorkoutCard` component to display assigned equipment names as sleek silver tags
- [ ] Task: Visual QA & Mobile Responsiveness
    - [ ] Verify that the multi-select interaction and tag layout work correctly on mobile devices
- [ ] Task: Conductor - User Manual Verification 'Visual Display & Consistency' (Protocol in workflow.md)
