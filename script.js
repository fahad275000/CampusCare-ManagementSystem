/* ==========================================================================
   CampusCare — Smart Campus Complaint & Maintenance Management System
   Academic Functional Prototype (HTML5 + CSS3 + Vanilla JS + LocalStorage)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     CONSTANTS & DEMO USERS (Fictional Demo Accounts — No Real Personal Data)
  ------------------------------------------------------------------------ */
  const STORAGE_KEYS = {
    COMPLAINTS: 'campuscare_complaints_v1',
    SESSION: 'campuscare_session_v1',
    COUNTER: 'campuscare_counter_v1'
  };

  const CATEGORIES = [
    'Electrical',
    'Water Supply',
    'Classroom Maintenance',
    'Wi-Fi/Internet',
    'Cleanliness',
    'Other'
  ];

  const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
  const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

  const MAX_IMAGE_BYTES = 500 * 1024; // 500 KB safe LocalStorage cap
  const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

  const DEMO_USERS = {
    student: [
      {
        id: 'stu-1',
        role: 'student',
        name: 'Ruchita',
        identifier: 'STU-2026-104',
        subtitle: 'Computer Science (Demo Student)'
      },
      {
        id: 'stu-2',
        role: 'student',
        name: 'Mythri',
        identifier: 'STU-2026-218',
        subtitle: 'Electrical Engineering (Demo Student)'
      }
    ],
    admin: [
      {
        id: 'admin-1',
        role: 'admin',
        name: 'Fahad',
        identifier: 'ADM-001',
        subtitle: 'Campus Facilities Operations Administrator'
      }
    ],
    staff: [
      {
        id: 'staff-1',
        role: 'staff',
        name: 'Marcus Thorne',
        identifier: 'TECH-101',
        subtitle: 'Classroom & General Maintenance'
      },
      {
        id: 'staff-2',
        role: 'staff',
        name: 'Sarah Jenkins',
        identifier: 'TECH-102',
        subtitle: 'Electrical & Power Systems'
      },
      {
        id: 'staff-3',
        role: 'staff',
        name: 'Devon Brooks',
        identifier: 'TECH-103',
        subtitle: 'IT & Wi-Fi Infrastructure'
      },
      {
        id: 'staff-4',
        role: 'staff',
        name: 'Priya Sharma',
        identifier: 'TECH-104',
        subtitle: 'Plumbing, Water & Sanitation'
      }
    ]
  };

  const ROLE_HINTS = {
    student: 'Students can submit new complaints, attach photos, search personal history, and track assigned staff & resolution status.',
    admin: 'Administrators review all campus complaints, set priority levels, assign maintenance staff, and manage records.',
    staff: 'Maintenance Staff can view only tasks assigned directly to them, update progress, and submit resolution notes.'
  };

  const ROLE_ALLOWED_SCREENS = {
    student: ['student-dashboard', 'submit-complaint'],
    admin: ['admin-dashboard'],
    staff: ['staff-dashboard']
  };

  /* Lightweight illustrative vector attachment for seeded demo complaint */
  const SAMPLE_LAB_LIGHT_IMAGE =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 260">' +
        '<rect width="480" height="260" fill="#0b1324"/>' +
        '<rect x="24" y="24" width="432" height="212" rx="12" fill="#111d35" stroke="#334155" stroke-width="2"/>' +
        '<rect x="70" y="54" width="340" height="24" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>' +
        '<rect x="82" y="60" width="140" height="12" rx="4" fill="#fde68a"/>' +
        '<rect x="238" y="60" width="160" height="12" rx="4" fill="#475569"/>' +
        '<path d="M150 90 L132 135 M190 92 L188 142 M115 90 L92 128" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 5"/>' +
        '<text x="240" y="182" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="16" font-weight="600">Lab 3B — Bay 2 Ceiling Light Fixture</text>' +
        '<text x="240" y="206" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Sample Demo Attachment (Flickering / Half-Out Ballast)</text>' +
      '</svg>'
    );

  /* ------------------------------------------------------------------------
     SEED DATA GENERATOR (Realistic Fictional Sample Dataset)
  ------------------------------------------------------------------------ */
  function createSeedComplaints() {
    const now = Date.now();
    const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

    return [
      {
        id: 'CMP-2026-1001',
        studentId: 'stu-1',
        studentName: 'Ruchita',
        studentCode: 'STU-2026-104',
        title: 'Projector HDMI Port Damaged in Lecture Hall 204',
        description:
          'The podium HDMI cable connector is bent and loses signal whenever touched, interrupting morning Software Engineering lectures.',
        category: 'Classroom Maintenance',
        location: 'Engineering Block B, Room 204',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(3),
        priority: 'Medium',
        status: 'Pending',
        assignedStaffId: null,
        assignedStaffName: null,
        resolutionNotes: '',
        updatedAt: hoursAgo(3),
        history: [
          {
            timestamp: hoursAgo(3),
            actor: 'Ruchita (Student)',
            action: 'Complaint submitted (Pending Admin Review)',
            status: 'Pending'
          }
        ]
      },
      {
        id: 'CMP-2026-1002',
        studentId: 'stu-1',
        studentName: 'Ruchita',
        studentCode: 'STU-2026-104',
        title: 'Frequent Wi-Fi Drops in Central Library 2nd Floor',
        description:
          'Access point AP-LIB-04 disconnects laptops every 10–15 minutes in the quiet study zone near the east windows.',
        category: 'Wi-Fi/Internet',
        location: 'Central Library, 2nd Floor East',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(28),
        priority: 'High',
        status: 'In Progress',
        assignedStaffId: 'staff-3',
        assignedStaffName: 'Devon Brooks',
        resolutionNotes: 'Inspecting PoE switch uplink and testing replacement ceiling access point.',
        updatedAt: hoursAgo(5),
        history: [
          {
            timestamp: hoursAgo(28),
            actor: 'Ruchita (Student)',
            action: 'Complaint submitted',
            status: 'Pending'
          },
          {
            timestamp: hoursAgo(20),
            actor: 'Fahad (Administrator)',
            action: 'Set priority to High and assigned to Devon Brooks',
            status: 'Assigned'
          },
          {
            timestamp: hoursAgo(5),
            actor: 'Devon Brooks (Maintenance Staff)',
            action: 'Started diagnostic work on AP-LIB-04',
            status: 'In Progress'
          }
        ]
      },
      {
        id: 'CMP-2026-1003',
        studentId: 'stu-2',
        studentName: 'Mythri',
        studentCode: 'STU-2026-218',
        title: 'Flickering Ceiling Tube Lights in Electronics Lab 3B',
        description:
          'Two overhead fluorescent fixtures above lab benches 4–6 flicker continuously and emit a loud buzzing sound.',
        category: 'Electrical',
        location: 'Science Wing, Lab 3B',
        imageData: SAMPLE_LAB_LIGHT_IMAGE,
        imageName: 'lab-3b-lighting-fixture.svg',
        createdAt: hoursAgo(18),
        priority: 'Urgent',
        status: 'Assigned',
        assignedStaffId: 'staff-2',
        assignedStaffName: 'Sarah Jenkins',
        resolutionNotes: '',
        updatedAt: hoursAgo(12),
        history: [
          {
            timestamp: hoursAgo(18),
            actor: 'Mythri (Student)',
            action: 'Complaint submitted with attachment',
            status: 'Pending'
          },
          {
            timestamp: hoursAgo(12),
            actor: 'Fahad (Administrator)',
            action: 'Escalated priority to Urgent and assigned to Sarah Jenkins',
            status: 'Assigned'
          }
        ]
      },
      {
        id: 'CMP-2026-1004',
        studentId: 'stu-1',
        studentName: 'Ruchita',
        studentCode: 'STU-2026-104',
        title: 'Water Cooler Leaking Near Science Corridor',
        description:
          'Steady puddle forming beneath the chilled water dispenser outside Lab 102, creating a slip hazard in the hallway.',
        category: 'Water Supply',
        location: 'Science Wing, Ground Corridor',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(72),
        priority: 'High',
        status: 'Resolved',
        assignedStaffId: 'staff-4',
        assignedStaffName: 'Priya Sharma',
        resolutionNotes:
          'Replaced cracked inlet valve and resealed drainage tubing. Verified leak-free pressure test for 30 minutes.',
        updatedAt: hoursAgo(24),
        history: [
          {
            timestamp: hoursAgo(72),
            actor: 'Ruchita (Student)',
            action: 'Complaint submitted',
            status: 'Pending'
          },
          {
            timestamp: hoursAgo(65),
            actor: 'Fahad (Administrator)',
            action: 'Set priority to High and assigned to Priya Sharma',
            status: 'Assigned'
          },
          {
            timestamp: hoursAgo(48),
            actor: 'Priya Sharma (Maintenance Staff)',
            action: 'Shut off feed valve and began valve replacement',
            status: 'In Progress'
          },
          {
            timestamp: hoursAgo(24),
            actor: 'Priya Sharma (Maintenance Staff)',
            action: 'Marked Resolved with repair notes',
            status: 'Resolved'
          }
        ]
      },
      {
        id: 'CMP-2026-1005',
        studentId: 'stu-2',
        studentName: 'Mythri',
        studentCode: 'STU-2026-218',
        title: 'Broken Desk Hinges in Seminar Room 108',
        description:
          'Three folding writing tablets in row C have sheared hinge bolts and tilt sharply when students write on them.',
        category: 'Classroom Maintenance',
        location: 'Academic Block A, Seminar 108',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(14),
        priority: 'Medium',
        status: 'Assigned',
        assignedStaffId: 'staff-1',
        assignedStaffName: 'Marcus Thorne',
        resolutionNotes: '',
        updatedAt: hoursAgo(9),
        history: [
          {
            timestamp: hoursAgo(14),
            actor: 'Mythri (Student)',
            action: 'Complaint submitted',
            status: 'Pending'
          },
          {
            timestamp: hoursAgo(9),
            actor: 'Fahad (Administrator)',
            action: 'Set priority to Medium and assigned to Marcus Thorne',
            status: 'Assigned'
          }
        ]
      },
      {
        id: 'CMP-2026-1006',
        studentId: 'stu-1',
        studentName: 'Ruchita',
        studentCode: 'STU-2026-104',
        title: 'Overflowing Recycling Bins in Student Commons',
        description:
          'All three waste and recycling bins near the cafeteria exit have been overflowing since yesterday evening.',
        category: 'Cleanliness',
        location: 'Student Commons, Ground Lobby',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(96),
        priority: 'Low',
        status: 'Resolved',
        assignedStaffId: 'staff-1',
        assignedStaffName: 'Marcus Thorne',
        resolutionNotes:
          'Emptied and sanitized all three bins, cleaned surrounding floor, and coordinated an extra midday pickup slot.',
        updatedAt: hoursAgo(50),
        history: [
          {
            timestamp: hoursAgo(96),
            actor: 'Ruchita (Student)',
            action: 'Complaint submitted',
            status: 'Pending'
          },
          {
            timestamp: hoursAgo(90),
            actor: 'Fahad (Administrator)',
            action: 'Set priority to Low and assigned to Marcus Thorne',
            status: 'Assigned'
          },
          {
            timestamp: hoursAgo(68),
            actor: 'Marcus Thorne (Maintenance Staff)',
            action: 'Started sanitation and bin clearance',
            status: 'In Progress'
          },
          {
            timestamp: hoursAgo(50),
            actor: 'Marcus Thorne (Maintenance Staff)',
            action: 'Marked Resolved with completion notes',
            status: 'Resolved'
          }
        ]
      },
      {
        id: 'CMP-2026-1007',
        studentId: 'stu-2',
        studentName: 'Mythri',
        studentCode: 'STU-2026-218',
        title: 'Loose Power Outlet at Computer Lab Workstation 12',
        description:
          'Wall receptacle plate is loose and recessed into the drywall when plugging in lab power strips.',
        category: 'Electrical',
        location: 'IT Center, Lab 1, Desk 12',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(2),
        priority: 'Medium',
        status: 'Pending',
        assignedStaffId: null,
        assignedStaffName: null,
        resolutionNotes: '',
        updatedAt: hoursAgo(2),
        history: [
          {
            timestamp: hoursAgo(2),
            actor: 'Mythri (Student)',
            action: 'Complaint submitted (Pending Admin Review)',
            status: 'Pending'
          }
        ]
      },
      {
        id: 'CMP-2026-1008',
        studentId: 'stu-1',
        studentName: 'Ruchita',
        studentCode: 'STU-2026-104',
        title: 'North Courtyard Bicycle Rack Gate Latch Jammed',
        description:
          'The security gate latch sticks shut in the mornings, preventing students from unlocking the covered bike shed.',
        category: 'Other',
        location: 'North Courtyard Bike Shed',
        imageData: null,
        imageName: null,
        createdAt: hoursAgo(40),
        priority: 'Low',
        status: 'In Progress',
        assignedStaffId: 'staff-1',
        assignedStaffName: 'Marcus Thorne',
        resolutionNotes: 'Ordering replacement stainless latch assembly; temporary lubrication applied.',
        updatedAt: hoursAgo(8),
        history: [
          {
            timestamp: hoursAgo(40),
            actor: 'Ruchita (Student)',
            action: 'Complaint submitted',
            status: 'Pending'
          },
          {
            timestamp: hoursAgo(32),
            actor: 'Fahad (Administrator)',
            action: 'Assigned to Marcus Thorne (Low Priority)',
            status: 'Assigned'
          },
          {
            timestamp: hoursAgo(8),
            actor: 'Marcus Thorne (Maintenance Staff)',
            action: 'Inspected latch mechanism and ordered replacement hardware',
            status: 'In Progress'
          }
        ]
      }
    ];
  }

  /* ------------------------------------------------------------------------
     APPLICATION STATE
  ------------------------------------------------------------------------ */
  const state = {
    complaints: [],
    session: null,
    currentScreen: 'login',
    selectedLoginRole: 'student',
    staffTab: 'active',
    pendingAttachment: null, // { dataUrl, name, size }
    confirmCallback: null
  };

  /* ------------------------------------------------------------------------
     SAFE UTILITIES: ESCAPING, VALIDATION & LOCALSTORAGE
  ------------------------------------------------------------------------ */
  function escapeHTML(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isSafeImageDataUrl(url) {
    if (typeof url !== 'string' || !url) return false;
    return /^data:image\/(png|jpeg|jpg|webp|svg\+xml);/i.test(url);
  }

  function formatDateTime(isoString) {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatShortDate(isoString) {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  function getInitials(name) {
    return String(name || 'CC')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      console.warn('LocalStorage read blocked:', err);
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return { ok: true };
    } catch (err) {
      console.error('LocalStorage write failed:', err);
      return {
        ok: false,
        error:
          err && err.name === 'QuotaExceededError'
            ? 'Browser LocalStorage quota exceeded. Please remove large attachments or reset demo data.'
            : 'Unable to persist changes to browser LocalStorage.'
      };
    }
  }

  function migrateDemoName(text) {
    if (typeof text !== 'string') return text;
    return text
      .replace(/\bAarav Patel\b/g, 'Ruchita')
      .replace(/\bMaya Lin\b/g, 'Mythri')
      .replace(/\bDr\. Elena Vance\b/g, 'Fahad');
  }

  function sanitizeComplaint(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || typeof raw.title !== 'string' || typeof raw.description !== 'string') {
      return null;
    }
    const category = CATEGORIES.includes(raw.category) ? raw.category : 'Other';
    const priority = PRIORITIES.includes(raw.priority) ? raw.priority : 'Medium';
    const status = STATUSES.includes(raw.status) ? raw.status : 'Pending';
    const createdAt = !Number.isNaN(new Date(raw.createdAt).getTime())
      ? raw.createdAt
      : new Date().toISOString();
    const updatedAt = !Number.isNaN(new Date(raw.updatedAt).getTime())
      ? raw.updatedAt
      : createdAt;

    return {
      id: raw.id.trim().slice(0, 32),
      studentId: typeof raw.studentId === 'string' ? raw.studentId : 'stu-1',
      studentName:
        typeof raw.studentName === 'string' && raw.studentName.trim()
          ? migrateDemoName(raw.studentName.trim())
          : 'Demo Student',
      studentCode: typeof raw.studentCode === 'string' ? raw.studentCode : 'STU-DEMO',
      title: raw.title.trim().slice(0, 120),
      description: raw.description.trim().slice(0, 800),
      category,
      location: typeof raw.location === 'string' ? raw.location.trim().slice(0, 100) : '',
      imageData: isSafeImageDataUrl(raw.imageData) ? raw.imageData : null,
      imageName: typeof raw.imageName === 'string' ? raw.imageName.slice(0, 100) : null,
      createdAt,
      priority,
      status,
      assignedStaffId: typeof raw.assignedStaffId === 'string' && raw.assignedStaffId ? raw.assignedStaffId : null,
      assignedStaffName: typeof raw.assignedStaffName === 'string' && raw.assignedStaffName ? raw.assignedStaffName : null,
      resolutionNotes: typeof raw.resolutionNotes === 'string' ? raw.resolutionNotes.slice(0, 1000) : '',
      updatedAt,
      history: Array.isArray(raw.history)
        ? raw.history
            .filter((h) => h && typeof h.action === 'string')
            .map((h) => ({
              timestamp: h.timestamp || updatedAt,
              actor: typeof h.actor === 'string' ? migrateDemoName(h.actor) : 'System',
              action: h.action,
              status: STATUSES.includes(h.status) ? h.status : status
            }))
        : []
    };
  }

  function loadInitialData() {
    const rawComplaints = safeStorageGet(STORAGE_KEYS.COMPLAINTS);
    if (!rawComplaints) {
      const seeded = createSeedComplaints();
      state.complaints = seeded;
      saveComplaints();
      safeStorageSet(STORAGE_KEYS.COUNTER, '1008');
    } else {
      try {
        const parsed = JSON.parse(rawComplaints);
        if (!Array.isArray(parsed)) throw new Error('Stored complaints payload is not an array');
        const cleaned = parsed.map(sanitizeComplaint).filter(Boolean);
        if (parsed.length > 0 && cleaned.length === 0) {
          throw new Error('All stored complaint entries failed schema validation');
        }
        state.complaints = cleaned;
        if (
          rawComplaints.includes('Aarav Patel') ||
          rawComplaints.includes('Maya Lin') ||
          rawComplaints.includes('Dr. Elena Vance')
        ) {
          saveComplaints();
        }
      } catch (err) {
        console.warn('Recovering corrupted LocalStorage complaints:', err);
        state.complaints = createSeedComplaints();
        saveComplaints();
        safeStorageSet(STORAGE_KEYS.COUNTER, '1008');
        showToast('warning', 'Demo Data Restored', 'Invalid LocalStorage data was detected and safely reset to demo defaults.');
      }
    }

    const rawSession = safeStorageGet(STORAGE_KEYS.SESSION);
    if (rawSession) {
      try {
        const sess = JSON.parse(rawSession);
        if (sess && ROLE_ALLOWED_SCREENS[sess.role]) {
          const validUser = (DEMO_USERS[sess.role] || []).find((u) => u.id === sess.id);
          if (validUser) {
            state.session = validUser;
            safeStorageSet(STORAGE_KEYS.SESSION, JSON.stringify(validUser));
          }
        }
      } catch (_err) {
        state.session = null;
      }
    }
  }

  function saveComplaints() {
    return safeStorageSet(STORAGE_KEYS.COMPLAINTS, JSON.stringify(state.complaints));
  }

  function generateUniqueComplaintId() {
    let maxNumeric = 1000;
    const storedCounter = parseInt(safeStorageGet(STORAGE_KEYS.COUNTER) || '1000', 10);
    if (!Number.isNaN(storedCounter)) {
      maxNumeric = Math.max(maxNumeric, storedCounter);
    }
    state.complaints.forEach((c) => {
      const match = String(c.id).match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!Number.isNaN(num)) maxNumeric = Math.max(maxNumeric, num);
      }
    });

    const year = new Date().getFullYear();
    let candidateNum = maxNumeric + 1;
    const existingIds = new Set(state.complaints.map((c) => c.id));
    let candidateId = `CMP-${year}-${candidateNum}`;
    while (existingIds.has(candidateId)) {
      candidateNum += 1;
      candidateId = `CMP-${year}-${candidateNum}`;
    }
    safeStorageSet(STORAGE_KEYS.COUNTER, String(candidateNum));
    return candidateId;
  }

  /* ------------------------------------------------------------------------
     BADGE & ICON HELPERS
  ------------------------------------------------------------------------ */
  function statusBadgeHTML(status) {
    const map = {
      Pending: 'status-pending',
      Assigned: 'status-assigned',
      'In Progress': 'status-progress',
      Resolved: 'status-resolved'
    };
    const cls = map[status] || 'status-pending';
    return `<span class="status-badge ${cls}"><span class="status-dot" aria-hidden="true"></span>${escapeHTML(status)}</span>`;
  }

  function priorityBadgeHTML(priority) {
    const map = {
      Low: 'priority-low',
      Medium: 'priority-medium',
      High: 'priority-high',
      Urgent: 'priority-urgent'
    };
    const cls = map[priority] || 'priority-medium';
    return `<span class="priority-badge ${cls}">${escapeHTML(priority)}</span>`;
  }

  function pipelineStepperHTML(status) {
    const currentIndex = STATUSES.indexOf(status);
    return `<div class="pipeline-stepper" aria-label="Status progress">
      ${STATUSES.map((stage, idx) => {
        let cls = 'pipeline-step';
        if (idx < currentIndex || (status === 'Resolved' && idx === 3)) {
          cls += ' is-done';
        } else if (idx === currentIndex) {
          cls += ' is-current';
        }
        return `<div class="${cls}"><span>${idx + 1}. ${escapeHTML(stage)}</span></div>`;
      }).join('')}
    </div>`;
  }

  function computeMetrics(list) {
    const counts = {
      total: list.length,
      pending: 0,
      assigned: 0,
      inProgress: 0,
      resolved: 0
    };
    list.forEach((c) => {
      if (c.status === 'Pending') counts.pending += 1;
      else if (c.status === 'Assigned') counts.assigned += 1;
      else if (c.status === 'In Progress') counts.inProgress += 1;
      else if (c.status === 'Resolved') counts.resolved += 1;
    });
    return counts;
  }

  function renderCategoryBreakdown(containerEl, list) {
    if (!containerEl) return;
    if (list.length === 0) {
      containerEl.innerHTML = `<p class="panel-subtitle">No complaint records yet to summarize by category.</p>`;
      return;
    }
    const counts = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = 0;
    });
    list.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    const maxCount = Math.max(1, ...Object.values(counts));
    containerEl.innerHTML = CATEGORIES.map((cat) => {
      const count = counts[cat] || 0;
      const pct = Math.round((count / maxCount) * 100);
      return `
        <div class="cat-bar-row">
          <span class="cat-bar-label" title="${escapeHTML(cat)}">${escapeHTML(cat)}</span>
          <div class="cat-bar-track" role="progressbar" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${list.length}">
            <div class="cat-bar-fill" style="width: ${count === 0 ? 0 : Math.max(6, pct)}%"></div>
          </div>
          <span class="cat-bar-count">${count}</span>
        </div>
      `;
    }).join('');
  }

  function renderRecentList(containerEl, list, emptyText) {
    if (!containerEl) return;
    const recent = [...list]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4);

    if (recent.length === 0) {
      containerEl.innerHTML = `<p class="panel-subtitle">${escapeHTML(emptyText)}</p>`;
      return;
    }

    containerEl.innerHTML = recent
      .map(
        (c) => `
      <button type="button" class="recent-item" data-open-complaint="${escapeHTML(c.id)}">
        <div class="recent-item-main">
          <div class="recent-item-title">${escapeHTML(c.title)}</div>
          <div class="recent-item-meta">
            <span class="mono-id">${escapeHTML(c.id)}</span> &bull; ${escapeHTML(c.category)} &bull; Updated ${escapeHTML(formatShortDate(c.updatedAt))}
          </div>
        </div>
        ${statusBadgeHTML(c.status)}
      </button>
    `
      )
      .join('');
  }

  /* ------------------------------------------------------------------------
     TOAST & CONFIRMATION MODAL SYSTEM
  ------------------------------------------------------------------------ */
  function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    while (container.children.length >= 2) {
      container.removeChild(container.firstElementChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <div>
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-msg">${escapeHTML(message)}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    };
    closeBtn.addEventListener('click', dismiss);

    container.appendChild(toast);
    window.setTimeout(dismiss, 4500);
  }

  function openConfirmModal(title, message, confirmLabel, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    const proceedBtn = document.getElementById('btn-confirm-proceed');
    proceedBtn.textContent = confirmLabel || 'Confirm';
    state.confirmCallback = onConfirm;
    modal.classList.remove('hidden');
    proceedBtn.focus();
  }

  function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    state.confirmCallback = null;
  }

  /* ------------------------------------------------------------------------
     AUTHENTICATION, ROLE PERMISSIONS & NAVIGATION
  ------------------------------------------------------------------------ */
  function populateLoginAccounts(role) {
    state.selectedLoginRole = role;
    document.querySelectorAll('.role-card').forEach((card) => {
      const isActive = card.dataset.role === role;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const select = document.getElementById('login-account-select');
    const accounts = DEMO_USERS[role] || [];
    select.innerHTML = accounts
      .map(
        (u) =>
          `<option value="${escapeHTML(u.id)}">${escapeHTML(u.name)} (${escapeHTML(u.identifier)}) &mdash; ${escapeHTML(u.subtitle.replace(' (Demo Student)', ''))}</option>`
      )
      .join('');

    document.getElementById('login-role-hint').textContent = ROLE_HINTS[role] || '';
    updateLoginStorageCount();
  }

  function updateLoginStorageCount() {
    const el = document.getElementById('login-record-count');
    if (el) {
      el.textContent = `${state.complaints.length} stored complaint${state.complaints.length === 1 ? '' : 's'} in LocalStorage`;
    }
  }

  function clearToasts() {
    const container = document.getElementById('toast-container');
    if (container) container.innerHTML = '';
  }

  function signIn(role, userId) {
    const user = (DEMO_USERS[role] || []).find((u) => u.id === userId) || (DEMO_USERS[role] || [])[0];
    if (!user) return;
    clearToasts();
    state.session = user;
    safeStorageSet(STORAGE_KEYS.SESSION, JSON.stringify(user));

    const defaultScreen = ROLE_ALLOWED_SCREENS[user.role][0];
    navigateToScreen(defaultScreen);
    showToast('success', `Signed in as ${user.name}`, `Active role: ${formatRoleLabel(user.role)} (${user.identifier})`);
  }

  function signOut() {
    clearToasts();
    state.session = null;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (_err) {
      // Ignore storage errors on signout
    }
    closeComplaintModal();
    closeConfirmModal();
    closeMobileSidebar();
    navigateToScreen('login');
    showToast('info', 'Signed Out', 'Returned to CampusCare role selection portal.');
  }

  function formatRoleLabel(role) {
    if (role === 'student') return 'Student';
    if (role === 'admin') return 'Administrator';
    if (role === 'staff') return 'Maintenance Staff';
    return 'Guest';
  }

  function canAccessScreen(role, screenId) {
    if (!role) return screenId === 'login';
    const allowed = ROLE_ALLOWED_SCREENS[role] || [];
    return allowed.includes(screenId);
  }

  function navigateToScreen(screenId) {
    if (screenId !== 'login' && !state.session) {
      screenId = 'login';
    } else if (state.session && !canAccessScreen(state.session.role, screenId)) {
      showToast(
        'error',
        'Access Restricted',
        `${formatRoleLabel(state.session.role)} accounts cannot open that workspace.`
      );
      screenId = ROLE_ALLOWED_SCREENS[state.session.role][0];
    }

    state.currentScreen = screenId;

    const loginEl = document.getElementById('screen-login');
    const shellEl = document.getElementById('app-shell');

    if (screenId === 'login') {
      loginEl.classList.remove('hidden');
      shellEl.classList.add('hidden');
      populateLoginAccounts(state.selectedLoginRole);
      return;
    }

    loginEl.classList.add('hidden');
    shellEl.classList.remove('hidden');

    document.querySelectorAll('.screen-view').forEach((view) => {
      view.classList.add('hidden');
    });
    const activeView = document.getElementById(`screen-${screenId}`);
    if (activeView) {
      activeView.classList.remove('hidden');
    }

    renderSidebarAndTopbar(screenId);
    renderActiveScreenData(screenId);
    closeMobileSidebar();
  }

  function renderSidebarAndTopbar(screenId) {
    const user = state.session;
    if (!user) return;

    document.getElementById('sidebar-role-badge').textContent = formatRoleLabel(user.role);
    document.getElementById('sidebar-user-avatar').textContent = getInitials(user.name);
    document.getElementById('sidebar-user-name').textContent = user.name;
    document.getElementById('sidebar-user-id').textContent = user.identifier;
    document.getElementById('topbar-role-label').textContent = `${formatRoleLabel(user.role)} Portal`;

    const screenTitles = {
      'student-dashboard': 'My Dashboard',
      'submit-complaint': 'Submit Complaint',
      'admin-dashboard': 'Operations Dashboard',
      'staff-dashboard': 'Assigned Tasks'
    };
    document.getElementById('topbar-screen-title').textContent = screenTitles[screenId] || 'Workspace';

    const navItems = {
      student: [
        {
          id: 'student-dashboard',
          label: 'My Dashboard',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>'
        },
        {
          id: 'submit-complaint',
          label: 'Submit Complaint',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
        }
      ],
      admin: [
        {
          id: 'admin-dashboard',
          label: 'Operations Dashboard',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>'
        }
      ],
      staff: [
        {
          id: 'staff-dashboard',
          label: 'Assigned Tasks',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
        }
      ]
    };

    const navEl = document.getElementById('sidebar-nav');
    navEl.innerHTML = (navItems[user.role] || [])
      .map(
        (item) => `
      <button type="button" class="nav-item ${item.id === screenId ? 'active' : ''}" data-nav-screen="${escapeHTML(item.id)}">
        ${item.icon}
        <span>${escapeHTML(item.label)}</span>
      </button>
    `
      )
      .join('');
  }

  function renderActiveScreenData(screenId) {
    if (screenId === 'student-dashboard') renderStudentDashboard();
    else if (screenId === 'submit-complaint') resetSubmissionErrors();
    else if (screenId === 'admin-dashboard') renderAdminDashboard();
    else if (screenId === 'staff-dashboard') renderStaffDashboard();
  }

  /* ------------------------------------------------------------------------
     SCREEN 2: STUDENT DASHBOARD
  ------------------------------------------------------------------------ */
  function renderStudentDashboard() {
    if (!state.session || state.session.role !== 'student') return;

    const myComplaints = state.complaints.filter((c) => c.studentId === state.session.id);
    const counts = computeMetrics(myComplaints);

    document.getElementById('student-welcome-heading').textContent = `Welcome, ${state.session.name}`;

    document.getElementById('student-kpi-grid').innerHTML = `
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Total Complaints</span>
          <span class="kpi-icon kpi-blue" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.total}</div>
        <div class="kpi-foot">${counts.assigned} assigned &bull; ${counts.inProgress} in progress</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Pending Complaints</span>
          <span class="kpi-icon kpi-amber" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.pending}</div>
        <div class="kpi-foot">Awaiting administrator review</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">In Progress Complaints</span>
          <span class="kpi-icon kpi-cyan" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.inProgress}</div>
        <div class="kpi-foot">Active maintenance underway</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Resolved Complaints</span>
          <span class="kpi-icon kpi-emerald" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.resolved}</div>
        <div class="kpi-foot">Completed with resolution notes</div>
      </article>
    `;

    const activeCatCount = new Set(myComplaints.map((c) => c.category)).size;
    document.getElementById('student-cat-total').textContent = `${activeCatCount} categor${activeCatCount === 1 ? 'y' : 'ies'} used`;
    renderCategoryBreakdown(document.getElementById('student-category-breakdown'), myComplaints);
    renderRecentList(
      document.getElementById('student-recent-list'),
      myComplaints,
      'Submit your first campus complaint to track recent updates here.'
    );

    const search = document.getElementById('student-search').value.trim().toLowerCase();
    const catFilter = document.getElementById('student-filter-category').value;
    const statusFilter = document.getElementById('student-filter-status').value;

    const filtered = myComplaints
      .filter((c) => {
        if (catFilter !== 'all' && c.category !== catFilter) return false;
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (search) {
          const hay = `${c.id} ${c.title} ${c.description} ${c.location} ${c.category}`.toLowerCase();
          if (!hay.includes(search)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listEl = document.getElementById('student-complaints-list');
    if (filtered.length === 0) {
      const hasAny = myComplaints.length > 0;
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3>${hasAny ? 'No matching complaints found' : 'No complaints submitted yet'}</h3>
          <p>${hasAny ? 'Try adjusting your search query or clearing the category/status filters.' : 'Use "Submit New Complaint" to report a classroom, electrical, water, Wi-Fi, or cleanliness issue.'}</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered
      .map(
        (c) => `
      <article class="complaint-card">
        <div class="complaint-card-top">
          <div>
            <span class="mono-id">${escapeHTML(c.id)}</span>
            <h3 class="complaint-card-title">${escapeHTML(c.title)}</h3>
          </div>
          <div class="complaint-card-badges">
            <span class="category-chip">${escapeHTML(c.category)}</span>
            ${priorityBadgeHTML(c.priority)}
            ${statusBadgeHTML(c.status)}
          </div>
        </div>

        <p class="complaint-card-desc">${escapeHTML(c.description)}</p>

        ${pipelineStepperHTML(c.status)}

        ${
          c.resolutionNotes
            ? `<div class="resolution-preview"><strong>Resolution / Technician Note:</strong> ${escapeHTML(c.resolutionNotes)}</div>`
            : ''
        }

        <div class="complaint-card-meta">
          <div class="meta-items">
            <span><strong>Submitted:</strong> ${escapeHTML(formatDateTime(c.createdAt))}</span>
            <span><strong>Assigned Staff:</strong> ${escapeHTML(c.assignedStaffName || 'Awaiting Assignment')}</span>
            ${c.location ? `<span><strong>Location:</strong> ${escapeHTML(c.location)}</span>` : ''}
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-open-complaint="${escapeHTML(c.id)}">
            View Full Details
          </button>
        </div>
      </article>
    `
      )
      .join('');
  }

  /* ------------------------------------------------------------------------
     SCREEN 3: COMPLAINT SUBMISSION FORM
  ------------------------------------------------------------------------ */
  function resetSubmissionErrors() {
    ['comp-title', 'comp-category', 'comp-description'].forEach((id) => {
      document.getElementById(id).classList.remove('is-invalid');
    });
    ['err-comp-title', 'err-comp-category', 'err-comp-description', 'err-comp-image'].forEach((id) => {
      document.getElementById(id).textContent = '';
    });
  }

  function clearSubmissionForm() {
    document.getElementById('complaint-form').reset();
    document.getElementById('comp-desc-counter').textContent = '0 / 600';
    clearPendingAttachment();
    resetSubmissionErrors();
  }

  function clearPendingAttachment() {
    state.pendingAttachment = null;
    document.getElementById('comp-image').value = '';
    document.getElementById('image-preview-wrap').classList.add('hidden');
    document.getElementById('comp-image-preview').src = '';
    document.getElementById('comp-image-name').textContent = '';
    document.getElementById('err-comp-image').textContent = '';
  }

  function handleImageSelection(file) {
    const errEl = document.getElementById('err-comp-image');
    errEl.textContent = '';
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      clearPendingAttachment();
      errEl.textContent = 'Unsupported file type. Please upload a PNG, JPG, or WEBP image.';
      showToast('error', 'Invalid Image Format', 'Only PNG, JPG, and WEBP image attachments are allowed.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      clearPendingAttachment();
      const kb = Math.round(file.size / 1024);
      errEl.textContent = `File size (${kb} KB) exceeds the 500 KB limit for LocalStorage persistence.`;
      showToast('error', 'Image Too Large', `Selected image is ${kb} KB. Maximum allowed size is 500 KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (ev) {
      const dataUrl = ev.target && typeof ev.target.result === 'string' ? ev.target.result : '';
      if (!isSafeImageDataUrl(dataUrl)) {
        errEl.textContent = 'Unable to verify image data.';
        return;
      }
      state.pendingAttachment = {
        dataUrl,
        name: file.name,
        size: file.size
      };
      document.getElementById('comp-image-preview').src = dataUrl;
      document.getElementById('comp-image-name').textContent = `${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`;
      document.getElementById('image-preview-wrap').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  function handleComplaintSubmit(event) {
    event.preventDefault();
    if (!state.session || state.session.role !== 'student') {
      showToast('error', 'Permission Denied', 'Only signed-in Students can submit new complaints.');
      return;
    }

    resetSubmissionErrors();
    const titleInput = document.getElementById('comp-title');
    const categoryInput = document.getElementById('comp-category');
    const locationInput = document.getElementById('comp-location');
    const descInput = document.getElementById('comp-description');

    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const location = locationInput.value.trim();
    const description = descInput.value.trim();

    let isValid = true;
    if (title.length < 5) {
      titleInput.classList.add('is-invalid');
      document.getElementById('err-comp-title').textContent = 'Please enter a descriptive title (at least 5 characters).';
      isValid = false;
    }
    if (!CATEGORIES.includes(category)) {
      categoryInput.classList.add('is-invalid');
      document.getElementById('err-comp-category').textContent = 'Please select an issue category.';
      isValid = false;
    }
    if (description.length < 15) {
      descInput.classList.add('is-invalid');
      document.getElementById('err-comp-description').textContent = 'Please provide at least 15 characters describing the issue.';
      isValid = false;
    }

    if (!isValid) {
      showToast('warning', 'Validation Error', 'Please complete all required complaint fields before submitting.');
      return;
    }

    const nowIso = new Date().toISOString();
    const newId = generateUniqueComplaintId();
    const newComplaint = {
      id: newId,
      studentId: state.session.id,
      studentName: state.session.name,
      studentCode: state.session.identifier,
      title,
      description,
      category,
      location,
      imageData: state.pendingAttachment ? state.pendingAttachment.dataUrl : null,
      imageName: state.pendingAttachment ? state.pendingAttachment.name : null,
      createdAt: nowIso,
      priority: 'Medium',
      status: 'Pending',
      assignedStaffId: null,
      assignedStaffName: null,
      resolutionNotes: '',
      updatedAt: nowIso,
      history: [
        {
          timestamp: nowIso,
          actor: `${state.session.name} (Student)`,
          action: 'Submitted new complaint (Pending Admin Review)',
          status: 'Pending'
        }
      ]
    };

    state.complaints.unshift(newComplaint);
    const saved = saveComplaints();
    if (!saved.ok) {
      state.complaints.shift();
      showToast('error', 'Storage Error', saved.error);
      return;
    }

    clearSubmissionForm();
    navigateToScreen('student-dashboard');
    showToast('success', 'Complaint Submitted', `Generated tracking ID ${newId} in Pending status.`);
  }

  /* ------------------------------------------------------------------------
     SCREEN 4: ADMINISTRATOR DASHBOARD
  ------------------------------------------------------------------------ */
  function renderAdminDashboard() {
    if (!state.session || state.session.role !== 'admin') return;

    const all = state.complaints;
    const counts = computeMetrics(all);

    document.getElementById('admin-kpi-grid').innerHTML = `
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Total Complaints</span>
          <span class="kpi-icon kpi-blue" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.total}</div>
        <div class="kpi-foot">${counts.pending} pending &bull; ${counts.assigned + counts.inProgress} active &bull; ${counts.resolved} resolved</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Pending Complaints</span>
          <span class="kpi-icon kpi-amber" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.pending}</div>
        <div class="kpi-foot">Require triage &amp; staff assignment</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">In Progress Complaints</span>
          <span class="kpi-icon kpi-cyan" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.inProgress}</div>
        <div class="kpi-foot">Plus ${counts.assigned} assigned in queue</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Resolved Complaints</span>
          <span class="kpi-icon kpi-emerald" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.resolved}</div>
        <div class="kpi-foot">${counts.total ? Math.round((counts.resolved / counts.total) * 100) : 0}% resolution rate</div>
      </article>
    `;

    document.getElementById('admin-cat-meta').textContent = `${all.length} total records`;
    renderCategoryBreakdown(document.getElementById('admin-category-breakdown'), all);
    renderRecentList(
      document.getElementById('admin-recent-list'),
      all,
      'No complaints recorded yet.'
    );

    const search = document.getElementById('admin-search').value.trim().toLowerCase();
    const catFilter = document.getElementById('admin-filter-category').value;
    const statusFilter = document.getElementById('admin-filter-status').value;
    const priorityFilter = document.getElementById('admin-filter-priority').value;

    const filtered = all
      .filter((c) => {
        if (catFilter !== 'all' && c.category !== catFilter) return false;
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
        if (search) {
          const hay = `${c.id} ${c.title} ${c.studentName} ${c.studentCode} ${c.category} ${c.location} ${c.assignedStaffName || ''}`.toLowerCase();
          if (!hay.includes(search)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    document.getElementById('admin-result-count').textContent = `${filtered.length} complaint${filtered.length === 1 ? '' : 's'}`;

    const tbody = document.getElementById('admin-table-body');
    const emptyEl = document.getElementById('admin-empty-state');

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyEl.classList.remove('hidden');
      emptyEl.innerHTML = `
        <div class="empty-state-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3>${all.length ? 'No complaints match these filters' : 'No complaints in registry'}</h3>
        <p>${all.length ? 'Reset or broaden your search and status/priority filters to view records.' : 'Submitted student complaints will appear here for review and assignment.'}</p>
      `;
      return;
    }

    emptyEl.classList.add('hidden');
    tbody.innerHTML = filtered
      .map(
        (c) => `
      <tr>
        <td><span class="mono-id">${escapeHTML(c.id)}</span></td>
        <td>
          <div class="table-issue-title">${escapeHTML(c.title)}</div>
          <div class="table-issue-sub">
            <span class="category-chip">${escapeHTML(c.category)}</span>
            ${c.location ? `<span>${escapeHTML(c.location)}</span>` : ''}
          </div>
        </td>
        <td>
          <div>${escapeHTML(c.studentName)}</div>
          <div class="field-hint">${escapeHTML(c.studentCode)}</div>
        </td>
        <td>${priorityBadgeHTML(c.priority)}</td>
        <td>${statusBadgeHTML(c.status)}</td>
        <td>${escapeHTML(c.assignedStaffName || 'Unassigned')}</td>
        <td>${escapeHTML(formatShortDate(c.createdAt))}</td>
        <td class="text-right">
          <div class="table-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-open-complaint="${escapeHTML(c.id)}">Manage</button>
            <button type="button" class="btn btn-danger-ghost btn-sm" data-delete-complaint="${escapeHTML(c.id)}" aria-label="Delete ${escapeHTML(c.id)}">Delete</button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  }

  /* ------------------------------------------------------------------------
     SCREEN 5: MAINTENANCE STAFF DASHBOARD (Strictly Scoped to Assigned Tasks)
  ------------------------------------------------------------------------ */
  function renderStaffDashboard() {
    if (!state.session || state.session.role !== 'staff') return;

    const assignedToMe = state.complaints.filter((c) => c.assignedStaffId === state.session.id);
    const counts = computeMetrics(assignedToMe);
    const activeCount = counts.assigned + counts.inProgress;

    document.getElementById('staff-welcome-heading').textContent = `Maintenance Workspace — ${state.session.name}`;
    document.getElementById('staff-specialty-subtitle').textContent =
      `Specialty: ${state.session.subtitle} (${state.session.identifier})`;
    document.getElementById('staff-scope-text').textContent =
      `Role Isolation Active: Showing only complaints assigned to ${state.session.name} (${state.session.identifier}). Unassigned or peer-assigned records are hidden.`;

    document.getElementById('staff-kpi-grid').innerHTML = `
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Total Assigned Tasks</span>
          <span class="kpi-icon kpi-blue" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.total}</div>
        <div class="kpi-foot">Assigned directly to you</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Pending Action (Assigned)</span>
          <span class="kpi-icon kpi-amber" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.assigned}</div>
        <div class="kpi-foot">Ready to begin work</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">In Progress Complaints</span>
          <span class="kpi-icon kpi-cyan" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.inProgress}</div>
        <div class="kpi-foot">${activeCount} total active tasks</div>
      </article>
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Resolved Complaints</span>
          <span class="kpi-icon kpi-emerald" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </span>
        </div>
        <div class="kpi-value">${counts.resolved}</div>
        <div class="kpi-foot">Previously completed tasks</div>
      </article>
    `;

    document.querySelectorAll('[data-staff-tab]').forEach((btn) => {
      const isSelected = btn.dataset.staffTab === state.staffTab;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    const search = document.getElementById('staff-search').value.trim().toLowerCase();
    const prioFilter = document.getElementById('staff-filter-priority').value;

    const filtered = assignedToMe
      .filter((c) => {
        if (state.staffTab === 'active' && c.status === 'Resolved') return false;
        if (state.staffTab === 'completed' && c.status !== 'Resolved') return false;
        if (prioFilter !== 'all' && c.priority !== prioFilter) return false;
        if (search) {
          const hay = `${c.id} ${c.title} ${c.description} ${c.category} ${c.location} ${c.studentName}`.toLowerCase();
          if (!hay.includes(search)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    document.getElementById('staff-result-count').textContent = `${filtered.length} task${filtered.length === 1 ? '' : 's'}`;

    const listEl = document.getElementById('staff-task-list');
    if (filtered.length === 0) {
      const hasAny = assignedToMe.length > 0;
      listEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3>${hasAny ? 'No tasks in this view' : 'No tasks assigned yet'}</h3>
          <p>${hasAny ? 'Switch between Active and Completed tabs or clear your filters.' : 'When an Administrator assigns a campus complaint to you, it will appear in your work queue.'}</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered
      .map(
        (c) => `
      <article class="staff-task-card">
        <div class="staff-task-header">
          <div>
            <span class="mono-id">${escapeHTML(c.id)}</span>
            <h3 class="staff-task-title">${escapeHTML(c.title)}</h3>
          </div>
          ${priorityBadgeHTML(c.priority)}
        </div>

        <div class="detail-badges-row">
          <span class="category-chip">${escapeHTML(c.category)}</span>
          ${statusBadgeHTML(c.status)}
        </div>

        <p class="staff-task-desc">${escapeHTML(c.description)}</p>

        <div class="staff-task-details">
          <div>
            <span class="staff-detail-label">Location</span>
            <span class="staff-detail-val">${escapeHTML(c.location || 'Campus General')}</span>
          </div>
          <div>
            <span class="staff-detail-label">Reported By</span>
            <span class="staff-detail-val">${escapeHTML(c.studentName)}</span>
          </div>
          <div>
            <span class="staff-detail-label">Submitted</span>
            <span class="staff-detail-val">${escapeHTML(formatShortDate(c.createdAt))}</span>
          </div>
          <div>
            <span class="staff-detail-label">Last Updated</span>
            <span class="staff-detail-val">${escapeHTML(formatShortDate(c.updatedAt))}</span>
          </div>
        </div>

        ${
          c.resolutionNotes
            ? `<div class="resolution-preview"><strong>Resolution Notes:</strong> ${escapeHTML(c.resolutionNotes)}</div>`
            : ''
        }

        <div class="staff-task-actions">
          ${
            c.status === 'Assigned'
              ? `<button type="button" class="btn btn-cyan btn-sm" data-staff-start="${escapeHTML(c.id)}">Start Work (In Progress)</button>`
              : '<span></span>'
          }
          <button type="button" class="btn ${c.status === 'Resolved' ? 'btn-secondary' : 'btn-primary'} btn-sm" data-open-complaint="${escapeHTML(c.id)}">
            ${c.status === 'Resolved' ? 'View Completed Details' : 'Update / Resolve Task'}
          </button>
        </div>
      </article>
    `
      )
      .join('');
  }

  function handleStaffQuickStart(complaintId) {
    if (!state.session || state.session.role !== 'staff') {
      showToast('error', 'Access Denied', 'Only Maintenance Staff can update task progress.');
      return;
    }

    const complaint = state.complaints.find((c) => c.id === complaintId);
    if (!complaint || complaint.assignedStaffId !== state.session.id) {
      showToast('error', 'Access Denied', 'You can only manage complaints assigned directly to you.');
      return;
    }

    if (complaint.status !== 'Assigned') return;

    const nowIso = new Date().toISOString();
    complaint.status = 'In Progress';
    complaint.updatedAt = nowIso;
    complaint.history.push({
      timestamp: nowIso,
      actor: `${state.session.name} (Maintenance Staff)`,
      action: 'Started work and updated status to In Progress',
      status: 'In Progress'
    });

    const saved = saveComplaints();
    if (!saved.ok) {
      showToast('error', 'Save Failed', saved.error);
      return;
    }

    renderStaffDashboard();
    showToast('info', 'Status Updated', `${complaint.id} is now In Progress.`);
  }

  /* ------------------------------------------------------------------------
     COMPLAINT DETAIL MODAL & ROLE-RESTRICTED MUTATIONS
  ------------------------------------------------------------------------ */
  function openComplaintModal(complaintId) {
    if (!state.session) return;
    const c = state.complaints.find((item) => item.id === complaintId);
    if (!c) return;

    // Enforce strict read permissions
    if (state.session.role === 'student' && c.studentId !== state.session.id) {
      showToast('error', 'Access Denied', 'Students may only inspect their own complaints.');
      return;
    }
    if (state.session.role === 'staff' && c.assignedStaffId !== state.session.id) {
      showToast('error', 'Access Denied', 'Staff may only inspect complaints assigned to them.');
      return;
    }

    document.getElementById('modal-complaint-id').textContent = c.id;
    document.getElementById('modal-complaint-title').textContent = c.title;

    const attachmentHTML = isSafeImageDataUrl(c.imageData)
      ? `
        <div class="detail-section">
          <h3>Attached Evidence Image ${c.imageName ? `(${escapeHTML(c.imageName)})` : ''}</h3>
          <img class="detail-attachment-img" src="${c.imageData}" alt="Attachment for ${escapeHTML(c.id)}" />
        </div>
      `
      : '';

    const historyHTML = `
      <div class="detail-section">
        <h3>Complaint Audit History</h3>
        <ul class="history-timeline">
          ${[...c.history]
            .reverse()
            .map(
              (h) => `
            <li>
              <div>
                <strong>${escapeHTML(h.action)}</strong>
                <div class="field-hint">${escapeHTML(h.actor)} &bull; Stage: ${escapeHTML(h.status)}</div>
              </div>
              <span class="history-time">${escapeHTML(formatDateTime(h.timestamp))}</span>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    `;

    let rolePanelHTML = '';
    if (state.session.role === 'admin') {
      const staffOptions = DEMO_USERS.staff
        .map(
          (s) =>
            `<option value="${escapeHTML(s.id)}" ${c.assignedStaffId === s.id ? 'selected' : ''}>${escapeHTML(s.name)} (${escapeHTML(s.subtitle)})</option>`
        )
        .join('');

      rolePanelHTML = `
        <form id="admin-manage-form" class="role-action-box" data-complaint-id="${escapeHTML(c.id)}">
          <h3>Administrator Triage &amp; Assignment</h3>
          <div class="form-row-2">
            <div class="form-group">
              <label for="admin-edit-priority" class="field-label">Priority Level</label>
              <select id="admin-edit-priority" class="form-control">
                ${PRIORITIES.map((p) => `<option value="${p}" ${c.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="admin-edit-staff" class="field-label">Assign Maintenance Staff</label>
              <select id="admin-edit-staff" class="form-control">
                <option value="">Unassigned</option>
                ${staffOptions}
              </select>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label for="admin-edit-status" class="field-label">Workflow Status</label>
              <select id="admin-edit-status" class="form-control">
                ${STATUSES.map((s) => `<option value="${s}" ${c.status === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="admin-edit-note" class="field-label">Admin / Resolution Note (Optional)</label>
              <input type="text" id="admin-edit-note" class="form-control" maxlength="250" value="${escapeHTML(c.resolutionNotes)}" placeholder="Add triage or closure notes..." />
            </div>
          </div>
          <div class="modal-footer-actions">
            <button type="button" id="btn-modal-delete-complaint" class="btn btn-danger-ghost" data-delete-complaint="${escapeHTML(c.id)}">Delete Record</button>
            <button type="submit" class="btn btn-primary">Save Admin Changes</button>
          </div>
        </form>
      `;
    } else if (state.session.role === 'staff') {
      if (c.status === 'Resolved') {
        rolePanelHTML = `
          <div class="role-action-box">
            <h3>Task Completed</h3>
            <p class="field-hint">This complaint was marked <strong>Resolved</strong>. Resolution notes are locked for audit consistency.</p>
          </div>
        `;
      } else {
        rolePanelHTML = `
          <form id="staff-update-form" class="role-action-box" data-complaint-id="${escapeHTML(c.id)}" novalidate>
            <h3>Technician Progress &amp; Resolution Update</h3>
            <div class="form-group">
              <label for="staff-edit-status" class="field-label">Update Status</label>
              <select id="staff-edit-status" class="form-control">
                <option value="Assigned" ${c.status === 'Assigned' ? 'selected' : ''}>Assigned (Queued)</option>
                <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress (Repair Underway)</option>
                <option value="Resolved">Resolved (Work Completed)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="staff-edit-notes" class="field-label">Resolution / Work Notes <span class="optional-tag">(Required when marking Resolved)</span></label>
              <textarea id="staff-edit-notes" class="form-control textarea-control" rows="3" maxlength="500" placeholder="Describe inspection findings, parts replaced, or verification steps...">${escapeHTML(c.resolutionNotes)}</textarea>
              <p id="err-staff-notes" class="field-error" role="alert"></p>
            </div>
            <div class="modal-footer-actions">
              <button type="submit" class="btn btn-success">Update Task Status</button>
            </div>
          </form>
        `;
      }
    }

    const bodyEl = document.getElementById('complaint-modal-body');
    bodyEl.innerHTML = `
      <div class="detail-badges-row">
        <span class="category-chip">${escapeHTML(c.category)}</span>
        ${priorityBadgeHTML(c.priority)}
        ${statusBadgeHTML(c.status)}
      </div>

      ${pipelineStepperHTML(c.status)}

      <div class="detail-meta-grid">
        <div class="detail-meta-item">
          <label>Reported By</label>
          <span>${escapeHTML(c.studentName)} (${escapeHTML(c.studentCode)})</span>
        </div>
        <div class="detail-meta-item">
          <label>Campus Location</label>
          <span>${escapeHTML(c.location || 'Not specified')}</span>
        </div>
        <div class="detail-meta-item">
          <label>Assigned Maintenance Staff</label>
          <span>${escapeHTML(c.assignedStaffName || 'Awaiting Admin Assignment')}</span>
        </div>
        <div class="detail-meta-item">
          <label>Submitted / Last Updated</label>
          <span>${escapeHTML(formatDateTime(c.createdAt))} &bull; ${escapeHTML(formatShortDate(c.updatedAt))}</span>
        </div>
      </div>

      <div class="detail-section">
        <h3>Issue Description</h3>
        <div class="detail-description-box">${escapeHTML(c.description)}</div>
      </div>

      ${
        c.resolutionNotes
          ? `<div class="detail-section">
               <h3>Resolution Notes</h3>
               <div class="resolution-preview">${escapeHTML(c.resolutionNotes)}</div>
             </div>`
          : ''
      }

      ${attachmentHTML}
      ${rolePanelHTML}
      ${historyHTML}
    `;

    // Auto-transition status to Assigned when Admin selects a staff member on a Pending ticket
    const adminStaffSelect = document.getElementById('admin-edit-staff');
    const adminStatusSelect = document.getElementById('admin-edit-status');
    if (adminStaffSelect && adminStatusSelect) {
      adminStaffSelect.addEventListener('change', function () {
        if (adminStaffSelect.value && adminStatusSelect.value === 'Pending') {
          adminStatusSelect.value = 'Assigned';
        }
      });
    }

    const adminForm = document.getElementById('admin-manage-form');
    if (adminForm) {
      adminForm.addEventListener('submit', handleAdminManageSubmit);
    }

    const staffForm = document.getElementById('staff-update-form');
    if (staffForm) {
      staffForm.addEventListener('submit', handleStaffModalSubmit);
    }

    document.getElementById('complaint-modal').classList.remove('hidden');
  }

  function closeComplaintModal() {
    document.getElementById('complaint-modal').classList.add('hidden');
  }

  function handleAdminManageSubmit(event) {
    event.preventDefault();
    if (!state.session || state.session.role !== 'admin') {
      showToast('error', 'Access Denied', 'Administrator privileges are required for this action.');
      return;
    }

    const complaintId = event.currentTarget.dataset.complaintId;
    const complaint = state.complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    const newPriority = document.getElementById('admin-edit-priority').value;
    const newStaffId = document.getElementById('admin-edit-staff').value;
    let newStatus = document.getElementById('admin-edit-status').value;
    const newNote = document.getElementById('admin-edit-note').value.trim();

    if (!PRIORITIES.includes(newPriority) || !STATUSES.includes(newStatus)) return;

    const staffObj = DEMO_USERS.staff.find((s) => s.id === newStaffId) || null;
    if (staffObj && newStatus === 'Pending') {
      newStatus = 'Assigned';
    }
    if (!staffObj && newStatus === 'Assigned') {
      showToast('warning', 'Select Staff Member', 'Please assign a maintenance technician when setting status to Assigned.');
      return;
    }

    const changes = [];
    if (complaint.priority !== newPriority) changes.push(`Priority: ${newPriority}`);
    if ((complaint.assignedStaffId || '') !== (staffObj ? staffObj.id : '')) {
      changes.push(staffObj ? `Assigned to ${staffObj.name}` : 'Unassigned staff');
    }
    if (complaint.status !== newStatus) changes.push(`Status: ${newStatus}`);
    if (complaint.resolutionNotes !== newNote && newNote) changes.push('Updated notes');

    const nowIso = new Date().toISOString();
    complaint.priority = newPriority;
    complaint.assignedStaffId = staffObj ? staffObj.id : null;
    complaint.assignedStaffName = staffObj ? staffObj.name : null;
    complaint.status = newStatus;
    complaint.resolutionNotes = newNote;
    complaint.updatedAt = nowIso;

    if (changes.length > 0) {
      complaint.history.push({
        timestamp: nowIso,
        actor: `${state.session.name} (Administrator)`,
        action: changes.join(' | '),
        status: newStatus
      });
    }

    const saved = saveComplaints();
    if (!saved.ok) {
      showToast('error', 'Save Failed', saved.error);
      return;
    }

    closeComplaintModal();
    renderAdminDashboard();
    showToast('success', 'Record Updated', `${complaint.id} saved (${newStatus}, ${newPriority} priority).`);
  }

  function handleStaffModalSubmit(event) {
    event.preventDefault();
    if (!state.session || state.session.role !== 'staff') {
      showToast('error', 'Access Denied', 'Maintenance Staff privileges are required.');
      return;
    }

    const complaintId = event.currentTarget.dataset.complaintId;
    const complaint = state.complaints.find((c) => c.id === complaintId);
    if (!complaint || complaint.assignedStaffId !== state.session.id) {
      showToast('error', 'Access Denied', 'You can only update complaints assigned to you.');
      return;
    }

    const newStatus = document.getElementById('staff-edit-status').value;
    const notesEl = document.getElementById('staff-edit-notes');
    const errEl = document.getElementById('err-staff-notes');
    const notes = notesEl.value.trim();

    notesEl.classList.remove('is-invalid');
    errEl.textContent = '';

    if (!['Assigned', 'In Progress', 'Resolved'].includes(newStatus)) return;
    if (newStatus === 'Resolved' && notes.length < 8) {
      notesEl.classList.add('is-invalid');
      errEl.textContent = 'Please enter clear resolution notes (at least 8 characters) before marking Resolved.';
      return;
    }

    const nowIso = new Date().toISOString();
    complaint.status = newStatus;
    complaint.resolutionNotes = notes;
    complaint.updatedAt = nowIso;
    complaint.history.push({
      timestamp: nowIso,
      actor: `${state.session.name} (Maintenance Staff)`,
      action:
        newStatus === 'Resolved'
          ? `Marked Resolved — "${notes.slice(0, 90)}${notes.length > 90 ? '...' : ''}"`
          : `Updated task status to ${newStatus}`,
      status: newStatus
    });

    const saved = saveComplaints();
    if (!saved.ok) {
      showToast('error', 'Save Failed', saved.error);
      return;
    }

    closeComplaintModal();
    renderStaffDashboard();
    showToast('success', 'Task Updated', `${complaint.id} marked as ${newStatus}.`);
  }

  function requestDeleteComplaint(complaintId) {
    if (!state.session || state.session.role !== 'admin') {
      showToast('error', 'Access Denied', 'Only Administrators can delete complaint records.');
      return;
    }

    openConfirmModal(
      'Delete Complaint Record',
      `Are you sure you want to permanently delete ${complaintId}? This action cannot be undone.`,
      'Delete Complaint',
      function () {
        state.complaints = state.complaints.filter((c) => c.id !== complaintId);
        saveComplaints();
        closeComplaintModal();
        renderAdminDashboard();
        showToast('info', 'Complaint Deleted', `${complaintId} was removed from LocalStorage.`);
      }
    );
  }

  function requestResetDemoData() {
    openConfirmModal(
      'Reset Demo Data',
      'This will restore the default 8 fictional sample complaints in browser LocalStorage and discard custom edits. Continue?',
      'Reset Demo Data',
      function () {
        state.complaints = createSeedComplaints();
        saveComplaints();
        safeStorageSet(STORAGE_KEYS.COUNTER, '1008');
        updateLoginStorageCount();
        closeComplaintModal();
        if (state.currentScreen !== 'login') {
          renderActiveScreenData(state.currentScreen);
        }
        showToast('success', 'Demo Data Restored', 'Loaded fresh sample complaints across all categories and statuses.');
      }
    );
  }

  /* ------------------------------------------------------------------------
     MOBILE SIDEBAR DRAWER HELPERS
  ------------------------------------------------------------------------ */
  function openMobileSidebar() {
    document.getElementById('sidebar').classList.add('is-open');
    document.getElementById('sidebar-backdrop').classList.remove('hidden');
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('is-open');
    document.getElementById('sidebar-backdrop').classList.add('hidden');
  }

  /* ------------------------------------------------------------------------
     EVENT WIRING & INITIALIZATION
  ------------------------------------------------------------------------ */
  function attachEventListeners() {
    // Login Role Selector
    document.querySelectorAll('.role-card').forEach((card) => {
      card.addEventListener('click', () => populateLoginAccounts(card.dataset.role));
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const userId = document.getElementById('login-account-select').value;
      signIn(state.selectedLoginRole, userId);
    });

    document.getElementById('btn-login-reset-demo').addEventListener('click', requestResetDemoData);

    // Sidebar Navigation & Sign Out
    document.getElementById('sidebar-nav').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-nav-screen]');
      if (btn) navigateToScreen(btn.dataset.navScreen);
    });

    document.getElementById('btn-logout').addEventListener('click', signOut);
    document.getElementById('btn-topbar-logout').addEventListener('click', signOut);
    document.getElementById('btn-sidebar-reset').addEventListener('click', requestResetDemoData);
    document.getElementById('btn-admin-reset-demo').addEventListener('click', requestResetDemoData);

    document.getElementById('btn-mobile-menu').addEventListener('click', openMobileSidebar);
    document.getElementById('btn-close-sidebar').addEventListener('click', closeMobileSidebar);
    document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);

    // Screen Navigation Quick Actions
    document.getElementById('btn-go-submit').addEventListener('click', () => navigateToScreen('submit-complaint'));
    document.getElementById('btn-back-student-dash').addEventListener('click', () => navigateToScreen('student-dashboard'));

    // Student Filters
    document.getElementById('student-search').addEventListener('input', renderStudentDashboard);
    document.getElementById('student-filter-category').addEventListener('change', renderStudentDashboard);
    document.getElementById('student-filter-status').addEventListener('change', renderStudentDashboard);
    document.getElementById('btn-student-clear-filters').addEventListener('click', () => {
      document.getElementById('student-search').value = '';
      document.getElementById('student-filter-category').value = 'all';
      document.getElementById('student-filter-status').value = 'all';
      renderStudentDashboard();
    });

    // Submission Form
    document.getElementById('comp-description').addEventListener('input', (e) => {
      document.getElementById('comp-desc-counter').textContent = `${e.target.value.length} / 600`;
    });

    const imageInput = document.getElementById('comp-image');
    const dropzone = document.getElementById('upload-dropzone');
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleImageSelection(file);
    });
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      handleImageSelection(file);
    });

    document.getElementById('btn-remove-image').addEventListener('click', clearPendingAttachment);
    document.getElementById('btn-reset-form').addEventListener('click', clearSubmissionForm);
    document.getElementById('complaint-form').addEventListener('submit', handleComplaintSubmit);

    // Admin Filters
    document.getElementById('admin-search').addEventListener('input', renderAdminDashboard);
    document.getElementById('admin-filter-category').addEventListener('change', renderAdminDashboard);
    document.getElementById('admin-filter-status').addEventListener('change', renderAdminDashboard);
    document.getElementById('admin-filter-priority').addEventListener('change', renderAdminDashboard);
    document.getElementById('btn-admin-clear-filters').addEventListener('click', () => {
      document.getElementById('admin-search').value = '';
      document.getElementById('admin-filter-category').value = 'all';
      document.getElementById('admin-filter-status').value = 'all';
      document.getElementById('admin-filter-priority').value = 'all';
      renderAdminDashboard();
    });

    // Staff Tabs & Filters
    document.querySelectorAll('[data-staff-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.staffTab = tab.dataset.staffTab;
        renderStaffDashboard();
      });
    });
    document.getElementById('staff-search').addEventListener('input', renderStaffDashboard);
    document.getElementById('staff-filter-priority').addEventListener('change', renderStaffDashboard);
    document.getElementById('btn-staff-clear-filters').addEventListener('click', () => {
      document.getElementById('staff-search').value = '';
      document.getElementById('staff-filter-priority').value = 'all';
      renderStaffDashboard();
    });

    // Delegated Click Handlers for Opening Details, Deleting, & Staff Quick-Start
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-complaint]');
      if (openBtn) {
        openComplaintModal(openBtn.dataset.openComplaint);
        return;
      }

      const delBtn = e.target.closest('[data-delete-complaint]');
      if (delBtn) {
        requestDeleteComplaint(delBtn.dataset.deleteComplaint);
        return;
      }

      const startBtn = e.target.closest('[data-staff-start]');
      if (startBtn) {
        handleStaffQuickStart(startBtn.dataset.staffStart);
      }
    });

    // Modals Close & Keyboard Escape
    document.getElementById('btn-close-complaint-modal').addEventListener('click', closeComplaintModal);
    document.getElementById('complaint-modal').addEventListener('click', (e) => {
      if (e.target.id === 'complaint-modal') closeComplaintModal();
    });

    document.getElementById('btn-close-confirm-modal').addEventListener('click', closeConfirmModal);
    document.getElementById('btn-confirm-cancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
      if (e.target.id === 'confirm-modal') closeConfirmModal();
    });
    document.getElementById('btn-confirm-proceed').addEventListener('click', () => {
      const cb = state.confirmCallback;
      closeConfirmModal();
      if (typeof cb === 'function') cb();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!document.getElementById('confirm-modal').classList.contains('hidden')) {
          closeConfirmModal();
        } else if (!document.getElementById('complaint-modal').classList.contains('hidden')) {
          closeComplaintModal();
        }
      }
    });
  }

  function init() {
    loadInitialData();
    attachEventListeners();
    populateLoginAccounts('student');

    if (state.session && ROLE_ALLOWED_SCREENS[state.session.role]) {
      navigateToScreen(ROLE_ALLOWED_SCREENS[state.session.role][0]);
    } else {
      navigateToScreen('login');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
