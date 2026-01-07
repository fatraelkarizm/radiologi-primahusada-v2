# Product Requirements Document (PRD) - Sidebar & UI Consistency

## 1. Overview
This document outlines the requirements for the Sidebar component and general UI consistency for the Klinik Prima Husada application. The goal is to ensure a professional, cohesive look using the defined primary color (`#125eab`) across all interactive elements.

## 2. Design Specifications

### 2.1. Color Palette
- **Primary Color**: `#125eab` (Blue)
  - Used for: Active menu items, hover states (background/text), primary buttons, branding text.
- **Secondary/Neutral**: 
  - Text: `slate-600` (inactive), `slate-800` (headings).
  - Background: `white` (sidebar), `slate-50` (main content/hover backgrounds).
- **Destructive**: `red-600` (Sign Out).

### 2.2. Sidebar Component
- **Layout**: Fixed width (`w-64`), fixed position (`left-0`), full height.
- **Branding**: 
  - Logo: `Logo_PH.jpg`
  - Text: "Klinik Prima Husada" (Primary Color).
- **Navigation Groups**:
  - **Beranda**: distinct entry, top level.
  - **MENU**: Collapsible sections (e.g., Pengaturan, Laporan) and direct links.
  - **PENGGUNA**: Account management (Langganan, Keluar).
- **Interactions**:
  - **Hover**: 
    - Text turns Primary Color (`#125eab`).
    - Background turns light blue (`bg-blue-50`) or Slate (`bg-slate-50`) depending on preference, but User requested consistency with Primary Color. A light shade of primary (`bg-[#125eab]/10` or `bg-blue-50`) is best for hover/active backgrounds.
  - **Active State**:
    - Text is Primary Color (`#125eab`).
    - Icon is Primary Color.
    - Background is explicit light primary (`bg-blue-50` or `bg-[#125eab]/10`).
    - Border: Optional left border strip or filled rounded background.

### 2.3. Menu Structure
1. **Beranda** (Home)
2. **MENU**
   - Pengaturan (Sub-menus: Klinik, Akun, Asuransi, Layanan, Poliklinik, Tenaga Medis, Default Lab, WA Broadcast)
   - Jadwal Dokter
   - Pasien
   - Rawat Jalan
   - Rekam Medis
   - Farmasi
   - Pembayaran
   - Laboratorium
   - Laporan (Sub-menus: Kunjungan, Keuangan)
   - PCare BPJS
   - Satu Sehat
3. **PENGGUNA**
   - Langganan
   - Keluar (Red hover/text)

## 3. Implementation Details
- **File**: `components/Sidebar.tsx`
- **Icons**: Lucide React.
- **State Management**: React `useState` for collapsing/expanding sub-menus.
- **Routing**: Next.js `usePathname` for active state detection.

## 4. Constraint Checklist
- [x] Use `#125eab` for all primary interactions.
- [x] Remove inconsistent colors (e.g., emerald green) unless specific status requires it (which is not the case for main nav).
- [x] Ensure "Beranda" matches the primary theme.

---

## 5. Backend Architecture

### 5.1. Architecture Pattern: HSR (Handler-Service-Repository)

The backend follows a clean, layered architecture pattern to ensure separation of concerns, testability, and maintainability.

**Layer Structure:**

```
API Route (Handler) → Service → Repository → Database
```

#### **Handler Layer** (API Routes)
- **Location**: `app/api/**route.ts`
- **Responsibility**: 
  - HTTP request/response handling
  - Input validation and sanitization
  - Authentication/authorization checks
  - Error formatting for client consumption
- **Example**: `app/api/patients/route.ts`

#### **Service Layer**
- **Location**: `lib/services/**`
- **Responsibility**:
  - Business logic implementation
  - Data transformation and validation
  - Orchestration of multiple repository calls
  - Transaction management
- **Example**: `lib/services/patientService.ts`

#### **Repository Layer**
- **Location**: `lib/repositories/**`
- **Responsibility**:
  - Direct database access via Prisma Client
  - Query construction and optimization
  - Data mapping between DB and domain models
- **Example**: `lib/repositories/patientRepository.ts`

### 5.2. Authentication & Authorization

- **Auth Provider**: NextAuth.js v5
- **Session Management**: JWT-based sessions
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: User roles (admin, doctor, staff, receptionist)

### 5.3. API Structure

**Naming Convention:**
- RESTful endpoints: `/api/[resource]` or `/api/[resource]/[id]`
- HTTP methods: GET, POST, PUT, DELETE

**Standard Response Format:**
```typescript
// Success
{ data: T, message?: string }

// Error
{ error: string, message: string, statusCode: number }
```

### 5.4. Database

- **ORM**: Prisma
- **Database**: PostgreSQL (recommended) or MySQL
- **Migration Strategy**: Prisma Migrate for schema changes
- **Seeding**: Development data via `prisma/seed.ts`

### 5.5. Data Flow Example

```
User clicks "Tambah Pasien" 
  ↓
Frontend sends POST /api/patients
  ↓
Handler validates input & auth
  ↓
Service applies business rules
  ↓
Repository creates patient record
  ↓
Response returns to frontend
```
