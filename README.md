# CampusCare — Smart Campus Complaint & Maintenance Management System

CampusCare is an academic functional prototype of a centralized digital platform for reporting, triaging, assigning, and resolving university campus maintenance issues. It replaces informal verbal and messaging-based reporting with a structured, transparent workflow: **`Pending → Assigned → In Progress → Resolved`**.

> **Academic Prototype Notice:** CampusCare uses browser **`LocalStorage`** and a demonstration role-based login screen. It does **not** use real passwords, real student personal records, external APIs, or a production database server.

---

## Key Features

- **Role-Based Demo Access (`3 Roles`):**
  - **Student:** Submit validated complaints with optional image attachments, generate unique tracking IDs (`CMP-YYYY-XXXX`), search/filter personal complaint history, and track assigned staff and resolution notes.
  - **Administrator:** View campus-wide statistics and category breakdowns, inspect all complaints, set priority (`Low`, `Medium`, `High`, `Urgent`), assign maintenance staff, manage statuses, and delete records with confirmation.
  - **Maintenance Staff:** Access an isolated task queue showing **only** complaints assigned directly to the signed-in technician, advance tasks through `In Progress` and `Resolved`, record mandatory resolution notes, and review completed tasks.
- **Role Isolation & Security Guardrails:**
  - Students cannot view peer complaints or access Admin/Staff workspaces.
  - Maintenance Staff cannot view or edit unassigned or peer-assigned complaints.
  - All user-generated text is HTML-escaped before DOM insertion to prevent XSS.
  - Image uploads validate MIME type (`PNG`, `JPG`, `WEBP`) and enforce a `500 KB` `LocalStorage` safety limit.
- **Persistent Demo State:** All complaints, audit history logs, and active demo sessions persist across browser refreshes via `LocalStorage`, with safe recovery if storage data becomes corrupted.

---

## Technology Stack

- **Frontend Markup:** HTML5 (`index.html`)
- **Styling & Responsive Design:** CSS3 (`style.css` — dark navy SaaS theme with blue/cyan accents, desktop sidebar, mobile slide-out drawer)
- **Client Logic & Persistence:** Vanilla JavaScript (`script.js`) + Browser `LocalStorage`
- **Icons & Typography:** Inline SVG icons (zero external icon library required) + optional Google Fonts (`Inter`, `JetBrains Mono`) with full system font fallback offline

---

## Folder Structure

```text
CampusCare/
├── index.html                          # Single-page multi-screen application entry
├── style.css                           # Responsive dark-navy SaaS stylesheet
├── script.js                           # State management, role permissions, LocalStorage & UI logic
├── assets/
│   └── campuscare-logo.svg             # Brand vector emblem
├── diagrams/
│   ├── use-case-diagram.svg            # Editable UML Use Case Diagram source
│   ├── use-case-diagram.png            # High-resolution UML Use Case Diagram
│   ├── activity-diagram.svg            # Editable UML Activity Diagram source
│   └── activity-diagram.png            # High-resolution UML Activity Diagram
├── screenshots/
│   ├── 01-login-screen.png             # Screen 1: Role-Based Demo Login
│   ├── 02-student-dashboard.png        # Screen 2: Student Dashboard
│   ├── 03-complaint-submission.png     # Screen 3: Complaint Submission Form
│   ├── 04-admin-dashboard.png          # Screen 4: Administrator Dashboard
│   └── 05-maintenance-staff-dashboard.png # Screen 5: Maintenance Staff Workspace
├── documentation/
│   ├── requirements.md                 # Deliverable 1: 7 FRs & 3 NFRs (FR1–FR7, NFR1–NFR3)
│   ├── ui-design-explanation.md        # Deliverable 4: Screen-by-screen UI rationale
│   ├── project-report.md               # Complete 15-section academic project report
│   ├── demo-guide.md                   # 3–5 minute live demonstration script
│   └── presentation.pptx               # Deliverable 5: 7-slide presentation deck
└── README.md                           # Project setup and documentation guide
```

---

## How to Run the Application

No installation, build step, or server runtime is required:

1. Navigate to the `CampusCare/` folder.
2. Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
3. *(Optional)* Serve locally using any static file server (e.g., VS Code Live Server).

---

## Demo Login Instructions

On the **Login Screen**, select one of the three role cards and choose a fictional demo profile (no password required):

| Role | Default Demo Profile | Identifier | Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | Aarav Patel *(or Maya Lin)* | `STU-2026-104` | Submit complaints, upload photos, search/track personal tickets |
| **Administrator** | Dr. Elena Vance | `ADM-001` | View all complaints, set priority, assign technicians, manage records |
| **Maintenance Staff** | Marcus Thorne *(or Sarah Jenkins, Devon Brooks, Priya Sharma)* | `TECH-101` | View assigned tasks only, mark `In Progress`, submit resolution notes & mark `Resolved` |

> **Demo Tip:** When demonstrating the end-to-end flow, assign your new complaint as **Administrator** to **Marcus Thorne (`TECH-101`)**, then log in as **Marcus Thorne** under Maintenance Staff to resolve it.

---

## How to Reset Demo Data

To restore the default 8 fictional sample complaints across all categories and statuses:

1. Click **Reset Demo Data** on the **Login Screen**, in the **Sidebar footer**, or in the **Administrator Dashboard** header.
2. Confirm the prompt in the confirmation dialog to reload the baseline dataset cleanly.

---

## Known Limitations

- **Client-Side Persistence Only:** Browser `LocalStorage` is scoped to a single browser profile and device; complaints do not synchronize across different computers or browsers.
- **Demonstration Authentication:** Role selection simulates multi-user access for academic demonstration and should not be used in production without server-side authentication, session tokens, and database access control.
- **Storage Capacity Constraint:** `LocalStorage` typically caps storage near ~5 MB per origin, so image attachments are strictly capped at `500 KB`.

