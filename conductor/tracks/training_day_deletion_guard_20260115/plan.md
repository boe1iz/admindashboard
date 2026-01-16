# Plan: Training Day Deletion Guard

This plan outlines the implementation of a strict operational guard to prevent the deletion of Training Days that contain workouts, ensuring data integrity and providing clear user feedback.

## Phase 1: Operational Logic Guard [checkpoint: 0626534]
- [x] Task: Secure Deletion Logic in Program Detail [6f28964]
    - [x] Write failing test verifying that the deletion function prevents removal if workouts are detected in the subcollection
    - [x] Implement a pre-deletion check in the `deleteDay` function within `app/programs/[id]/page.tsx` that performs a fresh query for workouts
- [x] Task: Conductor - User Manual Verification 'Operational Logic Guard' (Protocol in workflow.md) [534e8e8]

## Phase 2: User Interface Guard & Feedback
- [x] Task: Dynamic Deletion Control in UI [99ba2ca]
    - [x] Write failing test ensuring the delete button is disabled and visually distinct when the workout list is not empty
    - [x] Update the `DaySection` component to disable the `ConfirmDeleteDialog` trigger based on the local `workouts.length`
- [ ] Task: User Feedback & Tooltip
    - [ ] Add a tooltip or explanatory text to the disabled delete button: "Cannot delete a day that contains workouts. Please remove all workouts first."
    - [ ] Verify that a descriptive toast error appears if a deletion attempt fails the logic check
- [ ] Task: Conductor - User Manual Verification 'User Interface Guard & Feedback' (Protocol in workflow.md)
