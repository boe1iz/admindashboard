# Specification: Training Day Deletion Guard

## Overview
This track implements a strict operational guard for Training Days within a Program. To prevent accidental data loss and maintain structural integrity, a Day can only be deleted if it contains zero workouts. This guard is enforced both in the User Interface and within the application logic to prevent unauthorized bypass.

## Functional Requirements
- **UI Guard (Visual)**: The delete button for a Training Day will be disabled if the day has one or more workouts.
- **UI Feedback**: A tooltip or hover state will explain why the delete button is disabled: "Cannot delete a day that contains workouts. Please remove all workouts first."
- **Operational Guard (Logic)**: Before executing a deletion command in the database, the system must perform a fresh query to verify the workout count is zero.
- **Error Handling**: If a deletion is attempted on a non-empty day (e.g., via UI bypass), the system will block the operation and display a toast error message.

## Technical Requirements
- **Verification Logic**: Implement a pre-deletion check that queries the `workouts` subcollection for the target `day_id`.
- **UI State**: Leverage the existing `workouts` state within the `DaySection` to dynamically disable the delete trigger.
- **Security**: Ensure the deletion function is idempotent and performs the count check as an atomic-style verification before sending the `deleteDoc` command.

## Acceptance Criteria
1. The delete button is disabled for any day that has at least one workout.
2. The delete button is enabled for days with zero workouts.
3. Attempting to delete a non-empty day (simulated bypass) results in a "Failed to delete" toast and no database change.
4. Successful deletion of an empty day results in a success toast and immediate UI update.

## Out of Scope
- Global Firestore Security Rules (enforcement is handled via application logic for this track).
- Automatic cascading deletion of workouts when a day is deleted.
