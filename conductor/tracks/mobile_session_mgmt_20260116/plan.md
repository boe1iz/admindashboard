# Plan: Mobile Session Management Visibility

This plan outlines the implementation of a dedicated mobile User Profile sheet, ensuring session management actions are accessible on small screens while maintaining the "Elite Performance" aesthetic.

## Phase 1: Mobile Header Enhancements
- [x] Task: Update MobileNav with User Profile Trigger [794c16c]
    - [x] Write failing tests (Red Phase) in `tests/MobileAuth.test.tsx` to verify the user icon visibility.
    - [x] Modify `components/MobileNav.tsx` to add a `User` icon on the far right of the sticky header.
    - [x] Verify the header layout remains balanced on small screens.
- [x] Task: Implement UserSettingsSheet Component [794c16c]
    - [x] Create a new `UserSettingsSheet` within `components/MobileNav.tsx` or as a separate component.
    - [x] Use shadcn `Sheet` or `Drawer` for a polished mobile slide-over.
    - [x] Integrate user email display, `ChangePasswordDialog`, and `signOut` logic.
    - [x] Integrate `ThemeToggle` into the sheet.
- [ ] Task: Conductor - User Manual Verification 'Mobile Header' (Protocol in workflow.md)

## Phase 2: Refinement & Verification
- [ ] Task: Functional Verification on Mobile
    - [ ] Test logout flow on a mobile viewport.
    - [ ] Test theme toggling within the new mobile sheet.
    - [ ] Test Change Password flow within the new mobile sheet.
- [ ] Task: Cross-Device Consistency Audit
    - [ ] Ensure desktop Sidebar footer remains visible and functional.
    - [ ] Verify no layout shifts occur when opening the mobile user settings.
- [ ] Task: Conductor - User Manual Verification 'Refinement' (Protocol in workflow.md)
