# Initial Concept

Recreate the ON3 Athletics Admin Dashboard using Next.js, following the "Elite Performance" aesthetic and business logic defined in the NEXTJS_RECREATION_GUIDE.md.

Key aspects:
- **Framework**: Next.js 14+ (App Router), Tailwind CSS, Lucide-react.
- **Backend**: Firebase (Auth, Firestore).
- **Core Features**:
    - Command Center (Dashboard) with real-time stats.
    - Program Management (Active/Archived).
    - Training Sequence Builder (Video player, reordering).
    - Athlete Roster (Assignment logic).
    - Equipment Inventory.
- **Design**: "Sophisticated Studio" aesthetic (High-contrast light theme with vibrant energetic accents).

# Product Guide: ON3 Athletics Admin Dashboard

## Product Vision
To recreate the ON3 Athletics Admin Dashboard as a high-performance Next.js 14 application that provides administrators and assistant coaches with an "Elite Performance" interface. The system serves as the central hub for managing training programs, athletes, and equipment with full functional parity to the original Firebase system and real-time synchronization.

## Target Users
- **Administrators**: Primary owners with full system access.
- **Assistant Coaches**: Collaborators with equal operational rights, including the ability to edit, archive, and delete content.
- **Athletes (Clients)**: End-users who access assigned training programs, log completions, and provide feedback via the Client Portal.

## Business Goals
- **Full Functional Parity**: Replicate 100% of the logic from the original system, specifically the "Archive, Don't Delete" philosophy.
- **Modernized Performance**: Use Next.js 14 App Router and shadcn/ui to provide a faster, more accessible interface.
- **Operational Reliability**: Real-time sync via Firebase to ensure all coaches see the same data without refreshing.

## Key Features & Logic

### 1. Program Management & Sequence Builder (High Priority)
- **Dual View**: "Operational" (Active) and "Archived Vault" tabs.
- **Sequence Logic**: First-in, first-shown exercise logic with manual `order_index` swapping.
- **Equipment Integration**: Ability to assign multiple facility gear items to specific workouts during creation or editing.
- **Collapsible Structure**: Accordion-style training days with mass-action global toggles for efficient sequence management.
- **Pricing Engine**: Conditional logic for "Free" vs "Paid" status.
- **Deep Copy**: One-click duplication of entire programs including sub-collections (days/workouts).
- **Data Integrity Guard**: Training Days can only be deleted if they contain zero workouts.
- **Archive, Don't Delete**: Primary philosophy for athletes, gear, and programs.

### 2. Command Center (Dashboard)
- **Real-time Stat Cards**: Active Athletes, Concepts, Operational Gear, and Vault counts.
- **Connection Pulse**: Visual indicator showing active Firestore connection status.
- **Recent Activity**: Feed of the last 5 relevant actions (Onboarding, Assignments, Status Changes).

### 3. Athlete Roster & Assignment
- **Lifecycle Management**: Card-based grid roster with Operational/Archived tabs.
- **Program Tags**: Inline assignment viewing with quick "unassign" capabilities.
- **Assignment Guard**: Logic preventing a program from being assigned to the same athlete twice.

### 4. Equipment Inventory
- **Multi-Select Tagging**: Ability to link multiple gear items to a single workout.
- **Lifecycle Management**: Dual-tab view ("Operational" and "Archived Vault") for gear.
- **Integrity Check**: Archived gear remains labeled in old workouts but is hidden from new selections.
- **Archive, Don't Delete**: Focus on deactivating gear rather than permanent removal.

### 5. Client Portal & Athlete Engagement
- **Personalized Home**: Mobile-first landing page with quick access to assigned programs, active workouts, and history.
- **Training Access**: Read-only access to assigned high-performance training sequences, including video playback.
- **Progress Tracking**: "Mark as Complete" functionality that logs workout sessions to a persistent training history.
- **Coach Feedback Loop**: Integrated feedback system allowing athletes to share session insights directly with their coaches.
- **Account Management**: Self-service profile synchronization and secure password management.

### 6. Role-Based Access Control (RBAC) & Unified Auth
- **Unified Entry**: Single login/registration interface for all user roles.
- **Auto-Role Detection**: Automatic identification of user role (Admin vs Client) upon authentication, triggering immediate redirection to the appropriate interface.
- **Route Protection**: Strictly enforced route-based authorization preventing unauthorized access to administrative pages.
- **Public Registration**: Seamless onboarding flow for new athletes with automated Firestore profile synchronization.
- **Defense in Depth**: Firestore Security Rules specifically tailored to allow secure self-management for athletes while maintaining full oversight for admins.

## Technical Specifications & UI
- **Visual Vibe**: "Sophisticated Studio" (Concept Blue: `#0057FF`, Studio Grey: `#F1F5F9`, with a High-Performance Dark Mode variant).
- **UI Components**: shadcn/ui, Lucide-react icons, 40px border-radius cards.
- **Build Tracking**: Integrated Git SHA display in sidebar for version auditability.
- **Theme Support**: Integrated Light and Dark mode switching with persistent user preference.
- **Interaction**: Framer Motion for modal/tab transitions.
- **Optimistic UI**: Immediate local state updates for reordering/assigning.

## Non-Functional Requirements
- **Mobile-First Accessibility**: Full administrative control optimized for touch interfaces and small screens.
- **Authenticated Access**: Secure coach and administrator access via Firebase Email/Password authentication.
- **Session Persistence**: Robust session management ensuring seamless transitions across tabs and browser sessions, with browser-level closure protection and idle/absolute timeouts.
