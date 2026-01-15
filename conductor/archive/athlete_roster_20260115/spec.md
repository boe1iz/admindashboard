# Specification: Athlete Roster & Program Assignment

## Overview
Implement the Athlete Roster management system, allowing admins to onboard athletes, manage their active status (Archive/Restore), and assign/unassign training programs.

## Functional Requirements

### 1. Athlete List View
- **Dual Tabs**: "Operational" (Active) and "Archived Vault" (Archived).
- **Active List**: Displays cards for active athletes with their name, email, and current program tags.
- **Archived List**: Displays grayscale/low-opacity cards for archived athletes with "Restore" functionality.
- **Real-time Sync**: Uses Firestore `onSnapshot` for live updates.

### 2. Onboarding & Management
- **Create Athlete**: A dialog/form to add a new athlete (Name, Email).
- **Archive/Restore**: Toggle the `is_active` flag for athletes.
- **Search/Filter**: Search athletes by name or email.

### 3. Program Assignment (Manage Programs)
- **Manage Programs Dialog**: A modal triggered from the athlete card.
- **Program Tags**: Visual indicators of assigned programs with a "Close" (x) button to unassign.
- **Assignment Logic**: A program can only be assigned once. Already assigned programs are filtered out of the selection list.
- **Searchable Dropdown**: Select from available active programs to assign to the athlete.

## Non-Functional Requirements
- **Visual Style**: High-contrast "Elite Performance" aesthetic (Slate background, Athletic Black cards).
- **Optimistic UI**: Immediate local feedback for assignments and status toggles.

## Acceptance Criteria
- [ ] Admins can create a new athlete profile.
- [ ] Athletes can be archived and restored between tabs.
- [ ] Admins can open a "Manage Programs" dialog for any athlete.
- [ ] Programs can be added via searchable dropdown and removed via tag buttons.
- [ ] Real-time updates reflect changes immediately across the dashboard.

## Out of Scope
- Athlete Detail Profile (Detailed training history/progress view).
- Equipment inventory integration (handled in a separate track).
