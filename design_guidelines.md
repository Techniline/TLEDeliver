# DeliveryFlow App - Design Guidelines

## Design Approach
**Selected Approach:** Design System-Based (Material Design principles + Modern Admin Dashboard patterns)

**Justification:** DeliveryFlow is a utility-focused, information-dense internal tool requiring clarity, efficiency, and consistency. Drawing inspiration from Linear's clean admin interfaces, Notion's dashboard organization, and Material Design's robust form patterns.

**Core Principles:**
- **Clarity First:** Every status, action, and data point must be immediately comprehensible
- **Efficient Workflows:** Minimize clicks, maximize visibility of critical information
- **Trust & Reliability:** Professional appearance that instills confidence in the system

---

## Color Palette

### Dark Mode (Primary)
- **Background Layers:**
  - Base: 220 15% 10% (deep slate)
  - Surface: 220 14% 14% (cards, modals)
  - Elevated: 220 13% 18% (headers, active states)

- **Brand Colors:**
  - Primary: 212 100% 48% (vibrant blue - for CTAs, active slots)
  - Primary Hover: 212 100% 42%

- **Semantic Colors:**
  - Success (Approved): 142 76% 36% (green)
  - Warning (Pending): 38 92% 50% (amber)
  - Error (Rejected): 0 84% 60% (red)
  - Info: 199 89% 48% (cyan)

- **Text Hierarchy:**
  - Primary text: 210 20% 98%
  - Secondary text: 215 20% 65%
  - Tertiary/disabled: 215 16% 47%

- **Borders & Dividers:**
  - Subtle: 215 28% 17%
  - Prominent: 215 20% 25%

### Light Mode
- Base: 0 0% 100%
- Surface: 220 14% 96%
- Elevated: 220 13% 100%
- Adjust text/semantic colors for contrast

---

## Typography

**Font Stack:** 
- Primary: 'Inter' (Google Fonts) - exceptional readability for data-heavy interfaces
- Monospace: 'JetBrains Mono' (for DO numbers, timestamps)

**Scale:**
- **Page Headers:** text-3xl font-bold (30px)
- **Section Titles:** text-xl font-semibold (20px)
- **Card Headers:** text-lg font-medium (18px)
- **Body Text:** text-base (16px)
- **Table/Form Labels:** text-sm font-medium (14px)
- **Captions/Metadata:** text-xs (12px)

**Emphasis Patterns:**
- Status badges: text-xs font-semibold uppercase tracking-wider
- DO Numbers: font-mono text-sm
- Critical info (customer names): font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8** for consistency
- Micro spacing (badges, icons): p-2, gap-2
- Component internal: p-4, gap-4
- Section spacing: p-6, gap-6
- Page-level: p-8, py-12

**Grid System:**
- **Dashboard Container:** max-w-7xl mx-auto px-6
- **Two-column layouts:** grid-cols-1 lg:grid-cols-12 (sidebar 3 cols, main 9 cols)
- **Form columns:** grid-cols-1 md:grid-cols-2 gap-6
- **Table responsive:** overflow-x-auto with min-width constraints

**Vertical Rhythm:**
- Dashboard sections: space-y-6
- Form groups: space-y-4
- Table rows: py-3

---

## Component Library

### Navigation
- **Top Bar:** Fixed header (h-16) with logo, branch indicator, user profile, logout
- **Sidebar (Admin):** Fixed left sidebar (w-64) with nav links, active state with bg-primary/10 and left border accent
- **User Dashboard:** Horizontal tab navigation for "Create Request" and "My Requests"

### Forms & Inputs
- **Text Inputs:** h-10, rounded-lg, border-2, focus:ring-2 focus:ring-primary/50
- **Dropdowns:** Custom select with chevron icon, same styling as inputs
- **Textarea (Address):** min-h-24, resize-y
- **Radio/Checkbox Groups:** Horizontal layout with clear labels
- **Date/Time Pickers:** Calendar popup with slot visualization (green=available, red=blocked, yellow=pending)

### Data Display
- **Tables:** 
  - Sticky header with bg-elevated
  - Alternating row hover (hover:bg-surface/50)
  - Status badges with semantic colors (rounded-full px-3 py-1)
  - Action buttons as icon-only (edit/delete/approve/reject) with tooltips
  
- **Cards (Summary Dashboard):**
  - Rounded-xl border shadow-sm
  - Icon + metric (text-3xl font-bold) + label
  - Color-coded left border (4px) for category

- **Calendar View (Admin):**
  - Week grid with time slots as rows
  - Slot cards showing DO#, customer name, status dot
  - Drag-drop for driver assignment (visual indicator on hover)

### Modals & Overlays
- **Popup Backgrounds:** backdrop-blur-sm bg-black/50
- **Modal Container:** rounded-xl max-w-lg, shadow-2xl
- **Rejection Reason Modal:** Textarea (required) + Cancel/Submit buttons
- **Payment Comment Popup:** Smaller (max-w-md), auto-focus textarea

### Buttons
- **Primary (Submit/Approve):** bg-primary hover:bg-primary-hover, h-10 px-6 rounded-lg font-medium
- **Destructive (Reject/Delete):** bg-error hover:bg-error/90
- **Secondary (Cancel):** border-2 border-current hover:bg-surface
- **Icon Buttons:** w-9 h-9 rounded-lg hover:bg-surface/50

### Status & Badges
- **Status Pills:** Rounded-full, px-3 py-1, text-xs font-semibold
  - Pending: bg-warning/20 text-warning border border-warning/30
  - Approved: bg-success/20 text-success border border-success/30
  - Rejected: bg-error/20 text-error border border-error/30
  - Delivered: bg-blue-500/20 text-blue-400

- **Cargo Tags:** Rectangular, rounded-md, px-2 py-1, text-xs, icon prefix
  - FRAGILE: red theme
  - ELECTRONICS: blue theme
  - HEAVY: amber theme

### Notifications
- **Toast Position:** top-right, slide-in animation
- **Types:** Success (green), Error (red), Info (blue)
- **Auto-dismiss:** 5 seconds, close button

---

## User Dashboard Specific

**Hero/Header Section:**
- Full-width banner (h-32) with gradient from primary to primary-dark
- White text overlay with "Create Delivery Request" + branch selector
- Quick stats bar below (Today's deliveries, pending approvals)

**Form Layout:**
- Two-column responsive grid
- Logical grouping with section headers (Customer Info, Package Details, Payment, Delivery Slot)
- Conditional rendering with smooth transitions (payment comment popup)

**My Requests Table:**
- Search bar at top
- Filter chips (All, Pending, Approved, Rejected, Delivered)
- Expandable rows for rejection reasons (click to expand with slide-down animation)

---

## Admin Dashboard Specific

**Layout:**
- Sidebar navigation (Calendar, Pending Requests, Reports, Settings)
- Main content area with breadcrumb trail

**Calendar View:**
- Monthly/weekly toggle
- Color-coded slots (green=approved, yellow=pending, gray=blocked)
- Click slot to see details panel (slide-in from right)

**Pending Requests Table:**
- Batch actions (select multiple to approve)
- Quick action buttons (approve/reject) with confirmation
- Mandatory rejection reason modal (cannot submit without reason)

**Export Feature:**
- Dropdown filters (date range, branch, driver, status)
- Export button triggers CSV download with loading state

---

## Images
**No hero images required.** This is a utility application where screen real estate is precious. Focus on data density and functional clarity.

**Icons Only:**
- Use Heroicons (outline style) via CDN for consistency
- Navigation icons (calendar, clipboard, chart, cog)
- Status icons (check, x, clock, truck)
- Action icons (edit, trash, download, filter)

---

## Animations
**Minimal, purposeful only:**
- Modal enter/exit: fade + scale (200ms)
- Toast slide-in: translateX (300ms)
- Row expand: height transition (200ms)
- Button loading: spinner rotation
- **No parallax, no page transitions, no decorative animations**