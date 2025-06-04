/*
  Warnings:

  - You are about to drop the column `color` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "color" TEXT;
