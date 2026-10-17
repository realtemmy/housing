# DirectKey Production Backend API

A trust-focused rental transaction and property management backend API built in Node.js, Express 5, TypeScript, and Prisma 7 with PostgreSQL. Initially targeted for the Nigerian market, starting with Lagos.

---

## 1. Architectural Philosophy: Why Modular Monolith?

The repository previously suffered from fragmented microservices across multiple disconnected directories with unshared models, broken cross-service foreign keys, in-memory array mocks, and uncoordinated Kafka event loops that failed to compile or boot.

DirectKey requires **strict transactional guarantees** (ACID):
1. **Concurrency-Safe Double-Booking Prevention**: When a tenant reserves a unit, room, or bed, atomic row-level locking (`SELECT FOR UPDATE`) prevents any simultaneous reservation.
2. **"No Key, No Pay" Handover**: The physical key handover is verified by a dual 6-digit cryptographic OTP exchange that atomically transitions the lease to `ACTIVE` and the inventory to `OCCUPIED`.
3. **NO ESCROW**: DirectKey does not hold or custody funds. It records transparent rent obligations, tenant-reported transfer evidence, landlord account verifications, and audited balance corrections.

The **Modular Monolith** architecture consolidates these 13 domains into a single deployable service with clean domain boundaries, strict Zod validation, granular RBAC, and unified database migrations.

---

## 2. Domain Modules (13 Core Services)

1. **Identity & Access Management (`src/modules/auth`)**:
   - RBAC Roles: `TENANT`, `LANDLORD`, `AGENT`, `ADMIN`.
   - Native `crypto.scryptSync` password hashing.
   - JWT Access & Refresh token rotation.
   - Agent delegation mapping (`AgentAssignment`) with granular capability flags (`canManageListings`, `canManageApplications`, `canManageMaintenance`, `canRecordPayments`).

2. **Property & Inventory (`src/modules/property`)**:
   - Full domain hierarchy: `Property -> Building -> Unit -> Room -> Bed`.
   - Supports conventional flats, private rooms, and co-living/hostel bedspaces.
   - GPS coordinate geo-tagging and Lagos area indexing (Lekki Phase 1, Yaba, Ikeja, etc.).

3. **Listings & Marketplace (`src/modules/listing`)**:
   - Public marketplace search with area, price range, bedrooms, and property type filtering.
   - Atomic view count tracking.
   - Tenant viewing request workflows and host response management.
   - Tenant listing enquiries and responses.

4. **Verification & Trust (`src/modules/verification`)**:
   - Ownership title documents (C of O, Governor's Consent, Deed of Assignment).
   - Physical inspection verification (prepaid electricity meter serial numbers, GPS coordinates).
   - Anti-Self-Verification rule: Administrators are blocked from reviewing properties they own or submitted.
   - Public suspicious listing reporting with admin moderation & delisting actions.

5. **Rental Transactions & Concurrency (`src/modules/transaction`)**:
   - Rental applications with income, employment, guarantor, and move-in date details.
   - Landlord offer creation, negotiation, and tenant acceptance.
   - **Pessimistic row-locking reservation holds (`SELECT FOR UPDATE`)** preventing double-booking.
   - Scheduled expiration release of unconfirmed holds.

6. **Tenancy Management (`src/modules/tenancy`)**:
   - Tenancy lifecycle: `PENDING -> ACTIVE -> RENEWAL_PENDING -> COMPLETED / TERMINATED / CANCELLED`.
   - Distinct date tracking: `startDate`, `endDate`, `propertyReadyDate`, `actualHandoverDate`, `commencementDate`, `actualMoveOutDate`.
   - Secondary occupants registration (`TenancyOccupant`).

7. **Digital Tenancy Agreements (`src/modules/tenancy`)**:
   - Digital agreement versioning with SHA-256 cryptographic document integrity hashing.
   - Dual execution tracking (`tenantSignedAt`, `tenantSignIp`, `landlordSignedAt`, `landlordSignIp`).

8. **Rent & Payments — NO ESCROW (`src/modules/payment`)**:
   - DirectKey does not custody funds.
   - Rent obligations schedule (`RENT`, `CAUTION_DEPOSIT`, `SERVICE_CHARGE`).
   - Landlord bank payment instructions (NUBAN accounts: GTBank, Zenith, Access, etc.).
   - Tenant-reported payment evidence (teller/transfer screenshot URL, provider transaction reference).
   - Landlord confirmation & automated balance reduction (`balanceRemaining`).
   - Audited payment corrections and full statement of account / ledger.

9. **Maintenance Requests (`src/modules/maintenance`)**:
   - Physical repairs lifecycle (`SUBMITTED -> SCHEDULED -> IN_PROGRESS -> COMPLETED`).
   - Category (plumbing, electrical, appliance), cost tracking (`estimatedCost`, `actualCost`), and contractor assignment.
   - Internal vs external comments and status transition logs.

10. **Tenant Issues & Disputes (`src/modules/issue`)**:
    - Non-physical dispute workflows (noise disturbances, harassment, billing disagreements).
    - Evidence submission, escalation to Admin, and resolution tracking.

11. **Inspections & Handover (`src/modules/handover`)**:
    - Move-in and Move-out inspections.
    - Checklists with pass/fail/repair condition ratings and photos.
    - Meter readings and key counts.
    - **Dual 6-digit release OTP verification** ("NO KEY, NO PAY"): Handover is verified only when tenant reveals the release OTP upon physical key receipt.

12. **Notifications & Background Automation (`src/modules/notification`)**:
    - In-app notification center with read states and unread counts.
    - Scheduled cron workers releasing expired holds and checking upcoming rent dues.
    - Dev email logging adapter.

13. **Dashboards & Administration (`src/modules/dashboard`)**:
    - Computed metrics for Tenant Dashboard (active lease, upcoming rent, open requests).
    - Computed metrics for Owner/Agent Dashboard (occupancy rate, rent collected, pending actions).
    - Platform-wide Administrator metrics and moderation queues.
    - Comprehensive audit logs (`GET /api/v1/dashboards/admin/audit-logs`).

---

## 3. Quick Start & Setup

### Prerequisites
- Node.js >= 20
- PostgreSQL database (or automatic fallback to embedded in-process PGlite database)

### Installation
```bash
# Verify packages and TypeScript build
npm run build
npm run lint
```

### Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Default configuration automatically uses the embedded zero-network in-process PostgreSQL database (`@electric-sql/pglite`) if an external PostgreSQL database is not reachable.

### Database Seeding
To populate realistic Lagos real estate data (Lekki luxury residences, Yaba co-living hostel, landlords, agents, verified tenancies, and listings):
```bash
npm run prisma:seed
```

### Running the API Server
```bash
# Start in development watch mode
npm run dev

# Or build and start production server
npm run build
npm start
```
The server will boot on `http://localhost:4000`.

---

## 4. Interactive Documentation (Swagger / OpenAPI 3.0)

Once the server is running, visit:
- **Interactive Swagger UI**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
- **OpenAPI 3.0 JSON Specification**: [http://localhost:4000/api-docs/openapi.json](http://localhost:4000/api-docs/openapi.json)

---

## 5. Automated Test Suite

Run the full suite of integration and concurrency tests:
```bash
npm test
```
All 19 test cases across 5 test suites run and pass in under 4 seconds:
- `tests/auth.test.ts`: User registration, scrypt hashing, login, profile, and RBAC guards.
- `tests/property_listing.test.ts`: Property hierarchy, listings search with area/price filters, viewing requests, and enquiries.
- `tests/concurrency_reservation.test.ts`: **Double-booking prevention under concurrent requests** via DB row-locking (`SELECT FOR UPDATE`).
- `tests/payment_tenancy.test.ts`: Tenancy creation, rent obligations, payment instructions, tenant-reported transfer evidence, landlord verification, and digital agreement signing.
- `tests/maintenance_handover.test.ts`: Maintenance requests, checklists, and Move-In Handover OTP release ("NO KEY, NO PAY").

---

## 6. Seed Accounts (Lagos Environment)

| Role | Email | Password | Description |
|---|---|---|---|
| **ADMIN** | `admin@directkey.ng` | `Password123!` | System SuperAdmin & verification reviewer |
| **LANDLORD** | `femi.okonkwo@lagosprime.com` | `Password123!` | Owner of Lekki Peninsula Luxury Residences |
| **LANDLORD** | `kemi.balogun@propertyng.com` | `Password123!` | Owner of Yaba Tech Co-Living Hostel |
| **AGENT** | `tunde.bakare@keypointagents.ng` | `Password123!` | Assigned managing agent for Lekki property |
| **TENANT** | `olumide.adebayo@gmail.com` | `Password123!` | Prospective applicant & tenant |
| **TENANT** | `chioma.eze@gmail.com` | `Password123!` | Active tenant in Flat 2B, Lekki Phase 1 |
