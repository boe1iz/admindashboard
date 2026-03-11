# Implementation Plan: Client iOS App (MVP)

## Phase 1: Project Setup & Infrastructure [checkpoint: 6fe48bb]
- [x] Task: Initialize Standalone Flutter Project [372aeda]
    - [x] Create `on3athletics_client` directory.
    - [x] Run `flutter create` with iOS focus.
    - [x] Configure `pubspec.yaml` with necessary dependencies (firebase_auth, cloud_firestore, provider/bloc).
- [x] Task: Firebase Integration Setup [08d2b75]
    - [x] Add iOS app to existing Firebase project. (Manual/User Check)
    - [x] Configure `GoogleService-Info.plist`. (Manual/User Check)
    - [x] Implement a basic `FirebaseService` class.
- [x] Task: Conductor - User Manual Verification 'Project Setup' (Protocol in workflow.md) [6fe48bb]

## Phase 2: Authentication & User Onboarding
- [ ] Task: Implement Authentication Service
    - [ ] Write tests for login/logout logic.
    - [ ] Implement Firebase Email/Password authentication.
- [ ] Task: Create Login Screen
    - [ ] Design UI following iOS Human Interface Guidelines.
    - [ ] Implement login form and error handling.
- [ ] Task: Conductor - User Manual Verification 'Authentication' (Protocol in workflow.md)

## Phase 3: Core Workout Engine
- [ ] Task: Data Models & Firestore Repository
    - [ ] Define models for `Program`, `Workout`, and `Exercise`.
    - [ ] Write tests for data fetching from Firestore.
    - [ ] Implement repository to fetch assigned programs for the current user.
- [ ] Task: Workout List & Detail Views
    - [ ] Create screen to list assigned programs.
    - [ ] Create screen to view exercises within a workout sequence.
- [ ] Task: Integrated Video Player
    - [ ] Implement video playback component for exercise demonstrations.
- [ ] Task: Conductor - User Manual Verification 'Core Engine' (Protocol in workflow.md)

## Phase 4: Workout Logging & Progress
- [ ] Task: Workout Logging Interface
    - [ ] Write tests for logging reps and weights.
    - [ ] Implement input fields for exercise tracking.
    - [ ] Implement "Complete Workout" logic with Firestore sync.
- [ ] Task: Progress Dashboard
    - [ ] Create simple UI to view workout history and summary stats.
- [ ] Task: Conductor - User Manual Verification 'Logging & Progress' (Protocol in workflow.md)
