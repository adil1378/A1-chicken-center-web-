# A1 Chicken Center — 8-Phase Development Plan

This document outlines the roadmap for engineering and releasing the web platform for **A1 Chicken Center**. The development is divided into 8 distinct phases, each verified and committed incrementally.

---

## Roadmap Overview

```
Phase 1: Foundation & Architecture (Current)
   │
Phase 2: Cinematic Frontend & Animations
   │
Phase 3: Product Catalog & Shopping UI
   │
Phase 4: Backend, Database & Admin Foundation
   │
Phase 5: Ordering & Checkout System
   │
Phase 6: AI Chatbot
   │
Phase 7: WhatsApp & Business Management
   │
Phase 8: Testing, Optimization & Deployment
```

---

## Phase Details

### Phase 1 — Foundation & Architecture (Active)
* **Goal**: Establish the monorepo structure, core frameworks, environment configuration, design system tokens, and baseline health checks.
* **Deliverables**:
  * Monorepo directory structure: `apps/web`, `apps/api`, `supabase/migrations`, `docs/`.
  * Working Next.js App Router with TypeScript and npm.
  * Working FastAPI backend with Python 3.12 virtual environment and `GET /health` endpoint.
  * Supabase migrations directory structure.
  * Environment variable templates (`.env.example`) and comprehensive `.gitignore`.
  * Design tokens: color palette (black, white, red/crimson), typography, spacing, and breakpoints.
  * Baseline automated verification tests for both frontend and backend.
* **Exit Criteria**:
  * Frontend starts locally and passes TypeScript/lint checks.
  * Backend starts locally and passes unit tests (`GET /health`).
  * Changes committed and pushed to GitHub repository.

---

### Phase 2 — Cinematic Frontend & Animations
* **Goal**: Deliver a high-impact, cinematic brand presentation and cutting-edge butchery animations.
* **Deliverables**:
  * Whole chicken opening visual sequence.
  * Butcher-style precision cutting sequence highlighting sanitation and skill.
  * Scroll-driven chicken-part separation (legs, breast, wings, drumsticks).
  * GSAP + ScrollTrigger integration.
  * Blender-rendered and video animation asset integration (`6307848485714535697.mp4`).
  * Mobile-responsive motion design and lightweight fallback states.
  * Cinematic page and section transitions.

---

### Phase 3 — Product Catalog & Shopping UI
* **Goal**: Enable customers to explore, customize, and configure fresh cuts with zero friction.
* **Deliverables**:
  * Category-wise product showcase:
    * Curry Cut Chicken (with skin / skinless)
    * Boneless Chicken Breast & Cubes
    * Chicken Legs & Drumsticks
    * Chicken Lollipop & Wings
    * Whole Dressed Chicken
    * Country / Desi Chicken
    * Farm Fresh Eggs
  * Detailed product modals with cut customization (piece size, skin on/off, keema).
  * Weight selectors (500g, 1kg, custom kg increments).
  * Interactive slide-out cart drawer with live subtotal calculation.

---

### Phase 4 — Backend, Database & Admin Foundation
* **Goal**: Build data models, database migrations, and a secure administration interface.
* **Deliverables**:
  * Supabase PostgreSQL schema: products, categories, daily prices, inventory, and orders.
  * FastAPI domain services, CRUD APIs, and Pydantic validation schemas.
  * Secure admin authentication and JWT session management.
  * Role-based permissions (Owner vs. Staff).
  * Product and category management dashboard.
  * Live daily market price board manager.
  * Global store settings (timings, delivery radius, shop status).

---

### Phase 5 — Ordering & Checkout System
* **Goal**: Complete end-to-end checkout flow for both delivery and store pickup.
* **Deliverables**:
  * Shopping cart checkout flow.
  * Customer details form with address, landmark, and delivery instructions.
  * Fulfillment selector: Home Delivery vs. Shop Pickup.
  * Payment modes: Cash on Delivery (COD) / Pay at Shop.
  * Server-side order creation, idempotency, and input validation.
  * Order status tracking and confirmation screens.

---

### Phase 6 — AI Chatbot
* **Goal**: Conversational shopping assistant supporting multilingual customer interaction.
* **Deliverables**:
  * Floating widget and dedicated full-screen assistant modal.
  * Multilingual support: Hindi, English, and Hinglish.
  * RAG knowledge base for product cuts, recipes, hygiene guidelines, and daily prices.
  * Chat-guided order building (e.g., "1 kilo biryani cut chicken chahiye").
  * Real-time order status inquiries via conversation.

---

### Phase 7 — WhatsApp & Business Management
* **Goal**: Integrate WhatsApp business workflows, operational fulfillment, and analytics.
* **Deliverables**:
  * Automated WhatsApp order dispatch and customer confirmation messages.
  * Admin order lifecycle management (New, Preparing, Dispatched, Delivered, Cancelled).
  * Delivery charge calculation and custom pickup slot scheduling.
  * Customer profiles and conversation logs.
  * Business analytics: daily revenue, cut popularity, and repeat customer metrics.
  * Audit logging for price changes and inventory adjustments.

---

### Phase 8 — Testing, Optimization & Deployment
* **Goal**: Production readiness, performance optimization, and live deployment.
* **Deliverables**:
  * End-to-end integration tests across frontend, backend, and database.
  * Security audit (CORS, rate limiting, SQL injection defense, secret scanning).
  * Cross-browser and mobile device testing.
  * Asset compression, video lazy loading, and Core Web Vitals optimization.
  * Search Engine Optimization (SEO) with OpenGraph and structured schema data.
  * CI/CD deployment pipeline and production hosting setup.
