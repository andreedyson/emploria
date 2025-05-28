/*
  Warnings:

  - You are about to drop the column `requestDate` on the `Leave` table. All the data in the column will be lost.
  - Added the required column `leaveType` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('ANNUAL', 'SICK', 'UNPAID', 'MATERNITY');

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "requestDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leaveType" "LeaveType" NOT NULL;
