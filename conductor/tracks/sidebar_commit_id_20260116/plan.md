# Plan: Sidebar Commit ID Display

This plan outlines the implementation of a build-time Git commit SHA display in the dashboard sidebar, providing version visibility for the "Elite Performance" interface.

## Phase 1: Build-time Git SHA Extraction [checkpoint: cd415d1]
- [x] Task: Create Git SHA extraction script [ae3856d]
    - [x] Create `scripts/generate-version.mjs` to run `git rev-parse --short HEAD`.
    - [x] Ensure the script writes `{ "commitId": "..." }` to `lib/version.json`.
    - [x] Add `lib/version.json` to `.gitignore`.
- [x] Task: Integrate script into build lifecycle [ae3856d]
    - [x] Update `package.json` to run the script before `dev` and `build` commands.
    - [x] Verify that `lib/version.json` is generated correctly on `npm run dev`.
- [x] Task: Conductor - User Manual Verification 'Build-time Git SHA Extraction' (Protocol in workflow.md)

## Phase 2: UI Implementation
- [ ] Task: Update Sidebar Component
    - [ ] Write failing tests (Red Phase) in `tests/SidebarVersion.test.tsx` to check for "Commit: [sha]" text.
    - [ ] Implement the UI changes in `components/Sidebar.tsx` to import and display the ID.
    - [ ] Apply "Sophisticated Studio" styling (muted, monospace, positioned below title).
    - [ ] Run tests and verify they pass (Green Phase).
- [ ] Task: Conductor - User Manual Verification 'UI Implementation' (Protocol in workflow.md)
