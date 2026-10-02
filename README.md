# 💍 Elysian Wedlock — Luxury Royal Wedding & Pan-India Vendor Directory

A modern, high-performance web platform crafted for luxury Indian weddings, royal vivah banquets, gourmet caterers, 4K cinematographers, and premium mandap decorators.

---

## 🌟 Key Features

### 1. 🏛️ Multi-Role Portals & Workspaces
- **👑 Platform Super-Admin Console:** Master verification council for vendor listing approvals, review moderation, escrow registry, and platform telemetry.
- **💍 Host / Couple Dashboard:** Vivah itinerary manager, real-time date reservations, 20% advance date-hold deposit simulation, budget calculators, and interactive chat.
- **🏢 Vendor Partner Workspaces (All 4 Core Sectors):**
  - **Marriage Halls & AC Banquets:** Capacity tiers (up to 1,500+ guests), AC/non-AC specs, valet parking, and lawn setups.
  - **Gourmet Catering:** Multi-course banquet menus, live counters, dietary filters, and per-plate pricing.
  - **4K Cinematography & Dual Drone Studios:** High-resolution portfolios, day rates, and camera specs.
  - **Mandap & Floral Staging:** Royal Rajwada themes, floral stage layouts, and ceiling height customizers.

### 2. 📅 Smart Wedding Planning & Utilities
- **Vedic Muhurtham Date Sync:** Pan-India auspicious dates calculator with `.ics` Smart Calendar export.
- **Global Currency Engine:** Real-time switcher supporting **₹ INR, $ USD, € EUR, £ GBP, and AED**.
- **Privacy & Role-Based Data Isolation:** Customer contacts and private records are protected and masked for unauthorized viewers.
- **Bulk Ledger Export:** Export reservations and bookings into CSV, JSON, or printable documents.
- **PDF Access Keys Export:** Secure PDF generator for platform evaluators (accessible via Super Admin).

---

## 🚀 Quick Start (Running in VS Code)

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [VS Code](https://code.visualstudio.com/)

### Installation Steps

1. **Clone or Extract the Project:**
   Open the project folder in VS Code (`File > Open Folder...`).

2. **Install Dependencies:**
   Open the integrated terminal (``Ctrl + ` ``) and run:
   ```bash
   npm install

   npm run dev
   http://localhost:3000

   ├── index.html                  # HTML5 Entry Point
├── package.json                # Project Manifest & NPM Dependencies
├── tsconfig.json               # TypeScript Configuration
├── vite.config.ts              # Vite Bundler & Tailwind Plugin Configuration
├── src/
│   ├── main.tsx                # React DOM Root Entry
│   ├── App.tsx                 # Main Application Layout & State Container
│   ├── index.css               # Global CSS & Tailwind Directives
│   ├── types.ts                # TypeScript Interfaces, Types, and Enums
│   ├── components/             # React Modular Components
│   │   ├── Navbar.tsx          # Navigation Header with Currency & Role Switchers
│   │   ├── HeroSection.tsx     # Luxury Hero Banner & Search
│   │   ├── MultiRolePortalPage.tsx # Unified Super-Admin, Vendor & Host Portals
│   │   ├── UserProfileDashboard.tsx # Client Profile, Bookings & Wishlist
│   │   ├── CredentialsPdfModal.tsx  # Super-Admin PDF Access Keys Downloader
│   │   ├── BulkExportModal.tsx # Booking Ledger CSV / JSON Exporter
│   │   └── SmartCalendarSyncModal.tsx # Muhurtham Calendar Sync
│   ├── services/
│   │   ├── databaseService.ts  # Client-Side Database & Local Persistence Engine
│   │   └── realtimeChatService.ts # Real-Time Chat Engine
│   └── utils/
│       ├── currencyFormatter.ts # Multi-Currency Conversion Utility
│       ├── privacyUtils.ts     # Data Masking & Privacy Scoping
│       └── credentialsPdfGenerator.ts # jsPDF Document Generator


