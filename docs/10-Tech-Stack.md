# 10. Frontend Architecture & UI Design System

This document outlines the frontend frameworks, routing structures, component trees, state management principles, theme variables, and page layouts designed for the **CodeMind AI** client portal.

---

## 1. Frontend Tech Stack

The client dashboard is engineered with a modern, server-rendered React framework optimized for speed, security, and responsive layouts:

| Technology | Purpose | Implementation Details |
| :--- | :--- | :--- |
| **Next.js 15 (App Router)** | Framework | File-system routing, Server Actions, Server-side rendering (SSR). |
| **TypeScript** | Type Safety | Enforces interface parameters for API payloads. |
| **Tailwind CSS** | Styling | Utility-first CSS classes for layout layouts. |
| **shadcn/ui** | UI Component Kit | Accessible, customizable primitive inputs built on Radix UI. |
| **React Query (TanStack)** | Async Server State | Handles request caching, stale-while-revalidate, and auto-refetch. |
| **React Hook Form** | Form Handler | Performance-focused form control with minimal re-renders. |
| **Zod** | Schema Validation | Client-side input validation mapping database constraints. |
| **Axios** | HTTP Client | Base API config, interceptors, and Bearer token insertion. |
| **Framer Motion** | Micro-Animations | Smooth transitions, card hover effects, and loading indicators. |

---

## 2. Directory Layout & Architecture

```text
client/
│
├── app/                            # File-System Router Root
│   ├── (auth)/                     # Auth Route Group (layout isolation)
│   │   ├── login/                  # Login route page
│   │   └── register/               # Register route page
│   │
│   ├── dashboard/                  # Dashboard page
│   ├── projects/                   # Projects explorer
│   │   └── [id]/                   # Single project view
│   ├── reviews/                    # Review reports hub
│   │   └── [id]/                   # Interactive code editor review
│   ├── settings/                   # App preferences
│   ├── profile/                    # User account editor
│   ├── layout.tsx                  # Global App wrapper (Providers, Sidebar)
│   └── page.tsx                    # Landing SaaS page
│
├── components/                     # Reusable UI Blocks
│   ├── ui/                         # shadcn primitives (button, dialog, input)
│   ├── dashboard/                  # Score widgets, stats lists
│   ├── project/                    # Project upload panels, repo tables
│   ├── review/                     # Code viewer, annotation cards
│   ├── chat/                       # Live AI assistant panels
│   ├── report/                     # Export buttons, layouts
│   └── shared/                     # Sidebar navigation, footer, nav headers
│
├── hooks/                          # Custom React Hooks (useAuth, useProjects)
│   └── useAuth.ts
│   └── useProjects.ts
│
├── services/                       # API Service files (auth.ts, review.ts)
│   └── api.ts                      # Axios Client instance config
│
├── lib/                            # Libraries setup (e.g., tailwind-merge)
├── context/                        # React context engines (AuthContext, ThemeContext)
├── types/                          # Shared TypeScript interfaces
├── constants/                      # Nav routes, configuration configs
├── styles/                         # Tailwind global CSS definitions
└── public/                         # Static files, SVG icons, assets
```

---

## 3. UI Layout & Component Tree

The page layout encapsulates three core regions: Sidebar, Navbar, and Content Viewport.

```text
+-------------------------------------------------------------+
|                        Navbar Header                        |
+---------------------+---------------------------------------+
|  Sidebar            |                                       |
|  * Dashboard        |  Main Content Port                    |
|  * Projects         |  +---------------------------------+  |
|  * Reviews          |  | [Dashboard Widgets Scorecards]  |  |
|  * Settings         |  +---------------------------------+  |
|                     |  | [Recent Projects Table]         |  |
|                     |  +---------------------------------+  |
+---------------------+---------------------------------------+
|                        Footer Status                        |
+-------------------------------------------------------------+
```

### Dashboard Widget Layouts
1.  **Metric Cards**:
    *   `Total Code Reviews` (Count)
    *   `Active Project Imports` (Count)
    *   `Average Quality Score` (0-100 gauge)
    *   `Average Security Score` (0-100 gauge)
    *   `Remaining AI Token Credits` (Balance meter)
2.  **Code Upload Workspace**:
    *   Drag-and-drop workspace (supports ZIP up to 50MB).
    *   Text input for GitHub Repository URL mapping import.
3.  **Review Workspace**:
    *   File explorer column.
    *   Interactive read-only Monaco Code Editor highlighting warning lines.
    *   AI remediation cards panel displaying recommendations.

---

## 4. UI Design Tokens & Theme Colors

CodeMind AI implements a **Dark Mode First** dashboard design matching Vercel and GitHub styling standards:

### Color Palette (HSL tailwind configs)
*   **Base Background**: Dark HSL `#0F172A` (deep slate navy)
*   **Card Background**: Dark HSL `#1E293B` (slate gray)
*   **Primary Action**: Blue HSL `#2563EB` (vibrant blue)
*   **Primary Hover**: Blue HSL `#1D4ED8` (darker blue)
*   **Success Indicator**: Green HSL `#22C55E` (emerald)
*   **Warning Alert**: Amber HSL `#F59E0B` (orange/amber)
*   **Danger Alert**: Red HSL `#EF4444` (rose red)
*   **Standard Text**: HSL `#F8FAFC` (near white)
*   **Muted Text**: HSL `#94A3B8` (cool gray)

### Typography Hierarchy (Sans-Serif)
*   **Dashboard Headings**: `Inter Bold` / `Outfit`
*   **Standard Body text**: `Inter Regular`
*   **Code Lines & Logs**: `JetBrains Mono` / `Fira Code` (monospaced)

### Border Styles & Shadows
*   **Border Radius**: `12px` (standard card curve)
*   **Card Border Stroke**: `1px solid #334155` (subtle divider HSL)
*   **Card Shadow**: Medium depth shadow.

---

## 5. Responsive Design Breakpoints

The UI automatically adjusts layouts depending on target device widths:

| Breakpoint | Target Screen Width | Layout Shift Behavior |
| :--- | :--- | :--- |
| **Mobile** | `< 768px` | Sidebar collapses into a hamburger overlay. Dashboard cards stack vertically. |
| **Tablet** | `768px – 1024px` | Sidebar displays as a thin icon column. Table views hide minor columns. |
| **Laptop** | `1024px – 1440px` | Full Sidebar and columns display. |
| **Desktop** | `> 1440px` | Sidebar remains persistent, maximum viewport centered container cap (`1600px`). |

---

## 6. Client State Management Architecture

To balance performance and simplicity, state management is split:

1.  **React Context**: Manages client preferences (Auth sessions, JWT token persistence, Dark/Light Mode theme settings).
2.  **React Query (TanStack)**: Manages network cache states (caching project lists, history profiles, review files). Prevents excessive API queries.
3.  **Local state (`useState` / `useReducer`)**: Controls transient UI states (collapsing sections, active tab indexes, search query filters).

---

## 7. Protected Routing Rules

Routes are grouped into **Public** and **Protected** lists inside Next.js middlewares:

*   **Public Access**: `/` (Landing Page), `/login`, `/register`.
*   **Protected Access**: Checked on route entry. Directs non-auth users back to `/login` if requesting `/dashboard`, `/projects`, `/reviews`, `/profile`, `/settings`.
