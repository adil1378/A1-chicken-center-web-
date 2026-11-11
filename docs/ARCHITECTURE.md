# A1 Chicken Center — System Architecture

This document defines the high-level architecture, directory layout, design system tokens, and engineering standards for the **A1 Chicken Center** web platform.

---

## 1. High-Level Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │             Client Devices              │
                      │   (Mobile Web, Desktop, Tablet, PWA)    │
                      └────────────────────┬────────────────────┘
                                           │
                                     HTTPS / JSON
                                           │
                      ┌────────────────────▼────────────────────┐
                      │          apps/web (Next.js 15)          │
                      │  - App Router                           │
                      │  - TypeScript & React                   │
                      │  - Design Tokens (Black, White, Crimson)│
                      │  - GSAP Animation Engine (Phase 2)      │
                      │  - Client State & Shopping Cart         │
                      └────────────────────┬────────────────────┘
                                           │
                               REST API Calls (CORS enabled)
                                           │
                      ┌────────────────────▼────────────────────┐
                      │          apps/api (FastAPI)             │
                      │  - Python 3.12+ runtime                 │
                      │  - Pydantic Settings & Config           │
                      │  - Domain Services & Routing            │
                      │  - JWT & Role-Based Auth                │
                      │  - Order Validation Engine              │
                      └────────────────────┬────────────────────┘
                                           │
                               PostgreSQL Connection / RLS
                                           │
                      ┌────────────────────▼────────────────────┐
                      │          Supabase PostgreSQL            │
                      │  - Managed Database & Storage           │
                      │  - Database Migrations (`supabase/`)    │
                      │  - Row-Level Security (RLS) Policies    │
                      │  - Realtime Event Streams               │
                      └─────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
A1-chicken-center-web/
├── apps/
│   ├── web/                     # Next.js App Router (TypeScript, npm)
│   │   ├── src/
│   │   │   ├── app/             # App Router pages and layouts
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/      # UI components and layout widgets
│   │   │   ├── styles/          # Design tokens and theme definitions
│   │   │   └── types/           # Shared TypeScript interfaces
│   │   ├── public/              # Static media and assets
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   │
│   └── api/                     # FastAPI Application (Python 3.12+)
│       ├── app/
│       │   ├── core/            # Config, CORS, security, settings
│       │   │   ├── config.py
│       │   │   └── __init__.py
│       │   ├── api/             # API route handlers
│       │   │   ├── v1/
│       │   │   │   ├── health.py
│       │   │   │   └── __init__.py
│       │   │   └── __init__.py
│       │   ├── models/          # Pydantic schemas and database models
│       │   ├── services/        # Business logic services
│       │   └── main.py          # FastAPI application factory
│       ├── tests/               # Pytest automated test suites
│       │   ├── test_health.py
│       │   └── __init__.py
│       ├── pyproject.toml
│       └── requirements.txt
│
├── supabase/
│   └── migrations/              # SQL versioned migration scripts
│
├── docs/
│   ├── PHASE_PLAN.md            # Roadmap across all 8 development phases
│   └── ARCHITECTURE.md          # Architectural specifications (this file)
│
├── .env.example                 # Template for environment configuration
└── .gitignore                   # Exclusions for Node, Python, and environments
```

---

## 3. Design System & Design Tokens

The visual identity embodies a clean, modern, appetizing meat butchery.

### Color Tokens

```css
:root {
  /* Black & Neutral Backgrounds */
  --color-black-deep: #08080A;      /* Primary dark canvas */
  --color-black-surface: #121215;   /* Cards and modal surfaces */
  --color-black-border: #242429;    /* Subtle dividers and strokes */
  --color-gray-muted: #8E8E93;      /* Secondary text and metadata */

  /* White & Light Accents */
  --color-white-pure: #FFFFFF;      /* Primary high-contrast text */
  --color-white-off: #F4F4F6;       /* Soft headings and card highlights */

  /* Crimson & Butchery Reds */
  --color-red-primary: #DC2626;     /* Main action buttons, badges */
  --color-red-crimson: #991B1B;     /* Header gradients, active states */
  --color-red-dark: #7F1D1D;        /* Deep shadows, accents */
  --color-red-glow: rgba(220, 38, 38, 0.25); /* Subtle glow filters */

  /* Semantic Feedback */
  --color-status-success: #16A34A;  /* Available stock, order success */
  --color-status-warning: #D97706;  /* Limited stock */
  --color-status-danger: #DC2626;   /* Out of stock, error */
}
```

### Typography
* **Primary Sans-Serif**: Inter / Geist / System UI (`font-sans`)
* **Display / Headings**: Clean, high-impact bold weights (`font-display`, `font-bold`, `font-extrabold`)
* **Code / Metrics**: Monospace (`font-mono`) for prices, weights, and order codes

### Responsive Breakpoints
* `sm`: 640px (Small devices, portrait phones)
* `md`: 768px (Tablets, landscape phones)
* `lg`: 1024px (Laptops, small desktops)
* `xl`: 1280px (Standard desktops)
* `2xl`: 1536px (Large displays)

---

## 4. API Architecture & Standards

### FastAPI Routing & Endpoints
* **Prefix**: `/api/v1` for versioned routing.
* **Health Check**: `GET /health` returns application status, environment, and version.
* **CORS**: Configurable via `CORS_ORIGINS` environment variable, enabling `http://localhost:3000` during local development.
* **Validation**: All incoming payloads and outgoing responses use Pydantic v2 schemas.
* **Error Handling**: Standardized JSON error envelopes with structured error codes.

### Database Integration (Supabase)
* Database tables and schema changes are managed via SQL files in `supabase/migrations/`.
* Row Level Security (RLS) is enabled by default for all customer-facing tables.
* Server-side operations in `apps/api` utilize the service role key for administrative functions when authorized.

---

## 5. Coding & Contribution Standards

1. **Security First**: Secrets, tokens, and private keys must never be committed to source control.
2. **Strict Typing**: All Next.js frontend code is authored in TypeScript with strict mode enabled.
3. **Automated Verification**: Every phase must execute and pass tests before code is committed to Git.
4. **Phased Increments**: Code changes are strictly scoped to the active phase.
