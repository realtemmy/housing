# Housing Management System - Microservices Architecture

A comprehensive property management system built with microservices architecture, featuring Kong API Gateway, Node.js, Express, TypeScript, and Prisma with PostgreSQL.

## Architecture Overview

This project is structured as a microservices-based system with the following components:

- **API Gateway (Kong)**: Entry point for all client requests, handles routing and JWT authentication
- **Auth Service**: User authentication and authorization
- **Building Service**: Property, building, unit, and address management
- **Lease Service**: Lease management and tracking
- **Notification Service**: Email notifications and user notifications via Kafka
- **Payment Service**: Payment processing (planned)
- **Analytics Service**: Analytics and reporting (planned)

## Project Structure

```
housing-server/
├── gateway/
│   └── kong.yml                    # Kong API Gateway configuration
├── services/
│   ├── auth-service/               # User authentication & authorization
│   │   ├── src/
│   │   │   ├── controllers/        # Auth & user controllers
│   │   │   ├── routes/             # API routes
│   │   │   ├── validators/         # Zod validation schemas
│   │   │   ├── utils/              # Utility functions
│   │   │   ├── prisma/             # Prisma schema
│   │   │   └── server.ts           # Service entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── building-service/           # Property & building management
│   │   ├── src/
│   │   │   ├── controllers/        # Property, building, unit controllers
│   │   │   ├── routes/             # API routes
│   │   │   ├── validators/         # Zod validation schemas
│   │   │   ├── prisma/             # Prisma schema
│   │   │   └── server.ts           # Service entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── lease-service/              # Lease management
│   │   ├── src/
│   │   │   ├── controllers/        # Lease controllers
│   │   │   ├── routes/             # API routes
│   │   │   ├── validators/         # Zod validation schemas
│   │   │   ├── prisma/             # Prisma schema
│   │   │   └── server.ts           # Service entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── notification-service/       # Email notifications & messaging
│   │   ├── src/
│   │   │   ├── email/              # Email templates and sending
│   │   │   │   └── templates/      # Email template components
│   │   │   ├── kafka/              # Kafka consumer/producer
│   │   │   ├── schema/             # Notification schemas
│   │   │   └── server.ts           # Service entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── payment-service/            # Payment processing (planned)
│   └── analytics-service/          # Analytics (planned)
├── shared/                         # Shared utilities across services
├── docker-compose.yml              # Docker services orchestration
└── README.md
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma (PostgreSQL), Mongoose (MongoDB)
- **API Gateway**: Kong 3.4
- **Authentication**: JWT
- **Validation**: Zod
- **Message Queue**: Apache Kafka
- **Email**: Nodemailer
- **Containerization**: Docker

## Features

### Auth Service (Port 4001)
- JWT-based authentication with access and refresh tokens
- Google OAuth 2.0 integration
- Role-based access control (ADMIN, USER)
- User management

### Building Service (Port 4002)
- Property management (CRUD)
- Building management with address support
- Unit management with status tracking
- Pagination and search functionality
- Address management with geocoding support

### Lease Service (Port 4003)
- Lease management (CRUD operations)
- Tenant management
- Lease payment tracking
- Lease renewal handling

### Notification Service (Port 4004)
- Email notifications via Nodemailer
- Kafka-based event-driven notifications
- Email templates for:
  - Welcome emails
  - Email verification
  - Password reset
  - Two-factor authentication
  - Account locked notifications
  - Email change notifications
- MongoDB for notification history

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (handled by Docker)

### Environment Variables

Each service requires its own environment configuration:

#### Auth Service
Create `.env` in `services/auth-service/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
GOOGLE_CLIENT_ID="your-google-client-id"
PORT=4001
```

#### Building Service
Create `.env` in `services/building-service/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/building_db"
PORT=4002
KAFKA_BROKER="localhost:9092"
```

#### Lease Service
Create `.env` in `services/lease-service/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lease_db"
PORT=4003
KAFKA_BROKER="localhost:9092"
```

#### Notification Service
Create `.env` in `services/notification-service/`:
```env
DATABASE_URL="mongodb://localhost:27017/notification"
PORT=4004
KAFKA_BROKER="localhost:9092"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

**Important**: Update JWT_SECRET in `docker-compose.yml` to match your auth service secret.

### Installation & Setup

#### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd housing-server
```

2. **Configure environment variables**
   - Update `docker-compose.yml` with your JWT secret
   - Ensure Kong configuration in `gateway/kong.yml` matches your JWT secret

3. **Start all services**
```bash
docker-compose up --build
```

4. **Services will be available at:**
   - API Gateway: `http://localhost:8000`
   - Kong Admin API: `http://localhost:8001`
   - Auth Service: Internal only (http://auth-service:4001)
   - Building Service: Internal only (http://building-service:4002)

#### Local Development (Without Docker)

1. **Install dependencies for each service**
```bash
# Auth service
cd services/auth-service
npm install

# Building service
cd ../building-service
npm install

# Lease service
cd ../lease-service
npm install

# Notification service
cd ../notification-service
npm install
```

2. **Setup databases**
```bash
# In each service directory
npx prisma generate
npx prisma migrate dev
```

3. **Run services**
```bash
# Terminal 1 - Auth Service
cd services/auth-service
npm run dev

# Terminal 2 - Building Service
cd services/building-service
npm run dev

# Terminal 3 - Lease Service
cd services/lease-service
npm run dev

# Terminal 4 - Notification Service
cd services/notification-service
npm run dev
```

## API Documentation

**Base URL**: `http://localhost:8000` (Kong Gateway)

All API requests go through the Kong API Gateway. Kong handles routing to the appropriate microservice and JWT authentication for protected routes.

### Authentication Flow

1. **Public routes**: No authentication required
2. **Protected routes**: Require JWT token in Authorization header
   ```
   Authorization: Bearer <access-token>
   ```

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

## Event-Driven Architecture (Kafka)

The system uses Apache Kafka for asynchronous communication between microservices.

### Kafka Setup

Kafka is configured in `docker-compose.yml` with:
- **Zookeeper**: Manages Kafka cluster coordination
- **Broker**: Kafka message broker (port 9092)

### Event Flow

1. **Services publish events** to Kafka topics when actions occur
2. **Notification Service** consumes events and sends appropriate notifications
3. **Other services** can subscribe to relevant events for their operations

### Notification Service Integration

The Notification Service listens to Kafka topics and automatically sends emails for:
- User registration events
- Email verification requests
- Password reset requests
- Account security events
- Lease-related notifications

### Kafka Topics

Topics are auto-created when first used. Common topics include:
- `user-events` - User-related events (signup, login, etc.)
- `lease-events` - Lease creation, updates, renewals
- `notification-requests` - Direct notification requests

---

## Kong API Gateway Configuration

The `gateway/kong.yml` file configures:

1. **Service Routes**: Maps external paths to internal microservices
2. **JWT Authentication**: Protected routes require valid JWT tokens
3. **Consumers**: JWT secrets for token verification

### Route Mapping

- `/api/auth/*` → Auth Service (4001)
- `/api/users/*` → Auth Service (4001) - Protected
- `/api/properties/*` → Building Service (4002)
  - GET: Public
  - POST/PATCH/DELETE: Protected
- `/api/buildings/*` → Building Service (4002)
- `/api/units/*` → Building Service (4002)
- `/api/addresses/*` → Building Service (4002)
- `/api/leases/*` → Lease Service (4003) - Protected
- Notification Service (4004) - Internal only, receives events via Kafka

## Development

### Adding a New Microservice

1. Create service directory in `services/`
2. Setup Express app with TypeScript
3. Create Dockerfile for the service
4. Add service to `docker-compose.yml`
5. Configure routes in `gateway/kong.yml`
6. Setup Prisma schema (if needed)

### Database Migrations

Each service manages its own database:

```bash
cd services/<service-name>
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

### Testing

```bash
# Run tests for a specific service
cd services/<service-name>
npm test
```

## Deployment

### Production Considerations

1. **Environment Variables**: Use secure secrets management
2. **Database**: Use managed PostgreSQL instances per service
3. **Kong Gateway**: Configure SSL/TLS certificates
4. **Monitoring**: Implement logging and monitoring solutions
5. **Service Discovery**: Consider Kubernetes or Docker Swarm for orchestration

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## Roadmap

### Completed
- [x] Microservices architecture setup
- [x] Kong API Gateway integration
- [x] Auth service with JWT and Google OAuth
- [x] Building service with properties, buildings, and units
- [x] Pagination and search support
- [x] Docker containerization
- [x] Address management with nested building creation
- [x] Lease service implementation
- [x] Notification service with email templates
- [x] Kafka integration for event-driven architecture
- [x] MongoDB integration for notification service
- [x] Email notification system with Nodemailer

### In Progress
- [ ] Payment service integration
- [ ] Enhanced Kafka event handling across services

### Planned
- [ ] Analytics service
- [ ] WebSocket support for real-time updates
- [ ] File upload for property photos
- [ ] Advanced search and filtering
- [ ] API rate limiting per user
- [ ] Unit tests for all services
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Monitoring and logging (ELK stack)
- [ ] API documentation (Swagger/OpenAPI)
- [x] Message queue integration (Kafka)
- [ ] Caching layer (Redis)
- [ ] Service mesh (Istio)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT

## Author

Oguntimehin Temiloluwa

## Support

For issues and questions, please create an issue in the repository.
