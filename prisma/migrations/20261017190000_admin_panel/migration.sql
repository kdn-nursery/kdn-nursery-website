-- Admin panel, catalogue publishing and order records.
-- This migration is not applied by the application automatically.

CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "FulfilmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'READY_FOR_PICKUP', 'DELIVERED', 'PICKED_UP', 'CANCELLED');

ALTER TABLE "Category"
  ADD COLUMN "imageStorageKey" TEXT,
  ADD COLUMN "imageAltEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "imageAltTa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "archivedAt" TIMESTAMP(3),
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Product"
  ADD COLUMN "botanicalName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "varietyName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "sunlightEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "sunlightTa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "wateringEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "wateringTa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "handlingEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "handlingTa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "potSize" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "seoTitleEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "seoTitleTa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "seoDescriptionTa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "compareAtPaise" INTEGER,
  ADD COLUMN "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;

UPDATE "Product" SET "status" = 'PUBLISHED';

DROP INDEX "Product_categoryId_slug_key";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_status_displayOrder_idx" ON "Product"("status", "displayOrder");

ALTER TABLE "Product" ADD CONSTRAINT "Product_compareAtPaise_check" CHECK ("compareAtPaise" IS NULL OR "compareAtPaise" > "pricePaise");
ALTER TABLE "Product" ADD CONSTRAINT "Product_pricePaise_check" CHECK ("pricePaise" >= 0);
ALTER TABLE "Product" ADD CONSTRAINT "Product_stockQuantity_check" CHECK ("stockQuantity" >= 0);

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "publicId" TEXT NOT NULL,
  "secureUrl" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "bytes" INTEGER NOT NULL,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "altEn" TEXT NOT NULL DEFAULT '',
  "altTa" TEXT NOT NULL DEFAULT '',
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");

ALTER TABLE "ProductImage"
  ADD COLUMN "mediaId" TEXT,
  ADD COLUMN "isCover" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "ProductImage_mediaId_idx" ON "ProductImage"("mediaId");
ALTER TABLE "ProductImage"
  ADD CONSTRAINT "ProductImage_mediaId_fkey"
  FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CareGuide"
  ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
  "passwordChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

CREATE TABLE "LoginAttempt" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LoginAttempt_key_createdAt_idx" ON "LoginAttempt"("key", "createdAt");

CREATE TABLE "AuditEvent" (
  "id" TEXT NOT NULL,
  "adminId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");
ALTER TABLE "AuditEvent"
  ADD CONSTRAINT "AuditEvent_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ContentDocument" (
  "key" TEXT NOT NULL,
  "body" JSONB NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "updatedById" TEXT,
  CONSTRAINT "ContentDocument_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "Banner" (
  "id" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "altEn" TEXT NOT NULL,
  "altTa" TEXT NOT NULL,
  "href" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "version" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Faq" (
  "id" TEXT NOT NULL,
  "questionEn" TEXT NOT NULL,
  "questionTa" TEXT NOT NULL,
  "answerEn" TEXT NOT NULL,
  "answerTa" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "version" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessProfile" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "businessName" TEXT NOT NULL DEFAULT 'Kaviyadevan Nursery Garden',
  "whatsappNumber" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "instagramUrl" TEXT NOT NULL DEFAULT '',
  "addressEn" TEXT NOT NULL DEFAULT '',
  "addressTa" TEXT NOT NULL DEFAULT '',
  "pickupEn" TEXT NOT NULL DEFAULT '',
  "pickupTa" TEXT NOT NULL DEFAULT '',
  "openingHoursEn" TEXT NOT NULL DEFAULT '',
  "openingHoursTa" TEXT NOT NULL DEFAULT '',
  "dispatchDays" TEXT NOT NULL DEFAULT '',
  "deliveryEstimateEn" TEXT NOT NULL DEFAULT '',
  "deliveryEstimateTa" TEXT NOT NULL DEFAULT '',
  "pickupAvailable" BOOLEAN NOT NULL DEFAULT false,
  "version" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliveryPincode" (
  "pincode" TEXT NOT NULL,
  "label" TEXT NOT NULL DEFAULT '',
  CONSTRAINT "DeliveryPincode_pkey" PRIMARY KEY ("pincode")
);

CREATE TABLE "DeliveryChargeTier" (
  "id" TEXT NOT NULL,
  "minOrderPaise" INTEGER NOT NULL,
  "maxOrderPaise" INTEGER,
  "chargePaise" INTEGER NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "DeliveryChargeTier_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DeliveryChargeTier_minOrderPaise_key" ON "DeliveryChargeTier"("minOrderPaise");
ALTER TABLE "DeliveryChargeTier" ADD CONSTRAINT "DeliveryChargeTier_charge_check" CHECK ("chargePaise" >= 0 AND "minOrderPaise" >= 0);

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "orderNumber" TEXT NOT NULL,
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  "fulfilmentStatus" "FulfilmentStatus" NOT NULL DEFAULT 'PENDING',
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "subtotalPaise" INTEGER NOT NULL,
  "deliveryPaise" INTEGER NOT NULL,
  "totalPaise" INTEGER NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "deliveryLine" TEXT NOT NULL DEFAULT '',
  "pincode" TEXT NOT NULL DEFAULT '',
  "courierName" TEXT NOT NULL DEFAULT '',
  "trackingNumber" TEXT NOT NULL DEFAULT '',
  "trackingUrl" TEXT NOT NULL DEFAULT '',
  "version" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT,
  "nameEn" TEXT NOT NULL,
  "nameTa" TEXT NOT NULL,
  "unitPricePaise" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "lineTotalPaise" INTEGER NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "OrderEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "OrderEvent"
  ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "OrderNote" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "adminId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderNote_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "OrderNote"
  ADD CONSTRAINT "OrderNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
