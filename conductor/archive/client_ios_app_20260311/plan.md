# Implementation Plan: Client iOS App (Native Swift)

## Phase 1: Project Initialization & Firebase [checkpoint: pending]
- [ ] Task: Initialize Xcode Project in `mobile_client`
    - Create SwiftUI project: `ON3AthleticsClient`.
    - Set bundle ID and deployment target (iOS 17+).
- [ ] Task: Configure Firebase iOS SDK
    - Add Firebase via SPM (Auth, Firestore).
    - Add `GoogleService-Info.plist` (Requires user to provide or download from console).
    - Initialize Firebase in `App.swift`.
- [ ] Task: Define Core Data Models
    - Map Firestore documents to Swift `Codable` structs (`Program`, `Day`, `Workout`, `Assignment`).

## Phase 2: Authentication & Onboarding
- [ ] Task: Implement AuthService
    - Create `AuthService` using Firebase Auth.
    - Handle session state and persistent login.
- [ ] Task: Create Login View
    - Design high-performance login screen using SwiftUI.
    - Implement error handling and loading states.

## Phase 3: Program & Workout Engine
- [ ] Task: Implement Program Repository
    - Create `ProgramRepository` to fetch assignments and program details using Firestore listeners.
- [ ] Task: Dashboard & Workout List
    - Create `DashboardView` showing current active programs.
    - Create `WorkoutListView` for the daily training sequence.
- [ ] Task: Exercise Detail & Video Player
    - Create `ExerciseDetailView`.
    - Integrate `AVPlayer` or `WKWebView` for video demonstration playback.

## Phase 4: Performance Logging
- [ ] Task: Implement Logging Service
    - Create UI for inputting reps/weight.
    - Implement `LogService` to save completion data to Firestore.
- [ ] Task: Progress Tracking
    - Basic history view for previously completed workouts.

## Phase 5: UI/UX Refinement
- [ ] Task: "Elite Performance" Styling
    - Apply custom colors, fonts, and 24px/40px corner radii.
    - Implement energetic animations and transitions.
- [ ] Task: Final Verification & Testing
    - End-to-end flow testing on simulator and physical device.