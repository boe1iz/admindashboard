# Specification: Mobile Login Layout Alignment

## Overview
This track addresses a UX refinement for the login screen on mobile devices. Currently, the login card is vertically centered, which creates excessive empty space at the top of small viewports. This track will re-orient the login card to the top of the page on mobile while maintaining the centered aesthetic on tablet and desktop.

## Functional Requirements
- **Responsive Alignment**:
    - **Mobile (< 640px)**: The login card must be anchored to the top of the viewport.
    - **Tablet/Desktop (>= 640px)**: The login card must remain vertically and horizontally centered.
- **Mobile Spacing**:
    - Apply a top padding/margin of **32px** (consistent with the "Sophisticated Studio" mobile geometry) to the login card on mobile.
- **Branding Consistency**:
    - The "ON3 ATHLETICS" branding and logo must remain within the login card's internal structure.

## Visual Requirements
- Follow the "Sophisticated Studio" design language.
- Maintain the signature 24px border-radius for the card on mobile.
- Ensure no layout shifts or "jumping" occurs during the responsive transition.

## Acceptance Criteria
1. On mobile viewports (e.g., iPhone 12 Pro), the login card is positioned 32px from the top of the screen.
2. On tablet and desktop viewports, the login card remains perfectly centered in the middle of the screen.
3. The branding remains visible and correctly formatted inside the card.
4. The background (Studio Slate/White) remains consistent across all viewports.

## Out of Scope
- Modifying the login form logic or authentication flow.
- Changing the branding or color palette.
- Adding new elements to the login page.
