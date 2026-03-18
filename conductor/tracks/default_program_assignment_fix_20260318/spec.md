# Track spec.md: Default Program Assignment Fix

## Overview
The default program assignment logic is currently broken, causing incorrect assignments for all new users. This track aims to identify the root cause of the broken logic and implement a correct assignment mechanism for all new users.

## Functional Requirements
1.  **Identify Broken Logic**: Locate and analyze the existing code responsible for assigning default programs to new users.
2.  **Correct Assignment Mechanism**: Implement a fix that ensures all new users receive the correct default programs upon registration.
3.  **Prevent Incorrect Assignments**: Ensure that no incorrect or unintended program assignments are made for new users.

## Acceptance Criteria
- [ ] New users receive the correct default programs immediately upon registration.
- [ ] No incorrect or additional programs are assigned to new users.
- [ ] Existing assignment logic is verified to be consistent with the fix.
- [ ] All automated tests related to user registration and assignment pass.

## Out of Scope
- Modifying the core program management or sequence builder logic.
- UI changes in the Admin Dashboard or Client Portal, unless directly required for verifying the fix.
