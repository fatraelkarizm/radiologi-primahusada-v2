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
