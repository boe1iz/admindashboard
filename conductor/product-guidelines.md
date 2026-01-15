# Product Guidelines: 13Concept Admin Dashboard

## Tone & Voice
- **Professional & Command-Oriented**: All system messages and labels must be clear, direct, and authoritative. Use action-oriented verbs like "Deploy," "Onboard," and "Archive."
- **i18n Ready**: All user-facing strings must be managed through an internationalization (i18n) framework to allow for future localization, even if the initial content is English.

## Visual Identity & Design System
- **Elite Performance Aesthetic**:
    - **Primary Palette**: Concept Blue (`#0057FF`) for active states and primary actions.
    - **Backgrounds**: Studio White (`#FFFFFF`) for sidebars/cards, Studio Slate (`#F1F5F9`) for the main workspace.
    - **Vault Styling**: Archived data must use grayscale and reduced opacity to visually separate it from active content.
- **Card Design**:
    - **Border Radius**: Maintain a strict `40px` border-radius for all main cards to ensure consistency with the "Elite" brand signature.
- **Typography**:
    - Use thick font weights (Black/900) for page titles and high-level stats to emphasize authority and data-driven focus.
- **Branding**:
    - **Sidebar Identity**: The 13Concept logo must be prominently placed at the top of the sidebar in high contrast.

## Interaction & Feedback
- **Live Sync Visualization**: All real-time data components must include a subtle "Pulse" indicator or status mark to show active connection to Firestore.
- **Data Visualization**: Charts and stats should be minimalist and high-contrast, focusing on clear data delivery without clutter.
- **Optimistic UI**: Interface actions (like reordering) should reflect changes immediately on the UI before the backend confirms successful sync.
