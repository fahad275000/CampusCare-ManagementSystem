# CampusCare — User Interface Design Explanation

**Document Purpose:** Academic Deliverable 4 (UI Screens & Design Rationale)  
**Design System:** Dark Navy SaaS Workspace (`#070D19` canvas, `#0D1628` surfaces, `#3B82F6` Blue & `#22D3EE` Cyan accents)

---

## 1. Visual Language & UX Principles

CampusCare is styled as a modern enterprise SaaS maintenance operations portal optimized for rapid readability during live demonstrations and daily university use:

- **Color Hierarchy:** Deep navy backgrounds minimize visual glare, while high-contrast slate typography (`#F1F5F9` primary, `#94A3B8` secondary) and cyan/blue accents guide attention to primary actions.
- **Semantic Status & Priority Encoding:** Each workflow stage uses distinct, consistent pill colors (`Pending` = Amber, `Assigned` = Blue, `In Progress` = Cyan, `Resolved` = Emerald) paired with text labels for color-blind accessibility.
- **Responsive Layout:** Desktop viewports (`> 860px`) use a fixed `268px` navigation sidebar paired with a scrollable workspace; tablet and mobile viewports collapse the sidebar into a slide-out drawer accessible from the sticky top utility bar.
- **Feedback & Guardrails:** Inline field errors validate forms before submission, floating toast notifications confirm state changes, confirmation modals guard destructive actions (`Delete Record`, `Reset Demo Data`), and structured empty states guide users when filters return zero matches.

---

## 2. Screen-by-Screen Overview (5 Mandatory Screens)

### Screen 1 — Role-Based Demo Login Portal (`screenshots/01-login-screen.png`)
- **Purpose:** Serves as the entry gateway for the academic functional prototype, clearly distinguishing demonstration authentication (backed by `LocalStorage`) from production authentication.
- **Key Elements:** CampusCare brand lockup, **Academic Prototype** badge, demonstration authentication note, interactive role selection cards (**Student**, **Administrator**, **Maintenance Staff**), demo profile selector, compact **Sample Demo Accounts** instructions, live `LocalStorage` complaint counter, and quick **Reset Demo Data** button.

### Screen 2 — Student Dashboard (`screenshots/02-student-dashboard.png`)
- **Purpose:** Provides students with personal visibility into every issue they have reported without exposing peer students' records or administrative controls.
- **Key Elements:** Personalized greeting, **+ Submit New Complaint** quick action, four KPI summary cards (**Total**, **Pending**, **In Progress**, **Resolved**), personal category distribution bars, recent updates feed, real-time search/category/status filter bar, and personal complaint cards showing a four-stage progress pipeline, assigned staff member, and technician resolution notes.

### Screen 3 — Complaint Submission Screen (`screenshots/03-complaint-submission.png`)
- **Purpose:** Captures structured, validated campus issue reports and prevents incomplete or oversized submissions from corrupting `LocalStorage`.
- **Key Elements:** Validated form fields for **Complaint Title** (min. 5 chars), **Issue Category** (6 campus categories), optional **Campus Location**, **Detailed Description** (live `0 / 600` counter, min. 15 chars), drag-and-drop **Evidence Photo** uploader (`PNG`/`JPG`/`WEBP`, max 500 KB) with preview/remove controls, and a side panel summarizing submission guidelines and automatic ID generation (`CMP-YYYY-XXXX`).

### Screen 4 — Administrator Operations Dashboard (`screenshots/04-admin-dashboard.png`)
- **Purpose:** Centralizes campus-wide triage, workload analytics, prioritization, and maintenance dispatch.
- **Key Elements:** Campus-wide KPI summary cards, dynamic **Complaints by Category** bar chart computed from live records, **Recent Complaints** feed, multi-criteria filter bar (Search, Category, Status, Priority), and the **Complaint Management Registry** table. Clicking **Manage** opens an inspection modal where Administrators set **Priority** (`Low`–`Urgent`), assign **Maintenance Staff**, update status, inspect attached evidence, audit history, or delete records with confirmation.

### Screen 5 — Maintenance Staff Workspace (`screenshots/05-maintenance-staff-dashboard.png`)
- **Purpose:** Gives technicians a focused, access-isolated queue showing strictly the complaints assigned to the signed-in staff member.
- **Key Elements:** Role isolation notice banner, personal workload KPI cards, queue tabs (**Active Assigned Tasks**, **Completed Tasks**, **All My Tasks**), search and priority filters, and task cards with direct **Start Work (In Progress)** and **Update / Resolve Task** controls. Resolving a complaint enforces mandatory technician resolution notes (min. 8 chars) that immediately become visible to the Student and Administrator.

