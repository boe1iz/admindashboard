# Plan: Modern Energy UX Overhaul

This plan outlines the design system transformation to a "Monochromatic Sleek" and "Energetic" experience, utilizing glassmorphism and Framer Motion.

## Phase 1: Foundations & Design System [checkpoint: 77fdc73]
- [x] Task: Setup Animation Engine [807d40d]
    - [x] Write failing test to verify framer-motion dependency (simulated)
    - [x] Implement: Add `framer-motion` to package.json and verify installation
- [x] Task: Define Global Design Tokens [b7270d6]
    - [x] Update `tailwind.config.ts` with sophisticated dark-grey palette and glassmorphism utilities
    - [x] Refine `globals.css` for athletic typography and monochromatic base
- [x] Task: Conductor - User Manual Verification 'Foundations & Design System' (Protocol in workflow.md)

## Phase 2: Core Layout & Transitions [checkpoint: 86c24c3]
- [x] Task: Modernize Sidebar Navigation [b32a996]
    - [x] Write failing tests for Sidebar modernized styles
    - [x] Implement glassmorphism, background-blur, and hover micro-interactions on nav links
- [x] Task: Implement energetic Route Transitions [0e84344]
    - [x] Implement smooth "fade and slide" transitions between pages using Framer Motion
- [x] Task: Conductor - User Manual Verification 'Core Layout & Transitions' (Protocol in workflow.md)

## Phase 3: Energetic Command Center
- [x] Task: Implement Animated Stat Counters [596a4dc]
    - [x] Write failing tests for counter animation logic
    - [x] Create `AnimatedCounter` component and integrate into Dashboard stat cards
- [x] Task: Modernize Dashboard Cards & Pulse [e6deb6e]
    - [x] Implement glassmorphism and subtle gradients on stat cards
    - [x] Enhance live connection indicator with a modern "glow" animation
- [x] Task: Conductor - User Manual Verification 'Energetic Command Center' (Protocol in workflow.md)

## Phase 4: Component Polish & Consistency
- [x] Task: Refine Card Interactions (Programs, Clients, Inventory) [b088f43]
    - [x] Implement consistent monochromatic styling and hover scaling across all entity cards
- [x] Task: Final Visual QA & Performance [86f3bf0]
    - [x] Verify accessibility contrast ratios and mobile animation performance
- [~] Task: Conductor - User Manual Verification 'Component Polish & Consistency' (Protocol in workflow.md)
