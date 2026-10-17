-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'LANDLORD', 'AGENT', 'TENANT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'SELF_CONTAINED', 'MINI_FLAT', 'DUPLEX', 'TERRACE', 'DETACHED_HOUSE', 'SHARED_APARTMENT', 'HOSTEL', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('PHOTO', 'TITLE_DOCUMENT', 'FLOOR_PLAN', 'METER', 'VIDEO_TOUR');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'RESERVED', 'LEASED', 'DELISTED');

-- CreateEnum
CREATE TYPE "BillingFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'BI_ANNUAL', 'ANNUAL');

-- CreateEnum
CREATE TYPE "ViewingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VerificationCaseCategory" AS ENUM ('OWNERSHIP_DOCS', 'PHYSICAL_INSPECTION', 'IDENTITY_CHECK', 'COMBINED');

-- CreateEnum
CREATE TYPE "VerificationCaseStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DECLINED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE_HOLD', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TenancyStatus" AS ENUM ('PENDING', 'ACTIVE', 'RENEWAL_PENDING', 'COMPLETED', 'TERMINATED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'PENDING_SIGNATURES', 'TENANT_SIGNED', 'LANDLORD_SIGNED', 'FULLY_EXECUTED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "ObligationType" AS ENUM ('RENT', 'CAUTION_DEPOSIT', 'SERVICE_CHARGE', 'LATE_FEE', 'OTHER');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CARD', 'DIRECT_DEPOSIT', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentVerificationStatus" AS ENUM ('REPORTED', 'VERIFIED', 'REJECTED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "MaintenanceCategory" AS ENUM ('PLUMBING', 'ELECTRICAL', 'STRUCTURAL', 'APPLIANCE', 'CARPENTRY', 'PAINTING', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'AWAITING_TENANT', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IssueCategory" AS ENUM ('NOISE_DISTURBANCE', 'NEIGHBOR_DISPUTE', 'HARASSMENT', 'BILLING_DISAGREEMENT', 'LEASE_VIOLATION', 'PROPERTY_CONDITION', 'SECURITY_CONCERN', 'OTHER');

-- CreateEnum
CREATE TYPE "IssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'IN_DISCUSSION', 'ESCALATED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "HandoverType" AS ENUM ('MOVE_IN', 'MOVE_OUT');

-- CreateEnum
CREATE TYPE "HandoverStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConditionRating" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('PASS', 'FAIL', 'NEEDS_REPAIR', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RENT_DUE', 'PAYMENT_UPDATE', 'APPLICATION_UPDATE', 'MAINTENANCE_UPDATE', 'ISSUE_UPDATE', 'VIEWING_UPDATE', 'AGREEMENT_READY', 'HANDOVER_UPDATE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TENANT',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentAssignment" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "canManageListings" BOOLEAN NOT NULL DEFAULT true,
    "canManageApplications" BOOLEAN NOT NULL DEFAULT true,
    "canManageMaintenance" BOOLEAN NOT NULL DEFAULT true,
    "canRecordPayments" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
    "addressStreet" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Lagos',
    "state" TEXT NOT NULL DEFAULT 'Lagos',
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "floors" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "buildingId" TEXT,
    "unitNumber" TEXT NOT NULL,
    "floor" INTEGER,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "sqft" INTEGER,
    "rentAmount" DECIMAL(12,2) NOT NULL,
    "cautionDeposit" DECIMAL(12,2) NOT NULL,
    "serviceCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "size" INTEGER,
    "rentAmount" DECIMAL(12,2) NOT NULL,
    "cautionDeposit" DECIMAL(12,2) NOT NULL,
    "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rentAmount" DECIMAL(12,2) NOT NULL,
    "cautionDeposit" DECIMAL(12,2),
    "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "unitId" TEXT,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "category" "MediaCategory" NOT NULL DEFAULT 'PHOTO',
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "unitId" TEXT,
    "roomId" TEXT,
    "bedId" TEXT,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "displayPrice" DECIMAL(12,2) NOT NULL,
    "cautionDeposit" DECIMAL(12,2) NOT NULL,
    "serviceCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "billingFrequency" "BillingFrequency" NOT NULL DEFAULT 'ANNUAL',
    "amenities" TEXT[],
    "photos" TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewingRequest" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3) NOT NULL,
    "alternativeDate" TIMESTAMP(3),
    "contactPhone" TEXT NOT NULL,
    "notes" TEXT,
    "status" "ViewingStatus" NOT NULL DEFAULT 'PENDING',
    "hostNotes" TEXT,
    "confirmedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCase" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "category" "VerificationCaseCategory" NOT NULL DEFAULT 'COMBINED',
    "evidenceUrls" TEXT[],
    "meterNumber" TEXT,
    "gpsLatitude" DOUBLE PRECISION,
    "gpsLongitude" DOUBLE PRECISION,
    "ownershipDocUrl" TEXT,
    "decisionNotes" TEXT,
    "rejectionReason" TEXT,
    "status" "VerificationCaseStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuspiciousReport" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuspiciousReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "monthlyIncome" DECIMAL(12,2) NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "employerName" TEXT NOT NULL,
    "idDocumentUrl" TEXT,
    "guarantorName" TEXT,
    "guarantorPhone" TEXT,
    "proposedMoveInDate" TIMESTAMP(3) NOT NULL,
    "coverLetter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "decisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "agreedRent" DECIMAL(12,2) NOT NULL,
    "agreedCautionDeposit" DECIMAL(12,2) NOT NULL,
    "agreedServiceCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "billingFrequency" "BillingFrequency" NOT NULL DEFAULT 'ANNUAL',
    "leaseDurationMonths" INTEGER NOT NULL DEFAULT 12,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "unitId" TEXT,
    "roomId" TEXT,
    "bedId" TEXT,
    "applicationId" TEXT,
    "tenantId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE_HOLD',
    "holdFeeAmount" DECIMAL(12,2),
    "holdFeePaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenancy" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "unitId" TEXT,
    "roomId" TEXT,
    "bedId" TEXT,
    "tenantId" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,
    "applicationId" TEXT,
    "reservationId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "propertyReadyDate" TIMESTAMP(3),
    "actualHandoverDate" TIMESTAMP(3),
    "commencementDate" TIMESTAMP(3),
    "actualMoveOutDate" TIMESTAMP(3),
    "rentAmount" DECIMAL(12,2) NOT NULL,
    "cautionDeposit" DECIMAL(12,2) NOT NULL,
    "serviceCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "billingFrequency" "BillingFrequency" NOT NULL DEFAULT 'ANNUAL',
    "rentDueDay" INTEGER,
    "gracePeriodDays" INTEGER NOT NULL DEFAULT 5,
    "lateFeeAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "TenancyStatus" NOT NULL DEFAULT 'PENDING',
    "terminationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenancyOccupant" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "relationship" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenancyOccupant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenancyAgreement" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "documentUrl" TEXT,
    "documentHash" TEXT,
    "termsContent" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "tenantSignedAt" TIMESTAMP(3),
    "tenantSignIp" TEXT,
    "landlordSignedAt" TIMESTAMP(3),
    "landlordSignIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenancyAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentObligation" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "obligationType" "ObligationType" NOT NULL DEFAULT 'RENT',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "amountDue" DECIMAL(12,2) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceRemaining" DECIMAL(12,2) NOT NULL,
    "status" "ObligationStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentObligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "obligationId" TEXT,
    "recordedById" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "bankName" TEXT,
    "accountNumber" TEXT,
    "providerReference" TEXT,
    "evidenceUrl" TEXT,
    "notes" TEXT,
    "verificationStatus" "PaymentVerificationStatus" NOT NULL DEFAULT 'REPORTED',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentInstruction" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "instructions" TEXT,
    "referenceTemplate" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentCorrection" (
    "id" TEXT NOT NULL,
    "paymentRecordId" TEXT NOT NULL,
    "previousAmount" DECIMAL(12,2) NOT NULL,
    "correctedAmount" DECIMAL(12,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "authorizedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "tenancyId" TEXT,
    "requesterId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "MaintenanceCategory" NOT NULL DEFAULT 'OTHER',
    "urgency" "MaintenanceUrgency" NOT NULL DEFAULT 'MEDIUM',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SUBMITTED',
    "accessPreference" TEXT,
    "estimatedCost" DECIMAL(10,2),
    "actualCost" DECIMAL(10,2),
    "scheduledFor" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceComment" (
    "id" TEXT NOT NULL,
    "maintenanceRequestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceAttachment" (
    "id" TEXT NOT NULL,
    "maintenanceRequestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceStatusLog" (
    "id" TEXT NOT NULL,
    "maintenanceRequestId" TEXT NOT NULL,
    "fromStatus" "MaintenanceStatus" NOT NULL,
    "toStatus" "MaintenanceStatus" NOT NULL,
    "changedById" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantIssue" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "tenancyId" TEXT,
    "reporterId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "category" "IssueCategory" NOT NULL DEFAULT 'OTHER',
    "priority" "IssuePriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceUrls" TEXT[],
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionNotes" TEXT,
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantIssueComment" (
    "id" TEXT NOT NULL,
    "tenantIssueId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantIssueComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantIssueAuditLog" (
    "id" TEXT NOT NULL,
    "tenantIssueId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedById" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantIssueAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandoverInspection" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "type" "HandoverType" NOT NULL DEFAULT 'MOVE_IN',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "inspectorId" TEXT,
    "tenantConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "tenantConfirmedAt" TIMESTAMP(3),
    "landlordConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "landlordConfirmedAt" TIMESTAMP(3),
    "keysHandedCount" INTEGER NOT NULL DEFAULT 0,
    "meterReadings" JSONB,
    "overallCondition" "ConditionRating" NOT NULL DEFAULT 'GOOD',
    "status" "HandoverStatus" NOT NULL DEFAULT 'SCHEDULED',
    "releaseOtp" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HandoverInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionItem" (
    "id" TEXT NOT NULL,
    "handoverInspectionId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "condition" "ItemCondition" NOT NULL DEFAULT 'PASS',
    "notes" TEXT,
    "photoUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InspectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "deliveryChannel" "DeliveryChannel" NOT NULL DEFAULT 'IN_APP',
    "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'DELIVERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "detailsJson" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "AgentAssignment_propertyId_idx" ON "AgentAssignment"("propertyId");

-- CreateIndex
CREATE INDEX "AgentAssignment_agentId_idx" ON "AgentAssignment"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentAssignment_propertyId_agentId_key" ON "AgentAssignment"("propertyId", "agentId");

-- CreateIndex
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");

-- CreateIndex
CREATE INDEX "Property_area_idx" ON "Property"("area");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_verificationStatus_idx" ON "Property"("verificationStatus");

-- CreateIndex
CREATE INDEX "Property_isActive_idx" ON "Property"("isActive");

-- CreateIndex
CREATE INDEX "Building_propertyId_idx" ON "Building"("propertyId");

-- CreateIndex
CREATE INDEX "Unit_propertyId_idx" ON "Unit"("propertyId");

-- CreateIndex
CREATE INDEX "Unit_buildingId_idx" ON "Unit"("buildingId");

-- CreateIndex
CREATE INDEX "Unit_status_idx" ON "Unit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_propertyId_unitNumber_key" ON "Unit"("propertyId", "unitNumber");

-- CreateIndex
CREATE INDEX "Room_unitId_idx" ON "Room"("unitId");

-- CreateIndex
CREATE INDEX "Room_propertyId_idx" ON "Room"("propertyId");

-- CreateIndex
CREATE INDEX "Room_status_idx" ON "Room"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Room_unitId_name_key" ON "Room"("unitId", "name");

-- CreateIndex
CREATE INDEX "Bed_roomId_idx" ON "Bed"("roomId");

-- CreateIndex
CREATE INDEX "Bed_propertyId_idx" ON "Bed"("propertyId");

-- CreateIndex
CREATE INDEX "Bed_status_idx" ON "Bed"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Bed_roomId_label_key" ON "Bed"("roomId", "label");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_idx" ON "PropertyMedia"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyMedia_unitId_idx" ON "PropertyMedia"("unitId");

-- CreateIndex
CREATE INDEX "Listing_propertyId_idx" ON "Listing"("propertyId");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_isFeatured_idx" ON "Listing"("isFeatured");

-- CreateIndex
CREATE INDEX "Listing_displayPrice_idx" ON "Listing"("displayPrice");

-- CreateIndex
CREATE INDEX "ViewingRequest_listingId_idx" ON "ViewingRequest"("listingId");

-- CreateIndex
CREATE INDEX "ViewingRequest_tenantId_idx" ON "ViewingRequest"("tenantId");

-- CreateIndex
CREATE INDEX "ViewingRequest_status_idx" ON "ViewingRequest"("status");

-- CreateIndex
CREATE INDEX "Enquiry_listingId_idx" ON "Enquiry"("listingId");

-- CreateIndex
CREATE INDEX "Enquiry_tenantId_idx" ON "Enquiry"("tenantId");

-- CreateIndex
CREATE INDEX "VerificationCase_propertyId_idx" ON "VerificationCase"("propertyId");

-- CreateIndex
CREATE INDEX "VerificationCase_status_idx" ON "VerificationCase"("status");

-- CreateIndex
CREATE INDEX "SuspiciousReport_listingId_idx" ON "SuspiciousReport"("listingId");

-- CreateIndex
CREATE INDEX "SuspiciousReport_status_idx" ON "SuspiciousReport"("status");

-- CreateIndex
CREATE INDEX "Application_listingId_idx" ON "Application"("listingId");

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Offer_applicationId_idx" ON "Offer"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_applicationId_key" ON "Reservation"("applicationId");

-- CreateIndex
CREATE INDEX "Reservation_unitId_status_idx" ON "Reservation"("unitId", "status");

-- CreateIndex
CREATE INDEX "Reservation_roomId_status_idx" ON "Reservation"("roomId", "status");

-- CreateIndex
CREATE INDEX "Reservation_bedId_status_idx" ON "Reservation"("bedId", "status");

-- CreateIndex
CREATE INDEX "Reservation_expiresAt_idx" ON "Reservation"("expiresAt");

-- CreateIndex
CREATE INDEX "Reservation_tenantId_idx" ON "Reservation"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenancy_applicationId_key" ON "Tenancy"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenancy_reservationId_key" ON "Tenancy"("reservationId");

-- CreateIndex
CREATE INDEX "Tenancy_propertyId_idx" ON "Tenancy"("propertyId");

-- CreateIndex
CREATE INDEX "Tenancy_tenantId_idx" ON "Tenancy"("tenantId");

-- CreateIndex
CREATE INDEX "Tenancy_landlordId_idx" ON "Tenancy"("landlordId");

-- CreateIndex
CREATE INDEX "Tenancy_status_idx" ON "Tenancy"("status");

-- CreateIndex
CREATE INDEX "TenancyOccupant_tenancyId_idx" ON "TenancyOccupant"("tenancyId");

-- CreateIndex
CREATE INDEX "TenancyAgreement_tenancyId_idx" ON "TenancyAgreement"("tenancyId");

-- CreateIndex
CREATE INDEX "TenancyAgreement_status_idx" ON "TenancyAgreement"("status");

-- CreateIndex
CREATE INDEX "RentObligation_tenancyId_idx" ON "RentObligation"("tenancyId");

-- CreateIndex
CREATE INDEX "RentObligation_dueDate_idx" ON "RentObligation"("dueDate");

-- CreateIndex
CREATE INDEX "RentObligation_status_idx" ON "RentObligation"("status");

-- CreateIndex
CREATE INDEX "PaymentRecord_tenancyId_idx" ON "PaymentRecord"("tenancyId");

-- CreateIndex
CREATE INDEX "PaymentRecord_obligationId_idx" ON "PaymentRecord"("obligationId");

-- CreateIndex
CREATE INDEX "PaymentRecord_providerReference_idx" ON "PaymentRecord"("providerReference");

-- CreateIndex
CREATE INDEX "PaymentRecord_verificationStatus_idx" ON "PaymentRecord"("verificationStatus");

-- CreateIndex
CREATE INDEX "PaymentInstruction_tenancyId_idx" ON "PaymentInstruction"("tenancyId");

-- CreateIndex
CREATE INDEX "PaymentCorrection_paymentRecordId_idx" ON "PaymentCorrection"("paymentRecordId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_propertyId_idx" ON "MaintenanceRequest"("propertyId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_tenancyId_idx" ON "MaintenanceRequest"("tenancyId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_requesterId_idx" ON "MaintenanceRequest"("requesterId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_assignedToId_idx" ON "MaintenanceRequest"("assignedToId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

-- CreateIndex
CREATE INDEX "MaintenanceComment_maintenanceRequestId_idx" ON "MaintenanceComment"("maintenanceRequestId");

-- CreateIndex
CREATE INDEX "MaintenanceAttachment_maintenanceRequestId_idx" ON "MaintenanceAttachment"("maintenanceRequestId");

-- CreateIndex
CREATE INDEX "MaintenanceStatusLog_maintenanceRequestId_idx" ON "MaintenanceStatusLog"("maintenanceRequestId");

-- CreateIndex
CREATE INDEX "TenantIssue_propertyId_idx" ON "TenantIssue"("propertyId");

-- CreateIndex
CREATE INDEX "TenantIssue_tenancyId_idx" ON "TenantIssue"("tenancyId");

-- CreateIndex
CREATE INDEX "TenantIssue_reporterId_idx" ON "TenantIssue"("reporterId");

-- CreateIndex
CREATE INDEX "TenantIssue_status_idx" ON "TenantIssue"("status");

-- CreateIndex
CREATE INDEX "TenantIssueComment_tenantIssueId_idx" ON "TenantIssueComment"("tenantIssueId");

-- CreateIndex
CREATE INDEX "TenantIssueAuditLog_tenantIssueId_idx" ON "TenantIssueAuditLog"("tenantIssueId");

-- CreateIndex
CREATE INDEX "HandoverInspection_tenancyId_idx" ON "HandoverInspection"("tenancyId");

-- CreateIndex
CREATE INDEX "HandoverInspection_status_idx" ON "HandoverInspection"("status");

-- CreateIndex
CREATE INDEX "InspectionItem_handoverInspectionId_idx" ON "InspectionItem"("handoverInspectionId");

-- CreateIndex
CREATE INDEX "Notification_recipientId_isRead_idx" ON "Notification"("recipientId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- AddForeignKey
ALTER TABLE "AgentAssignment" ADD CONSTRAINT "AgentAssignment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentAssignment" ADD CONSTRAINT "AgentAssignment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentAssignment" ADD CONSTRAINT "AgentAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewingRequest" ADD CONSTRAINT "ViewingRequest_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewingRequest" ADD CONSTRAINT "ViewingRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCase" ADD CONSTRAINT "VerificationCase_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuspiciousReport" ADD CONSTRAINT "SuspiciousReport_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenancyOccupant" ADD CONSTRAINT "TenancyOccupant_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenancyAgreement" ADD CONSTRAINT "TenancyAgreement_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentObligation" ADD CONSTRAINT "RentObligation_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "RentObligation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentInstruction" ADD CONSTRAINT "PaymentInstruction_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCorrection" ADD CONSTRAINT "PaymentCorrection_paymentRecordId_fkey" FOREIGN KEY ("paymentRecordId") REFERENCES "PaymentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComment" ADD CONSTRAINT "MaintenanceComment_maintenanceRequestId_fkey" FOREIGN KEY ("maintenanceRequestId") REFERENCES "MaintenanceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAttachment" ADD CONSTRAINT "MaintenanceAttachment_maintenanceRequestId_fkey" FOREIGN KEY ("maintenanceRequestId") REFERENCES "MaintenanceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceStatusLog" ADD CONSTRAINT "MaintenanceStatusLog_maintenanceRequestId_fkey" FOREIGN KEY ("maintenanceRequestId") REFERENCES "MaintenanceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIssue" ADD CONSTRAINT "TenantIssue_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIssue" ADD CONSTRAINT "TenantIssue_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIssue" ADD CONSTRAINT "TenantIssue_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIssue" ADD CONSTRAINT "TenantIssue_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIssueComment" ADD CONSTRAINT "TenantIssueComment_tenantIssueId_fkey" FOREIGN KEY ("tenantIssueId") REFERENCES "TenantIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIssueAuditLog" ADD CONSTRAINT "TenantIssueAuditLog_tenantIssueId_fkey" FOREIGN KEY ("tenantIssueId") REFERENCES "TenantIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandoverInspection" ADD CONSTRAINT "HandoverInspection_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionItem" ADD CONSTRAINT "InspectionItem_handoverInspectionId_fkey" FOREIGN KEY ("handoverInspectionId") REFERENCES "HandoverInspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

