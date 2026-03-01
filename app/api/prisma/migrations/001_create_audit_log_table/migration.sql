-- CreateAuditLog
-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "userEmail" VARCHAR(255),
    "method" VARCHAR(10) NOT NULL,
    "endpoint" VARCHAR(500) NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "requestBody" TEXT,
    "responseBody" TEXT,
    "ipAddress" VARCHAR(50),
    "userAgent" TEXT,
    "errorMessage" TEXT,
    "executionTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_user_id" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "idx_audit_created_at" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "idx_audit_endpoint" ON "AuditLog"("endpoint");
