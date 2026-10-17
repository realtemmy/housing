import { Router, Request, Response } from "express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "DirectKey Rental Transaction & Property Management API",
    version: "1.0.0",
    description: `
DirectKey is a trust-focused rental transaction and property management platform targeting the Nigerian market (initially Lagos).

### Core Features:
- **Trust & Verification**: Landlord and property verification cases, physical inspections, anti-self-verification rules.
- **Inventory Hierarchy**: Property -> Building -> Unit -> Room -> Bed supporting apartments, hostels, and co-living.
- **Listings & Marketplace**: Public discovery, advanced search, viewing requests, and enquiries.
- **Rental Transactions & Concurrency**: Applications, offers, and concurrency-safe reservation holds with DB row-locking to prevent double-booking.
- **Tenancy Management**: Distinct dates (readiness, handover, commencement), secondary occupants, and SHA-256 cryptographic digital agreements.
- **NO ESCROW Rent & Payments**: DirectKey does not custody funds. Tracks rent obligations, tenant-reported transfer evidence, owner verifications, and audited corrections.
- **Maintenance & Disputes**: Separate physical maintenance with status logs and contractor assignments from non-physical disputes.
- **"No Key, No Pay" Handover**: Move-in and move-out checklists, key counts, meter readings, and dual 6-digit release OTP verification.
- **Role-Based Dashboards**: Real-time computed metrics for Tenants, Property Managers, and Administrators.
    `,
    contact: {
      name: "DirectKey Engineering Team",
      email: "engineering@directkey.ng",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "DirectKey API v1",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from /api/v1/auth/login or /api/v1/auth/register",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user account (Tenant, Landlord, Agent)",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "firstName", "lastName", "phone"],
                properties: {
                  email: { type: "string", format: "email", example: "olumide.adebayo@example.com" },
                  password: { type: "string", minLength: 8, example: "SecretP@ss123" },
                  firstName: { type: "string", example: "Olumide" },
                  lastName: { type: "string", example: "Adebayo" },
                  phone: { type: "string", example: "+2348031234567" },
                  role: { type: "string", enum: ["TENANT", "LANDLORD", "AGENT"], default: "TENANT" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully with tokens" },
          409: { description: "Email or phone number already in use" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Authenticate user and receive JWT tokens",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful with tokens" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/properties": {
      get: {
        summary: "List properties with area/city filters",
        tags: ["Properties & Inventory"],
        parameters: [
          { name: "area", in: "query", schema: { type: "string" }, description: "Filter by area (e.g. Lekki, Yaba)" },
          { name: "city", in: "query", schema: { type: "string" } },
          { name: "mine", in: "query", schema: { type: "boolean" }, description: "Filter properties owned or managed by caller" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { 200: { description: "Paginated list of properties" } },
      },
      post: {
        summary: "Create a new property (Landlord/Agent/Admin)",
        tags: ["Properties & Inventory"],
        responses: { 201: { description: "Property created" } },
      },
    },
    "/listings/search": {
      get: {
        summary: "Search public marketplace listings with filters and sorting",
        tags: ["Listings & Marketplace"],
        security: [],
        parameters: [
          { name: "area", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "bedrooms", in: "query", schema: { type: "integer" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["newest", "price_asc", "price_desc", "popular"] } },
        ],
        responses: { 200: { description: "Paginated search results" } },
      },
    },
    "/transactions/reservations": {
      post: {
        summary: "Reserve an inventory item with temporary hold (Concurrency & Double-Booking Protected)",
        tags: ["Transactions & Reservations"],
        description: "Employs PostgreSQL row-locking (SELECT FOR UPDATE) to atomically verify and reserve inventory.",
        responses: {
          201: { description: "Inventory held under reservation" },
          409: { description: "Inventory item is already reserved or occupied" },
        },
      },
    },
    "/payments/records": {
      post: {
        summary: "Report bank transfer rent payment evidence (NO ESCROW)",
        tags: ["Rent & Payments (No Escrow)"],
        description: "DirectKey does not escrow or custody funds. The tenant submits proof of payment made directly to the owner/agent bank account.",
        responses: { 201: { description: "Payment recorded and queued for landlord verification" } },
      },
    },
    "/handovers/{id}/complete": {
      post: {
        summary: "Complete physical handover via dual 6-digit release OTP (NO KEY, NO PAY)",
        tags: ["Inspections & Handover"],
        description: "Verifies the physical inspection and transfers keys. Moves tenancy to ACTIVE status.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Handover completed and lease activated" } },
      },
    },
    "/dashboards/tenant": {
      get: {
        summary: "Get computed Tenant Dashboard metrics",
        tags: ["Dashboards"],
        responses: { 200: { description: "Tenant dashboard metrics" } },
      },
    },
    "/dashboards/owner": {
      get: {
        summary: "Get computed Landlord / Agent Dashboard metrics (occupancy, finances, pending actions)",
        tags: ["Dashboards"],
        responses: { 200: { description: "Owner dashboard metrics" } },
      },
    },
    "/dashboards/admin": {
      get: {
        summary: "Get computed Administrator Platform Overview",
        tags: ["Dashboards"],
        responses: { 200: { description: "Admin dashboard metrics" } },
      },
    },
  },
};

const router = Router();

router.get("/openapi.json", (_req: Request, res: Response) => {
  res.status(200).json(swaggerSpec);
});

router.get("/", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DirectKey API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`);
});

export const docsRoutes = router;
