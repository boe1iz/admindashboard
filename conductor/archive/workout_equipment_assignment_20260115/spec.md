# Specification: Workout Equipment Assignment

## Overview
This track enables administrators and coaches to link facility equipment directly to specific workouts within a program. By integrating equipment selection into the workout creation and editing lifecycle, the system provides a clear operational "manifest" for each training session, ensuring athletes know exactly what gear is required.

## Functional Requirements
- **Integrated Selection**: Add a searchable multi-select dropdown (Combobox) to the "Create Workout" and "Edit Workout" dialogs.
- **Inventory Integration**: Fetch the list of available equipment from the existing `equipment` collection in Firestore.
- **Multi-Assignment**: Support the selection of one or more pieces of equipment for a single workout.
- **Persistent Linking**: Store the associated equipment IDs and names within the workout document to maintain an auditable link.
- **Visual Feedback**: Display assigned equipment as tags or a list within the workout card on the Program Detail page.

## Technical Requirements
- **Data Model**: Update the workout document schema to include an `equipment_ids` array and/or a nested `equipment` objects array.
- **UI Components**: Use `shadcn/ui` based components (Popovers, Commands, Badges) to implement the searchable multi-select interaction.
- **Real-time Sync**: Ensure the equipment list is fetched in real-time or cached effectively from the database.

## Acceptance Criteria
1. Coaches can search and select multiple items from the equipment inventory during workout creation.
2. Selected equipment is saved successfully to the workout in Firestore.
3. The "Edit Workout" dialog correctly populates with previously assigned equipment.
4. Assigned equipment is visible on the workout card in the Training Sequence Builder.
5. Removing an equipment tag in the edit dialog successfully updates the database.

## Out of Scope
- Creating new equipment items directly from the workout dialog (must be done in Inventory).
- Tracking equipment availability/conflicts across different athletes.
