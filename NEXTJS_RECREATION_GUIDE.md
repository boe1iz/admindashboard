# 🚀 ON3 Athletics Admin Dashboard: Next.js Recreation Reference

This document contains the complete business logic, UI specifications, and technical architecture of the ON3 Athletics Admin Dashboard. Use this as a high-level "vibe" reference for recreating the app in Next.js.

## 🎨 1. Brand Identity & Visual Vibe
*   **Aesthetic**: "Elite Performance" – Professional, high-contrast, clean, and data-driven.
*   **Color Palette**:
    *   **Concept Blue**: `#0057FF` (Primary actions, active states).
    *   **Athletic Black**: `#0F172A` (Sidebar, dark cards, high-contrast text).
    *   **Slate Background**: `#F8FAFC` (Main dashboard surface).
    *   **Status Colors**: Green (Success/Live), Red (Archive/Danger), Amber (Warning).
*   **UI Components**: Large border-radius (`40px` for main cards), thick font weights (Black/900 for titles), heavy use of white space, and "Vault" styling for archived data (grayscale + opacity).

---

## 🏗️ 2. Core Architecture (Firebase Cloud)
The app uses **Firebase** for a serverless, real-time experience.

### **Authentication (Firebase Auth)**
*   **Method**: Email and Password.
*   **User Management**: Handled via the Firebase Console (Admin creates accounts).
*   **Session**: Persistent cloud session (user stays logged in until manual logout).
*   **Security Rule**: Password must be changed on first login (tracked via `passwordChanged` flag in `admin_users` collection).

### **Database Schema (Cloud Firestore)**
*   **`programs`**: Training concepts (Name, Description, Price, `is_free`, `is_active`).
    *   **Sub-collection: `days`**: Training days (Title, `day_number`).
        *   **Sub-collection: `workouts`**: Individual exercises (Title, Video URL, Duration, Difficulty, Equipment Array, Instructions, `order_index`).
*   **`clients`**: Athlete profiles (Name, Email, `is_active`).
*   **`equipment`**: Gear inventory (Name, `is_active`).
*   **`assignments`**: Many-to-Many mapping (Athlete ID, Program ID, `current_day_number`, `assigned_at`).

---

## ⚙️ 3. Page Specifications & Logic

### **A. Command Center (Dashboard)**
*   **Real-time Stats**: 4 Stat Cards tracking Active Athletes, Concepts, Operational Gear, and the Safe Vault (Archive counts).
*   **Live Sync**: Pulse indicator showing active connection to Firestore.
*   **Recent Assignments**: Feed showing the last 5 athletes to join a program.
*   **Quick Actions**: Large buttons to jump directly to "Build Concept" or "Onboard Athlete."

### **B. Program Management**
*   **Dual View (Tabs)**:
    1.  **Operational**: Large cards for active programs. Features: Edit, Duplicate (Full deep copy of days/workouts), and Archive.
    2.  **Archived Vault**: Small, high-density cards. Features: Restore to active or view historical details.
*   **Pricing Engine**: Toggle between "Free" and "Paid." Custom price field appears only if not free.

### **C. Training Sequence Builder (Inside Program)**
*   **Sequence Logic**: Workouts follow a "First-in, First-shown" logic but can be manually reordered.
*   **Manual Reordering**: Up/Down arrow buttons swap `order_index` in real-time.
*   **Deletion Rule**: A Day can ONLY be deleted if it has **zero workouts** inside.
*   **Video Player**: 
    *   Premium modal window with 16:9 aspect ratio.
    *   Auto-conversion: Transforms standard YouTube/Vimeo links into `embed` formats.
    *   Autoplay: Video starts automatically when opened but **starts muted** to bypass browser blocks.

### **D. Athlete Roster**
*   **Athlete List**: Table-style view with "Operational" and "Archived" tabs.
*   **Program Tags**: Shows all currently assigned programs next to the athlete's name with a "Close" button to unassign.
*   **Assignment Logic**: A program can only be assigned once per athlete. Already assigned programs are hidden from the selector.
*   **Detail Profile**: View an athlete's entire training history and progress (current day) in a dedicated layout.

### **E. Equipment Inventory**
*   **Multi-Select Engine**: Workouts allow selecting multiple pieces of gear (e.g., "Dumbbells" + "Bench").
*   **Defaults**: "Import Default Gear" button to seed the system with standard gym equipment.
*   **Archive Integrity**: If gear is archived, it remains visible in *old* workouts (labeled as Archived) but is hidden for *new* workouts.

---

## 📜 4. Essential Business Rules for Coding
1.  **Archive, Don't Delete**: Everything (Programs, Clients, Gear) uses an `is_active` flag. Permanent deletion is rare.
2.  **Live Listeners**: Use `onSnapshot` for every list. The user should never have to manually refresh to see new data.
3.  **Optimistic UI**: When reordering or assigning, update the local state immediately while the cloud syncs in the background.
4.  **No Text Nodes in Layout**: Ensure all text is wrapped in appropriate elements (Next.js/HTML standard) to avoid rendering errors.
5.  **Environment Security**: All Firebase keys must reside in `.env` and never be hardcoded.

---

## 🛠️ 5. Technical Requirements for Next.js
*   **Framework**: Next.js 14+ (App Router).
*   **Styling**: Tailwind CSS.
*   **Icons**: Lucide-react (replaces Ionicons for a cleaner web feel).
*   **Database**: `firebase` SDK.
*   **Animations**: Framer Motion (for modal transitions and tab switching).
### 🛠️ Technical firebaseConfig (use .env file all the enviornmental settings)
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "AIzaSyDyCMNLyFkt80XPc3JwESmt7Ky_3q21ZZA",
    authDomain: "concept-b1a50.firebaseapp.com",
    projectId: "concept-b1a50",
    storageBucket: "concept-b1a50.firebasestorage.app",
    messagingSenderId: "334581166304",
    appId: "1:334581166304:web:7b9336d5a51bd5b03e6085"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
