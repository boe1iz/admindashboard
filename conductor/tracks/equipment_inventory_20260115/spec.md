# Specification: Equipment Inventory Page

## Overview
This track involves creating the Equipment Inventory management page. The system will allow administrators and coaches to manage the list of gear available for training programs, following the "Elite Performance" aesthetic and the project's "Archive, Don't Delete" philosophy. It will integrate with the existing Firestore `equipment` collection.

## Functional Requirements
- **Tabbed Interface**: Dual-tab view ("Operational" for active gear, "Archived Vault" for archived gear).
- **Equipment List**: 
    - Real-time synchronization with Firestore `equipment` collection.
    - Display equipment names and creation dates.
    - Search functionality to filter items by name within the active tab.
- **Management Actions**:
    - **Create**: Add new equipment via a dialog.
    - **Edit**: Rename equipment via a dialog.
    - **Archive/Restore**: Toggle the `is_active` status of equipment.
- **Default Seeding**: A one-click button to import a standard set of gym equipment.

## Technical Requirements
- **Data Model**:
  - `name`: string
  - `is_active`: boolean
  - `createdAt`: timestamp
- **Components**:
  - Use `shadcn/ui` for Dialogs, Tabs, Buttons, and Inputs.
  - Implement Optimistic UI updates for status toggles and deletions.
- **Routing**: New page at `/inventory`.

## Acceptance Criteria
1. User can navigate to `/inventory` via the Sidebar.
2. "Operational" tab shows only items where `is_active` is true.
3. "Vault" tab shows only items where `is_active` is false.
4. Adding an item immediately updates the list (Optimistic UI).
5. Seeding button populates the database with default gear if they don't already exist.
6. Search bar correctly filters the visible list.

## Out of Scope
- Integration of equipment into the Workout/Sequence builder (will be handled in a separate track).
- Image uploads for equipment.
