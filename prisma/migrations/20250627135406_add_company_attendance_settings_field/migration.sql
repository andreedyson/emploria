-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "checkInEndTime" TEXT,
ADD COLUMN     "checkInStartTime" TEXT,
ADD COLUMN     "lateCheckInThreshold" TEXT,
ADD COLUMN     "minimumWorkHours" INTEGER;
