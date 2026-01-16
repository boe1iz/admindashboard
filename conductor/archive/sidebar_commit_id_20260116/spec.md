# Specification: Sidebar Commit ID Display

## Overview
This track adds the latest Git commit ID to the sidebar of the Admin Dashboard. This provides a clear, build-specific identifier for debugging and version tracking directly within the user interface.

## Functional Requirements
- **Data Source**: The commit ID must be retrieved at build time using `git rev-parse --short HEAD`.
- **Display Location**: The ID should be displayed in the Sidebar component, positioned directly below the "Admin Dashboard V2.0" text.
- **Formatting**:
    - Prefix: "Commit: "
    - ID: 7-character short SHA.
    - Example: `Commit: a1b2c3d`
- **Styling**:
    - Small, monospace font.
    - Muted/subtle color consistent with the "Sophisticated Studio" aesthetic.
    - Positioned as a subtitle on a new line.

## Technical Requirements
- **Build-time Integration**: Create a script or update the build process (e.g., `next.config.ts` or a pre-build script) to capture the current Git SHA and make it available to the frontend.
- **File-based Storage**: Store the SHA in a generated file (e.g., `lib/version.json` or similar) that is ignored by Git but generated during build/start.
- **Component Update**: Modify `components/Sidebar.tsx` to import and render the commit ID.

## Acceptance Criteria
1. The Sidebar displays the correct short Git SHA from the current branch.
2. The display follows the "Commit: [sha]" format.
3. The styling is subtle and does not distract from the main dashboard navigation.
4. The ID updates automatically when a new build is triggered after a commit.

## Out of Scope
- Displaying the full commit message or author.
- Linking the commit ID to a Git hosting provider (e.g., GitHub).
- Real-time updates without a rebuild (since the SHA is fixed at build time).
