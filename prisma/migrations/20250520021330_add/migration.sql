-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'LOGIN', 'LOGOUT', 'RESET_PASSWORD', 'ASSIGN', 'UNASSIGN', 'APPROVE', 'REJECT', 'GENERATE_REPORT', 'EXPORT');

-- CreateEnum
CREATE TYPE "ActivityTarget" AS ENUM ('USER', 'COMPANY', 'EMPLOYEE', 'SALARY', 'LEAVE', 'ATTENDANCE', 'DEPARTMENT', 'ROLE', 'SYSTEM');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "action" "ActivityAction" NOT NULL,
    "targetType" "ActivityTarget" NOT NULL,
    "targetId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
