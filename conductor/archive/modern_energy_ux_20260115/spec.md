# Specification: Modern Energy UX Overhaul

## Overview
This track involves a comprehensive design system overhaul to transform the application's UX into a "Monochromatic Sleek" and "Energetic" experience. The current design will be replaced with a sophisticated semidark theme using high-contrast typography, glassmorphism, and dynamic animations to create a high-performance, athletic vibe.

## Functional Requirements
- **Theme Overhaul (Semidark)**:
    - Implement a global palette centered around sophisticated dark-greys (`#121212`, `#1E1E1E`) instead of pure black.
    - Use high-contrast white and silver typography.
    - Use sharp Concept Blue (`#0057FF`) only for critical accents and primary actions.
- **Glassmorphism & Depth**:
    - Apply semi-transparent backgrounds with `backdrop-blur` to the Sidebar and main dashboard Cards.
    - Introduce subtle dark-to-light gradients on cards to enhance depth.
- **Energetic Interactions**:
    - **Micro-interactions**: Hover effects on all cards (subtle scaling, glow) and buttons.
    - **Animated Stats**: Dashboard counters (Clients, Concepts, Gear) will animate from 0 to their current value on load.
    - **Interactive Pulse**: Enhance the live connection indicator with a modern glow animation.
    - **Route Transitions**: Implement smooth "fade and slide" transitions between pages.
- **Typography**:
    - Refine font hierarchies using bold, athletic weights (Inter/System Sans with 900 weight for headings).

## Technical Requirements
- **Animation Engine**: Integrate and use `framer-motion` for all transitions and micro-interactions.
- **Styling**: Utilize Tailwind CSS for glassmorphism utilities and gradient definitions.
- **Performance**: Ensure animations are hardware-accelerated and do not impact TTI (Time to Interactive).

## Acceptance Criteria
1. Global background is a consistent dark-grey semidark theme.
2. Sidebar and main cards feature glassmorphism effects.
3. Dashboard stat cards animate their numbers on initial render.
4. Live connection pulse has a modern "glow" effect.
5. Navigation between /dashboard, /programs, /clients, and /inventory feels fluid with slide transitions.
6. Contrast ratios meet accessibility standards for high-contrast white-on-dark-grey.

## Out of Scope
- Functional changes to database logic or collection structures.
- Complete rebranding (logo change).
