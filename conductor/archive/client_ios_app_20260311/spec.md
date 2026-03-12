# Track Specification: Client iOS App (Native Swift)

## Overview
This track involves the development of a native iOS mobile application for ON3 Athletics clients using Swift and SwiftUI. The app will integrate with the existing Firebase backend managed by the `admindashboard` project, allowing clients to view assigned training programs, log workouts, and track their performance.

## Functional Requirements
- **Authentication**: Email/Password login via Firebase Auth (Client-facing).
- **Program Dashboard**: Display currently assigned training programs and the current day's focus.
- **Training Sequence**: Step-by-step workout view showing exercises, instructions, and equipment.
- **Performance Logging**: Interface for users to log reps, weight, and completion for each exercise.
- **Video Player**: Native AVPlayer integration for exercise demonstration videos (supporting YouTube/Vimeo embeds or direct links).
- **Real-time Sync**: Use Firestore `addSnapshotListener` to receive program updates and assignments immediately.
- **Profile & Settings**: Manage user profile and session (Logout/Password change).

## Non-Functional Requirements
- **Platform**: iOS 17.0+ (SwiftUI First).
- **Language**: Swift 6.
- **Design System**: "Elite Performance" aesthetic adapted for iOS (following Human Interface Guidelines).
- **Architecture**: MVVM (Model-View-ViewModel).
- **Dependency Management**: Swift Package Manager (SPM).
- **Performance**: High-speed interaction with optimistic UI patterns.

## Data Schema (Shared with Admin)
- **`clients`**: Authenticated user record.
- **`programs` / `days` / `workouts`**: Read-only access to training content.
- **`assignments`**: Links client to programs and tracks `current_day_number`.
- **`logs` (New)**: Sub-collection per client/assignment to store workout performance.

## Acceptance Criteria
- Clients can log in with their credentials.
- Assigned programs are visible and updated in real-time.
- Workout sequences can be completed and logged.
- Videos play smoothly within the native interface.
- UI maintains the high-contrast athletic brand identity.

## Out of Scope
- Android version.
- Offline-first data persistence (requires active Firebase connection for MVP).
- Advanced HealthKit integration (planned for future iteration).