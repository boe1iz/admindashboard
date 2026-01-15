# Specification: Command Center (Dashboard)

## Overview
The Dashboard is the central hub of the ON3 Athletics Admin Dashboard. it provides real-time visibility into system health and key business metrics.

## Features
### 1. Real-time Stat Cards
- **Active Athletes**: Count of `clients` where `is_active == true`.
- **Concepts**: Count of `programs` where `is_active == true`.
- **Operational Gear**: Count of `equipment` where `is_active == true`.
- **Safe Vault**: Total count of archived programs, clients, and gear.

### 2. Connection Pulse
- A visual indicator (blinking green dot) that shows if the Firestore listener is active.

### 3. Recent Activity Feed
- List of the last 5 documents in the `assignments` collection, ordered by `assigned_at` desc.
- Display: Athlete name (joined) and Program name.

### 4. Quick Actions
- Large action buttons:
    - "Build Concept" -> Navigates to `/programs`.
    - "Onboard Athlete" -> Navigates to `/athletes` (placeholder for now).

## Technical Requirements
- Use `onSnapshot` for real-time counts.
- Use `shadcn/ui` Cards and Lucide icons.
- Implement a Sidebar or Navigation bar to access this page.
