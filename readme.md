# Scalable Housing Project (Server)

A comprehensive property management system API built with Node.js, Express, TypeScript, and Prisma with PostgreSQL.

## Features

- JWT-based authentication with access and refresh tokens
- Google OAuth 2.0 integration
- Role-based access control (ADMIN, USER)
- Property, Building, Address, and Unit management
- Lease and payment tracking
- Maintenance request system
- Rate limiting and CORS support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Google OAuth 2.0
- **Validation**: Zod

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/housing_db"
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
PORT=3000
```

## Installation

```bash
npm install
```

## Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (if seed file exists)
npx prisma db seed
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Documentation

Base URL: `http://localhost:3000/api/v1`

### Rate Limiting

- **Limit**: 100 requests per IP
- **Window**: 3 minutes
- **Response**: 429 Too Many Requests

---

## Authentication Endpoints

### 1. Sign Up (Local)

Create a new user account with email and password.

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

**Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "provider": "local",
    "createdAt": "2025-11-10T00:00:00.000Z"
  }
}
```

---

### 2. Login (Local)

Authenticate with email and password.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes**:
- Sets `jwt` cookie with refresh token (httpOnly, 24h expiry)
- Access token expires in 10 minutes

---

### 3. Google OAuth

Authenticate using Google Sign-In.

- **URL**: `/auth/google`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "token": "google-id-token",
  "role": "USER"
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@gmail.com",
      "name": "John Doe",
      "photo": "https://...",
      "provider": "google"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Refresh Token

Get a new access token using refresh token.

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Auth Required**: Yes (Refresh token in cookie)

**Success Response** (200):
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Property Endpoints

### 1. Get All Properties

Retrieve all properties.

- **URL**: `/property`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Sunset Apartments",
      "description": "Modern apartments in downtown",
      "type": "APARTMENT",
      "ownerId": "uuid",
      "isActive": true,
      "verified": false,
      "createdAt": "2025-11-10T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Property by ID

Retrieve a specific property.

- **URL**: `/property/:id`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Sunset Apartments",
    "description": "Modern apartments in downtown",
    "type": "APARTMENT",
    "ownerId": "uuid",
    "isActive": true,
    "verified": false,
    "createdAt": "2025-11-10T00:00:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "status": "error",
  "message": "No Property with ID found"
}
```

---

### 3. Create Property

Create a new property.

- **URL**: `/property`
- **Method**: `POST`
- **Auth Required**: Yes (ADMIN only)

**Request Body**:
```json
{
  "title": "Sunset Apartments",
  "description": "Modern apartments in downtown",
  "type": "APARTMENT",
  "ownerId": "uuid"
}
```

**Validation**:
- `title`: Required string
- `description`: Optional, max 150 characters
- `type`: Enum - "APARTMENT", "HOUSE", or "HOSTEL"
- `ownerId`: Required UUID

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Sunset Apartments",
    "description": "Modern apartments in downtown",
    "type": "APARTMENT",
    "ownerId": "uuid",
    "isActive": true,
    "verified": false
  }
}
```

---

## Building Endpoints

### 1. Get All Buildings

Retrieve all buildings with optional property filter.

- **URL**: `/building`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `propertyId` (optional): Filter by property ID

**Example**: `/building?propertyId=uuid`

**Success Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Building A",
      "floors": 5,
      "property": {
        "id": "uuid",
        "title": "Sunset Apartments",
        "type": "APARTMENT"
      },
      "units": [
        {
          "id": "uuid",
          "unitNumber": "A101",
          "status": "AVAILABLE"
        }
      ]
    }
  ]
}
```

---

### 2. Get Building by ID

Retrieve a specific building.

- **URL**: `/building/:id`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "Building A",
    "floors": 5,
    "property": { },
    "units": [ ]
  }
}
```

---

### 3. Create Building

Create a new building.

- **URL**: `/building`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "propertyId": "uuid",
  "name": "Building A",
  "floors": 5
}
```

**Validation**:
- `propertyId`: Required UUID
- `name`: Optional string
- `floors`: Optional positive integer

**Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "Building A",
    "floors": 5
  }
}
```

---

### 4. Update Building

Update building details.

- **URL**: `/building/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "name": "Building B",
  "floors": 10
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Building B",
    "floors": 10
  }
}
```

---

### 5. Delete Building

Delete a building (only if no units exist).

- **URL**: `/building/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response** (204): No content

**Error Response** (400):
```json
{
  "status": "error",
  "message": "Cannot delete building with existing units. Delete units first."
}
```

---

## Address Endpoints

### 1. Get All Addresses

Retrieve all addresses.

- **URL**: `/address`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "street": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "postalCode": "100001",
      "country": "Nigeria",
      "latitude": 6.5244,
      "longitude": 3.3792,
      "propertyId": "uuid",
      "property": {
        "id": "uuid",
        "title": "Sunset Apartments",
        "type": "APARTMENT"
      }
    }
  ]
}
```

---

### 2. Get Address by ID

Retrieve a specific address.

- **URL**: `/address/:id`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001",
    "country": "Nigeria",
    "propertyId": "uuid"
  }
}
```

---

### 3. Get Address by Property

Retrieve address for a specific property.

- **URL**: `/address/property/:propertyId`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "street": "123 Main St",
    "city": "Lagos",
    "propertyId": "uuid",
    "property": { }
  }
}
```

---

### 4. Create Address

Create a new address for a property.

- **URL**: `/address`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "street": "123 Main St",
  "city": "Lagos",
  "state": "Lagos",
  "postalCode": "100001",
  "country": "Nigeria",
  "propertyId": "uuid",
  "latitude": 6.5244,
  "longitude": 3.3792
}
```

**Validation**:
- `street`: Required string
- `city`: Required string
- `state`: Required string
- `postalCode`: Required string
- `country`: Required string
- `propertyId`: Required UUID
- `latitude`: Optional, -90 to 90
- `longitude`: Optional, -180 to 180

**Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "street": "123 Main St",
    "city": "Lagos",
    "propertyId": "uuid"
  }
}
```

**Error Response** (400):
```json
{
  "status": "error",
  "message": "Address already exists for this property"
}
```

---

### 5. Update Address

Update address details.

- **URL**: `/address/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "street": "456 New Street",
  "city": "Abuja"
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "street": "456 New Street",
    "city": "Abuja"
  }
}
```

---

### 6. Delete Address

Delete an address.

- **URL**: `/address/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response** (204): No content

---

## Unit Endpoints

### 1. Get All Units

Retrieve all units with optional filters.

- **URL**: `/unit`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `propertyId` (optional): Filter by property
  - `buildingId` (optional): Filter by building
  - `status` (optional): Filter by status (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)

**Example**: `/unit?propertyId=uuid&status=AVAILABLE`

**Success Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "unitNumber": "A101",
      "floor": 1,
      "bedrooms": 2,
      "bathrooms": 1.5,
      "sqft": 850,
      "status": "AVAILABLE",
      "rentAmount": 250000,
      "depositAmount": 500000,
      "propertyId": "uuid",
      "buildingId": "uuid",
      "property": {
        "id": "uuid",
        "title": "Sunset Apartments",
        "type": "APARTMENT"
      },
      "building": {
        "id": "uuid",
        "name": "Building A"
      },
      "photos": [],
      "leases": []
    }
  ]
}
```

---

### 2. Get Available Units

Retrieve only available units.

- **URL**: `/unit/available`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `propertyId` (optional): Filter by property

**Success Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "unitNumber": "A101",
      "status": "AVAILABLE",
      "rentAmount": 250000,
      "property": {
        "id": "uuid",
        "title": "Sunset Apartments",
        "address": { }
      }
    }
  ]
}
```

---

### 3. Get Unit by ID

Retrieve a specific unit with full details.

- **URL**: `/unit/:id`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "unitNumber": "A101",
    "floor": 1,
    "bedrooms": 2,
    "bathrooms": 1.5,
    "sqft": 850,
    "status": "OCCUPIED",
    "rentAmount": 250000,
    "property": { },
    "building": { },
    "photos": [],
    "leases": [
      {
        "id": "uuid",
        "startDate": "2025-01-01",
        "endDate": "2025-12-31",
        "status": "ACTIVE",
        "tenant": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "maintenance": []
  }
}
```

---

### 4. Create Unit

Create a new unit.

- **URL**: `/unit`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "unitNumber": "A101",
  "floor": 1,
  "bedrooms": 2,
  "bathrooms": 1.5,
  "sqft": 850,
  "status": "AVAILABLE",
  "rentAmount": 250000,
  "depositAmount": 500000,
  "propertyId": "uuid",
  "buildingId": "uuid"
}
```

**Validation**:
- `unitNumber`: Required string
- `floor`: Optional integer
- `bedrooms`: Optional non-negative integer
- `bathrooms`: Optional non-negative number
- `sqft`: Optional positive integer
- `status`: Optional enum (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)
- `rentAmount`: Required positive number
- `depositAmount`: Optional non-negative number
- `propertyId`: Required UUID
- `buildingId`: Optional UUID

**Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "unitNumber": "A101",
    "rentAmount": 250000,
    "status": "AVAILABLE"
  }
}
```

**Error Responses**:
- (400) Unit number already exists for this property
- (400) Building does not belong to this property
- (404) Property not found
- (404) Building not found

---

### 5. Update Unit

Update unit details.

- **URL**: `/unit/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "status": "OCCUPIED",
  "rentAmount": 275000
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "status": "OCCUPIED",
    "rentAmount": 275000
  }
}
```

---

### 6. Delete Unit

Delete a unit (only if no active/pending leases).

- **URL**: `/unit/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response** (204): No content

**Error Response** (400):
```json
{
  "status": "error",
  "message": "Cannot delete unit with active or pending leases. Terminate leases first."
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Forbidden: you do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests from this IP, please try again after 3 minutes"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Authentication Flow

### Protected Routes

Protected routes require a valid JWT access token in the Authorization header:

```
Authorization: Bearer <access-token>
```

### Token Refresh Flow

1. Access token expires after 10 minutes
2. Use the refresh token (stored in httpOnly cookie) to get a new access token
3. Call `/auth/refresh` endpoint
4. Refresh token expires after 24 hours

---

## Database Schema

### Main Models

- **User**: Users with role-based access (ADMIN, USER)
- **Property**: Properties owned by admins
- **Building**: Buildings within properties
- **Address**: Address information for properties
- **Unit**: Individual rental units
- **Lease**: Rental agreements
- **Payment**: Payment records
- **Invoice**: Payment invoices
- **MaintenanceRequest**: Maintenance requests from tenants
- **Tenant**: Extended tenant information
- **Notification**: User notifications

### Enums

- **UserRole**: ADMIN, USER
- **PropertyType**: APARTMENT, HOUSE, HOSTEL
- **UnitStatus**: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
- **LeaseStatus**: ACTIVE, PENDING, TERMINATED, EXPIRED
- **PaymentStatus**: PENDING, COMPLETED, FAILED, REFUNDED
- **MaintenanceStatus**: OPEN, IN_PROGRESS, RESOLVED, CANCELLED

---

## Development

### Project Structure

```
housing-server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   ├── validators/      # Zod validation schemas
│   ├── middlewares/     # Custom middleware
│   ├── utils/           # Utility functions
│   ├── client/          # Prisma client
│   ├── prisma/          # Prisma schema
│   └── app.ts           # Express app setup
├── .env                 # Environment variables
└── package.json
```

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create validator in `src/validators/`
3. Create routes in `src/routes/`
4. Register routes in `src/app.ts`

---

## To Do

- [ ] Add authentication routes to app.ts
- [ ] Implement lease management endpoints
- [ ] Implement payment processing endpoints
- [ ] Implement maintenance request endpoints
- [ ] Add file upload for photos
- [ ] Add email notifications
- [ ] Implement search and filtering
- [ ] Add pagination support
- [ ] Add unit tests
- [ ] Add API versioning
- [ ] Deploy to production

---

## License

MIT

---

## Support

For issues and questions, please create an issue in the repository.
