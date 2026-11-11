# CampusCare — 3–5 Minute Live Demonstration Guide

**Target Duration:** 4 minutes 30 seconds  
**Recommended Preparation Before Presenting:** Open `index.html` in a modern browser (Chrome, Edge, or Firefox) and click **Reset Demo Data** on the Login Screen so the workspace starts with the clean 8-complaint baseline.

---

## Demonstration Timeline & Script

### Step 1: Problem Statement & Motivation (0:00 – 0:45)
- **On Screen:** Login Screen (`CampusCare` Role Portal).
- **Talking Points:**
  - Across university campuses, issues such as faulty classroom projectors, electrical flickers, water leaks, Wi-Fi drops, and sanitation issues are often reported verbally or through informal messaging chats.
  - Informal channels make it difficult to track ticket ownership, assign maintenance priorities, or keep students informed on progress.
  - **CampusCare** solves this with a centralized, role-based workflow (`Pending → Assigned → In Progress → Resolved`).
  - Point out the **Academic Functional Prototype** notice: it uses role-based demonstration authentication and browser `LocalStorage` persistence (no real student records or external servers).

### Step 2: Student Login & Classroom Complaint Submission (0:45 – 1:45)
- **Actions:**
  1. On the Login Screen, select the **Student** role card (`Ruchita — STU-2026-104`) and click **Enter Workspace**.
  2. Briefly highlight the Student Dashboard KPI cards (**Total**, **Pending**, **In Progress**, **Resolved**), category bars, and personal complaint isolation.
  3. Click **+ Submit New Complaint**.
  4. Enter a classroom maintenance complaint:
     - **Title:** `Broken Smartboard Stylus Dock in Lecture Room 305`
     - **Category:** `Classroom Maintenance`
     - **Location:** `Academic Block C, Room 305`
     - **Description:** `Magnetic stylus holder has detached from the wall mount and the calibration LED blinks red.`
     - *(Optional)* Attach a sample image (< 500 KB) to demonstrate MIME/size validation and live preview.
  5. Click **Submit Complaint** and note the auto-generated unique ID (e.g., `CMP-2026-1009`) starting in **Pending** status.

### Step 3: Administrator Review, Prioritization & Staff Assignment (1:45 – 2:45)
- **Actions:**
  1. Click **Switch Role / Sign Out** in the sidebar.
  2. Select **Administrator** (`Fahad — ADM-001`) and click **Enter Workspace**.
  3. Show campus-wide KPI metrics, category breakdown, and the full **Complaint Management Registry** table.
  4. Locate `CMP-2026-1009` and click **Manage**.
  5. Set **Priority** to `High`, select **Marcus Thorne (`TECH-101`)** under **Assign Maintenance Staff** (note that status automatically advances from `Pending` to `Assigned`), and click **Save Admin Changes**.

### Step 4: Maintenance Staff Execution & Resolution (2:45 – 3:40)
- **Actions:**
  1. Sign out and select **Maintenance Staff** (`Marcus Thorne — TECH-101`, default demo staff profile) and click **Enter Workspace**.
  2. Highlight the **Role Isolation Active** banner — Marcus only sees tasks assigned directly to him (`CMP-2026-1009` and his own tasks), never unassigned or peer-assigned complaints.
  3. Click **Start Work (In Progress)** on `CMP-2026-1009` to advance its status to **In Progress**.
  4. Click **Update / Resolve Task**, set status to **Resolved**, enter resolution notes (e.g., `Replaced damaged magnetic stylus cradle, tightened wall anchors, and calibrated smartboard touch input.`), and click **Update Task Status**.
  5. Switch to the **Completed Tasks** tab to confirm it is logged under resolved work.

### Step 5: Student Status Verification & Persistence Check (3:40 – 4:10)
- **Actions:**
  1. Sign out and log back in as **Student** (`Ruchita`).
  2. Show `CMP-2026-1009` now displaying **Resolved** across all four pipeline steps, showing **Assigned Staff: Marcus Thorne** and the technician's **Resolution Notes**.
  3. Refresh the browser (`F5` / `Ctrl+R`) to demonstrate that both the active session and all complaint updates persist in `LocalStorage`.

### Step 6: Architecture, UML Diagrams & Design Justification (4:10 – 4:45)
- **Talking Points:**
  - Summarize the **UML Use Case Diagram** (3 actors: Student, Administrator, Maintenance Staff; 10 use cases inside the `CampusCare` boundary).
  - Summarize the **UML Activity Diagram** (end-to-end lifecycle including form validation corrections and administrator validity decision paths).
  - Highlight clean Vanilla HTML5/CSS3/JS engineering: XSS text escaping, strict client-side role checks, zero external framework bloat, and responsive desktop/mobile design.

