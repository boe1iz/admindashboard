# Product Guidelines: ON3 Athletics Admin Dashboard

## Tone & Voice
- **Professional & Command-Oriented**: All system messages and labels must be clear, direct, and authoritative. Use action-oriented verbs like "Deploy," "Onboard," and "Archive."
- **i18n Ready**: All user-facing strings must be managed through an internationalization (i18n) framework to allow for future localization, even if the initial content is English.

## Visual Identity & Design System
- **Elite Performance Aesthetic**:
    - **Primary Palette**: Concept Blue (`#0057FF`) for active states and primary actions.
    - **Backgrounds**: Studio White (`#FFFFFF`) for sidebars/cards, Studio Slate (`#F1F5F9`) for the main workspace.
    - **Dark Mode Variant**: Uses Deep Slate (`#020617`) and Zinc foundations for a high-performance, focused environment.
    - **Vault Styling**: Archived data must use grayscale and reduced opacity to visually separate it from active content.
- **Card Design**:
    - **Responsive Geometry**: Maintain a signature `40px` border-radius on desktop, automatically adapting to `24px` on mobile for optimized screen real estate.
- **Typography**:
    - Use thick font weights (Black/900) for page titles and high-level stats to emphasize authority and data-driven focus.
- **Branding**:
    - **Sidebar Identity**: The ON3 Athletics logo must be prominently placed at the top of the sidebar in high contrast.
    - **Version Visibility**: The latest Git commit ID must be visible in the sidebar footer to ensure build transparency.
    - **Coach Identity**: The Sidebar footer must clearly display the currently authenticated coach's identity and provide quick access to session management (Logout/Password Update).

## Interaction & Feedback
- **Live Sync Visualization**: All real-time data components must include a subtle "Pulse" indicator or status mark to show active connection to Firestore.
- **Data Visualization**: Charts and stats should be minimalist and high-contrast, focusing on clear data delivery without clutter.
- **Optimistic UI**: Interface actions (like reordering) should reflect changes immediately on the UI before the backend confirms successful sync.
