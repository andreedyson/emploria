/*
  Warnings:

  - You are about to drop the column `dateofBirth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateofBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
