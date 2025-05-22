/*
  Warnings:

  - You are about to drop the column `status` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('USER', 'MANAGER');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "EmployeeRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "EmployeeStatus";
