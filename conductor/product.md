# Initial Concept

Recreate the 13Concept Admin Dashboard using Next.js, following the "Elite Performance" aesthetic and business logic defined in the NEXTJS_RECREATION_GUIDE.md.

Key aspects:
- **Framework**: Next.js 14+ (App Router), Tailwind CSS, Lucide-react.
- **Backend**: Firebase (Auth, Firestore).
- **Core Features**:
    - Command Center (Dashboard) with real-time stats.
    - Program Management (Active/Archived).
    - Training Sequence Builder (Video player, reordering).
    - Athlete Roster (Assignment logic).
    - Equipment Inventory.
- **Design**: Dark/Contrast "Athletic" vibe.

# Product Guide: 13Concept Admin Dashboard

## Product Vision
To recreate the 13Concept Admin Dashboard as a high-performance Next.js 14 application that provides administrators and assistant coaches with an "Elite Performance" interface. The system serves as the central hub for managing training programs, athletes, and equipment with full functional parity to the original Firebase system and real-time synchronization.

## Target Users
- **Administrators**: Primary owners with full system access.
- **Assistant Coaches**: Collaborators with equal operational rights, including the ability to edit, archive, and delete content.

## Business Goals
- **Full Functional Parity**: Replicate 100% of the logic from the original system, specifically the "Archive, Don't Delete" philosophy.
- **Modernized Performance**: Use Next.js 14 App Router and shadcn/ui to provide a faster, more accessible interface.
- **Operational Reliability**: Real-time sync via Firebase to ensure all coaches see the same data without refreshing.

## Key Features & Logic

### 1. Program Management & Sequence Builder (High Priority)
- **Dual View**: "Operational" (Active) and "Archived Vault" tabs.
- **Sequence Logic**: First-in, first-shown exercise logic with manual `order_index` swapping.
- **Pricing Engine**: Conditional logic for "Free" vs "Paid" status.
- **Deep Copy**: One-click duplication of entire programs including sub-collections (days/workouts).
- **Deletion Rule**: Days can only be deleted if they contain zero workouts.

### 2. Command Center (Dashboard)
- **Real-time Stat Cards**: Active Athletes, Concepts, Operational Gear, and Vault counts.
- **Connection Pulse**: Visual indicator showing active Firestore connection status.
- **Recent Activity**: Feed of the last 5 athlete assignments.

### 3. Athlete Roster & Assignment
- Lifecycle Management: Card-based grid roster with Operational/Archived tabs.
- Program Tags: Inline assignment viewing with quick "unassign" capabilities.
- Assignment Guard: Logic preventing a program from being assigned to the same athlete twice.

### 4. Equipment Inventory
- **Multi-Select Tagging**: Ability to link multiple gear items to a single workout.
- **Lifecycle Management**: Dual-tab view ("Operational" and "Archived Vault") for gear.
- **Integrity Check**: Archived gear remains labeled in old workouts but is hidden from new selections.
- **Archive, Don't Delete**: Focus on deactivating gear rather than permanent removal.

## Technical Specifications & UI
- **Visual Vibe**: "Elite Performance" (Concept Blue: `#0057FF`, Athletic Black: `#0F172A`).
- **UI Components**: shadcn/ui, Lucide-react icons, 40px border-radius cards.
- **Interaction**: Framer Motion for modal/tab transitions.
- **Optimistic UI**: Immediate local state updates for reordering/assigning.

## Non-Functional Requirements
- **High Mobile Responsiveness**: Full administration capability on mobile devices.
- **Security**: Mandatory password change on first login (`passwordChanged` flag).