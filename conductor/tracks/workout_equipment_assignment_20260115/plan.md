# Plan: Workout Equipment Assignment

This plan outlines the integration of facility equipment selection into the workout creation and editing lifecycle, ensuring a clear operational manifest for training sessions.

## Phase 1: Selection Infrastructure [checkpoint: acf36a3]
- [x] Task: Create Multi-Select Combobox Component [0dac1c5]
    - [x] Write failing test for multi-select state management and search filtering
    - [x] Implement `MultiSelectCombobox` using shadcn/ui Popover and Command primitives
- [x] Task: Equipment Data Fetching Logic [161b909]
    - [x] Write failing test for fetching active equipment from Firestore
    - [x] Implement `useEquipment` hook or utility to provide gear options to dialogs
- [x] Task: Conductor - User Manual Verification 'Selection Infrastructure' (Protocol in workflow.md)

## Phase 2: Creation & Update Integration
- [x] Task: Integrate Equipment into CreateWorkoutDialog [27a4215]
    - [x] Write failing test for saving workout document with equipment IDs
    - [x] Update form schema and UI to include the new multi-select field
- [x] Task: Integrate Equipment into EditWorkoutDialog [3dca524]
    - [x] Write failing test for loading existing equipment data into the form
    - [x] Implement state initialization and update logic for assigned gear
- [ ] Task: Conductor - User Manual Verification 'Creation & Update Integration' (Protocol in workflow.md)

## Phase 3: Visual Display & Consistency
- [x] Task: Render Equipment Tags on WorkoutCard [94ee47c]
    - [x] Write failing test for conditional rendering of gear badges
    - [x] Update `WorkoutCard` component to display assigned equipment names as sleek silver tags
- [~] Task: Visual QA & Mobile Responsiveness
    - [ ] Verify that the multi-select interaction and tag layout work correctly on mobile devices
- [ ] Task: Conductor - User Manual Verification 'Visual Display & Consistency' (Protocol in workflow.md)
