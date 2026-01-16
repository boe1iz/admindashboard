# Specification: Modern Dark Mode Implementation

## Overview
This track introduces a comprehensive Dark Mode for the ON3 Athletics Admin Dashboard. It transitions the "Sophisticated Studio" aesthetic into a high-performance dark environment while maintaining brand consistency and real-time operational clarity.

## Functional Requirements
- **Theme Switcher**: Implement a user-accessible toggle (using `next-themes`) to switch between Light and Dark modes.
- **Dark Mode Aesthetic**:
    - **Foundational Colors**: Deep Slate/Zinc (`slate-950`/`zinc-950`) for the main workspace.
    - **Accents**: Maintain "Concept Blue" (`#0057FF`) for primary actions and active states.
    - **Card Design**: Subtle, low-opacity borders with slightly lighter backgrounds (`slate-900`) for depth.
- **Vault (Archived) Distinction**:
    - Archived content will use a combination of dimmed grayscale, distinct border colors, and specific contrast levels to differentiate it from active operational data.
- **Persistence**: The user's theme preference must be persisted across sessions.

## Technical Requirements
- **Library**: Integrate `next-themes` for robust theme management in the Next.js App Router.
- **Tailwind Config**: Ensure `darkMode: 'class'` is correctly configured.
- **Component Updates**: Update all shadcn/ui and custom components (Sidebar, Card, Stats, Dialogs) to use `dark:` utility classes.
- **Glassmorphism**: Implement subtle transparency and backdrop-blur effects on cards in Dark Mode.

## Acceptance Criteria
1. Users can toggle between Light and Dark themes via a UI element (e.g., in the Sidebar or Header).
2. The Dark Theme follows the "Sophisticated Studio" guidelines with high-contrast slate/zinc and vibrant blue accents.
3. Archived content is clearly distinguishable from active content in both modes.
4. Layout and interaction feel "Elite" and high-performance in both themes.
5. No "flash of unstyled content" (FOUC) occurs during theme transitions.

## Out of Scope
- Redesigning the core layout or navigation structure.
- User-specific custom color palettes beyond Light/Dark modes.
