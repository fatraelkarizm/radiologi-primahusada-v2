# Infrastructure & Architecture Guide

## 1. Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js v5 (Beta) - Credentials based authentication.
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives & generic Shadcn-like components.
- **Icons**: Lucide React
- **Language**: TypeScript (Strict Mode)

## 2. Directory Structure
```text
/app
  /(auth)         - Publicly accessible authentication routes (e.g., /login).
  /(dashboard)    - Main protected layout. Next.js App Router folders representing feature modules.
  /api            - Next.js Route Handlers (RESTful API representations if consumed by 3rd-party).
/components       - Reusable React components (buttons, dialogs, sidebars).
/lib              - Core application utilities.
  /repositories   - Data Access Layer: Handles all Prisma queries.
  /services       - Business Logic Layer: Validates input and orchestrates repositories.
/prisma           - Database schema (schema.prisma) and seed data.
```

## 3. Architecture Pattern: HSR (Handler-Service-Repository)
This project enforces the HSR layered architecture to keep code decoupled, modular, and easy to test.

### **Flow:** `Handler (API Route / Server Action) → Service → Repository → Database`

1. **Repository Layer (`lib/repositories/`)**:
   - Contains 100% of Prisma logic.
   - Example: `patientRepository.ts`
   - Functions should only receive validated and sanitized data and return DB records.
   - Never access Next.js specific headers, cookies, or request objects here.

2. **Service Layer (`lib/services/`)**:
   - Contains business logic (calculations, complex validations, integrating multiple repositories).
   - Example: `patientService.ts`
   - Services throw predictable errors or return standardized data wrappers.

3. **Handler Layer (`app/` or `app/api/`)**:
   - For internal UI state changes, use **Server Actions**.
   - For external or AJAX data sources, use `app/api/.../route.ts`.
   - Responsible for extracting `FormData` or `Request` bodies, checking session states (Authorization), and returning standardized JSON configurations using `NextResponse` or Server Actions result states.

## 4. UI Consistency Standard
- **Primary Domain Color**: Use `#125eab` (Custom Blue) for interactive states, primary action buttons, hover emphasis, text highlights, and standard branding.
- **State Colors**:
  - Destructive/Errors/Logout: `red-600`
  - Warning/Pending: `amber-500`
  - Success/Confirmed: `green-600`
- **Tailwind Principles**: Build responsive, fluid UIs without creating custom `.css` files unless overriding global tokens in `globals.css`.
- **Navigation (Sidebar)**: Built uniformly inside `components/Sidebar.tsx` utilizing Lucide-react for icon continuity.

## 5. CRUD Implementation Paradigm
- All newly built features MUST use real PostgreSQL models via `prisma`. **No hardcoded mock files**.
- All lists/tables should ideally be rendered via **Server Components** by querying the repository straight away, bypassing `fetch('/api/...')` when possible to maximize SSR/RSC benefits.
- Form submissions should mutate data via **Server Actions** triggering `revalidatePath(...)` or via API routes pushing state upwards.
