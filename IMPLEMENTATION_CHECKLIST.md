# DirectKey Backend Implementation Checklist

## Phase 0: Project Setup & Unified Architecture
- [x] Inspect existing repository structure and failure points
- [x] Create root unified `tsconfig.json`
- [x] Create unified Prisma schema encompassing all 13 domain modules (34 tables)
- [x] Generate Prisma Client and configure database layer (with PostgreSQL & in-process PGlite support)
- [x] Build robust database abstraction supporting transactional concurrency and ACID operations
- [x] Create environment configuration loader with validation (`.env.example` and `src/config/env.ts`)
- [x] Implement centralized structured logger (JSON, request IDs)
- [x] Implement global error handler, custom AppError, and async handler wrapper
- [x] Implement OpenAPI 3.0 / Swagger specification and interactive documentation route (`/api-docs` & `/api-docs/openapi.json`)

## Phase 1: Identity & Access Management (Module 1)
- [x] User schema with roles (`ADMIN`, `LANDLORD`, `AGENT`, `TENANT`)
- [x] Secure password hashing via native cryptographic scrypt
- [x] JWT authentication with Access & Refresh tokens
- [x] Roles & permissions middleware (`requireAuth`, `requireRole`, `requirePropertyManager`)
- [x] Agent authorization mapping (`AgentAssignment` model & checks with granular permissions)
- [x] Auth endpoints: `/api/v1/auth/register`, `/login`, `/refresh`, `/me`, `/change-password`, `/agents/assign`, `/agents/managed-properties`

## Phase 2: Property & Inventory Domain (Module 2)
- [x] Hierarchy: Property -> Building -> Unit -> Room -> Bed
- [x] Address and GPS coordinates (Lagos areas: Lekki, Yaba, Ikeja, etc.)
- [x] Ownership and agent authorization checks (`verifyPropertyAccess`)
- [x] CRUD endpoints for Property, Building, Unit, Room, Bed
- [x] Inventory availability computation and status tracking (`AVAILABLE`, `RESERVED`, `OCCUPIED`, `MAINTENANCE`, `INACTIVE`)

## Phase 3: Listings & Marketplace Domain (Module 3)
- [x] Separate `Listing` model from raw inventory
- [x] Search and filtering (Area, City, Min/Max Price, Bedrooms, Amenities, Billing Frequency, Sort Options)
- [x] Public listing details endpoint with atomic view counter increment
- [x] Viewing requests flow (`POST /api/v1/listings/:id/viewings`, status updates, host notes)
- [x] Enquiries flow (`POST /api/v1/listings/:id/enquiries`, landlord response)

## Phase 4: Verification & Trust (Module 4)
- [x] Property & Landlord verification submissions (ownership docs, C of O, meter photos, GPS coordinates)
- [x] Admin review queue, approval, rejection with reasons, info requests
- [x] Anti-self-verification rule: Admin cannot review/verify their own property
- [x] Suspicious listing reporting and moderation with automatic delisting action

## Phase 5: Rental Transactions & Reservations (Module 5)
- [x] Rental applications submission with income, employment, ID, and move-in date
- [x] Landlord application review (`APPROVED`, `DECLINED`, `UNDER_REVIEW`)
- [x] Concurrency-safe reservation hold with database-level row locking (`SELECT FOR UPDATE`)
- [x] Reservation expiration & release background cron worker (`src/lib/cron.ts`)
- [x] Automated concurrency test proving double-booking prevention (`tests/concurrency_reservation.test.ts`)

## Phase 6: Tenancy & Agreements (Modules 6 & 7)
- [x] Tenancy creation from approved applications/reservations
- [x] Tenancy states (`PENDING`, `ACTIVE`, `RENEWAL_PENDING`, `COMPLETED`, `TERMINATED`, `CANCELLED`)
- [x] Distinct date tracking: `startDate`, `endDate`, `propertyReadyDate`, `actualHandoverDate`, `commencementDate`, `actualMoveOutDate`
- [x] Tenancy agreement metadata, versioning, SHA-256 integrity hash, and dual digital signing (`tenantSignedAt`, `landlordSignedAt`)
- [x] Secondary occupants registration (`TenancyOccupant`)
- [x] Tenancy termination and status lifecycle updates

## Phase 7: Rent & Payments — NO ESCROW (Module 8)
- [x] Automated initial rent schedule generation (Rent, Caution Deposit, Service Charge)
- [x] Rent obligations vs recorded payments separation
- [x] Payment instructions & recipient bank accounts management (GTB, Zenith, etc.)
- [x] Tenant-reported payments with payment method, bank reference, and receipt evidence
- [x] Owner/Agent payment verification & rejection
- [x] Payment corrections, audit history, and balance reconciliation
- [x] Full Tenancy Ledger & Statement of Account endpoint (`/api/v1/payments/ledger/:tenancyId`)

## Phase 8: Maintenance & Tenant Issues/Disputes (Modules 9 & 10)
- [x] Maintenance request full lifecycle (`SUBMITTED` -> `UNDER_REVIEW` -> `APPROVED` -> `SCHEDULED` -> `IN_PROGRESS` -> `AWAITING_TENANT` -> `COMPLETED` -> `REJECTED`)
- [x] Contractor assignment, comments, attachments, cost tracking (`estimatedCost`, `actualCost`), and status logs
- [x] Tenant issue and dispute workflow (separate from physical maintenance)
- [x] Dispute categories, evidence, escalation to Admin, internal notes filtering for tenants, and resolution

## Phase 9: Inspections & Handover (Module 11)
- [x] Move-in and Move-out handover inspections
- [x] Area & item inspection checklist with pass/fail/repair and photos
- [x] Meter readings, key handover count, photo evidence
- [x] Dual-confirmation release OTP verification ("NO KEY, NO PAY")
- [x] Lease activation triggered on verified physical handover OTP

## Phase 10: Notifications & Background Automation (Module 12)
- [x] In-app notification creation, retrieval, unread count, and mark-as-read
- [x] Dev email logging adapter
- [x] Scheduled background jobs (reservation timeouts, rent due notices, lease expirations)

## Phase 11: Administration, Audit & Dashboards (Module 13)
- [x] Computed dashboard metrics:
  - Tenant dashboard summary (active tenancy, upcoming rent, open maintenance, issues)
  - Owner / Agent property & revenue metrics (occupancy rate, rent collected, pending actions)
  - Admin operational summaries & verification moderation queues
- [x] System-wide audit log for critical mutations (`GET /api/v1/dashboards/admin/audit-logs`)

## Phase 12: Testing, Verification & Delivery
- [x] Unit tests and integration tests for API endpoints across all roles
- [x] Concurrency tests proving double-booking prevention (`tests/concurrency_reservation.test.ts`)
- [x] Security and RBAC tests proving tenant/landlord/agent data isolation (`tests/auth.test.ts`)
- [x] Non-escrow payments and agreement tests (`tests/payment_tenancy.test.ts`)
- [x] Maintenance & No-Key-No-Pay OTP handover tests (`tests/maintenance_handover.test.ts`)
- [x] Seed script with realistic Lagos development accounts (`src/prisma/seed.ts`)
- [x] Full TypeScript compilation (`npm run build`, `npm run lint`) with 0 errors
- [x] 19 passing tests in test suite (`npm test`) with 100% pass rate
