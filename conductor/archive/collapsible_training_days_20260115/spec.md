# Specification: Collapsible Training Days

## Overview
This track introduces "Accordion" functionality to the Program Detail page, allowing coaches to collapse and expand individual training days. This is essential for managing programs with many days and workouts, providing a clean overview while maintaining quick access to session details.

## Functional Requirements
- **Manual Toggle**: Each day header will include a Chevron (Up/Down) icon to explicitly toggle the visibility of its workouts.
- **Global Controls**: A "Manifest Toggle" (Expand/Collapse All) will be added to the Program header to manage all days simultaneously.
- **Collapsed Summary**: When a day is collapsed, its header will display the total number of workouts contained within (e.g., "12 Workouts").
- **Default Overview State**: All days will be collapsed by default when the Program Detail page is first loaded.
- **Visual Feedback**: Transitions between states will use smooth accordion-style animations.

## Technical Requirements
- **Animation**: Use `framer-motion`'s `AnimatePresence` and `height` transitions for smooth opening/closing.
- **State Management**: Implement a local React state to track the expanded status of each day and the global override.
- **UI Components**: Leverage `shadcn/ui` Accordion patterns or custom `framer-motion` wrappers for maximum control.

## Acceptance Criteria
1. Clicking the Chevron icon on a Day header correctly hides/shows its workout list.
2. The header shows the correct workout count when the day is collapsed.
3. The "Expand All" / "Collapse All" button at the top correctly updates all days on the page.
4. The Program Detail page loads with all days collapsed by default.
5. Transitions feel fluid and do not cause layout flickering.

## Out of Scope
- Persisting the collapsed state to the database (state is per-session).
- Drag-and-drop reordering of entire days while collapsed (to be addressed in a future track).
