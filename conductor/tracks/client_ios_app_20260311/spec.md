# Track Specification: Client iOS App (MVP)

## Overview
This track involves the development of a native-like iOS mobile application for ON3 Athletics clients using Flutter. The app will integrate with the existing Firebase backend managed by the `admindashboard` project to allow clients to view assigned training programs, log workouts, and track their progress.

## Functional Requirements
- **Authentication**: Email/Password login via Firebase Auth.
- **Workout Viewing**: Display active training programs, daily workout sequences, and exercise details.
- **Workout Logging**: Interface for users to input reps, weight, and completion status for each exercise.
- **Video Playback Sync**: Integrated video player to watch exercise demonstrations synced with the workout sequence.
- **Profile & Progress Tracking**: User profile management and a basic dashboard to view workout history and progress metrics.
- **Data Synchronization**: Real-time updates from Firestore to ensure the app reflects the latest program assignments from the admin dashboard.

## Non-Functional Requirements
- **Platform**: iOS (Primary target for MVP).
- **Technology**: Flutter.
- **Design System**: Native iOS Style (Human Interface Guidelines).
- **Architecture**: Standalone Flutter project located in a separate folder from the `admindashboard`.
- **Performance**: Sub-300ms perceived latency for data loading and screen transitions.

## Acceptance Criteria
- Users can successfully log in with their existing Firebase credentials.
- Users can view their currently assigned training programs.
- Exercise videos play correctly within the workout flow.
- Workout data (reps/weight) is correctly saved to Firestore and reflected in the user's history.
- The UI adheres to standard iOS interaction patterns.

## Out of Scope
- Android version (Planned for a future track).
- Third-party integrations (HealthKit, FCM, etc.) for the MVP.
- Offline mode support.
- Advanced social features or community feeds.
