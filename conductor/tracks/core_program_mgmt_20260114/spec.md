# Spec: Core Program Management & Training Sequence Builder

## Overview
This track implements the core engine of the ON3 Athletics Admin Dashboard. It allows administrators to create, manage, and sequence training programs with nested days and workouts.

## User Stories
- As an admin, I want to create a training program with a name, description, and pricing logic.
- As an admin, I want to organize programs into "Operational" and "Archived" states.
- As an admin, I want to build a training sequence by adding days and exercises.
- As an admin, I want to reorder exercises within a day to define the training flow.
- As an admin, I want to preview workout videos directly in the dashboard.

## Technical Requirements

### 1. Data Schema (Firestore)
- `programs` collection:
    - `name`: string
    - `description`: string
    - `price`: number (conditional on `is_free`)
    - `is_free`: boolean
    - `is_active`: boolean
    - `created_at`: timestamp
- `programs/{id}/days` sub-collection:
    - `title`: string
    - `day_number`: number
- `programs/{id}/days/{id}/workouts` sub-collection:
    - `title`: string
    - `video_url`: string
    - `duration`: string
    - `difficulty`: string
    - `equipment`: string[]
    - `instructions`: string
    - `order_index`: number

### 2. Key Logic
- **Archive System**: `is_active` flag toggle instead of deletion.
- **Day Deletion Guard**: A day cannot be deleted if it has workouts.
- **Sequence Reordering**: Logic to swap `order_index` between two workouts.
- **Deep Copy**: Logic to recursively copy a program, its days, and its workouts.
- **Video Embed**: Transform YouTube/Vimeo links into embeddable formats.

### 3. UI/UX
- **Visuals**: 40px border-radius cards, Concept Blue (`#0057FF`), Athletic Black (`#0F172A`).
- **Components**: shadcn/ui (Tabs, Dialogs, Buttons, Forms).
- **Icons**: Lucide-react.
- **Feedback**: Optimistic UI for reordering; Real-time sync indicators.
