# Specification: Recent Activity Correction

## Overview
This track fixes and enhances the "Recent Activity" feed on the Command Center (Dashboard). Currently, the feed does not accurately reflect all relevant client interactions. This update ensures that assigning clients to programs and changes in client status (Archiving/Restoring) are correctly captured and displayed.

## Functional Requirements
- **Unified Activity Feed**: The feed must display the 5 most recent relevant actions across the system.
- **Assignment Tracking**: Display an entry when a client is assigned to a program.
    - Format: `[Client Name] was assigned to [Program Name]`
    - Icon: `Plus` or `UserPlus`
- **Status Tracking**: Display an entry when a client's status changes.
    - Format: `[Client Name] was archived` or `[Client Name] was restored`
    - Icon: `Archive` or `ArchiveRestore`
- **Visual Elements**:
    - Each entry must include a relative timestamp (e.g., "5 mins ago").
    - Action-specific icons from `lucide-react`.
    - High-performance "Sophisticated Studio" styling consistent with the dashboard.

## Technical Requirements
- **Data Retrieval**: Perform a single Firestore query to a new `activity` collection.
- **Activity Logging**: 
    - Create a log entry whenever a client is: Onboarded, Assigned, Unassigned, Archived, or Restored.
    - Fields: `type`, `client_name`, `program_name` (if applicable), `timestamp`.
- **Sorting Logic**: Sort the `activity` collection by `timestamp` in descending order.
- **Real-time Updates**: The dashboard will listen to the `activity` collection for the 5 most recent items.

## Acceptance Criteria
1. The Recent Activity feed displays the 5 most recent activities.
2. Entries are permanent: Unassigning a program does not remove the "Joined" entry; it adds an "Unsubscribed" entry.
3. All actions (Onboard, Assign, Unassign, Archive, Restore) are correctly logged and displayed immediately.

## Out of Scope
- Automated cleanup of the `activity` collection.
- Detailed activity logs for workout/program content changes.
