-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "status" "SalaryStatus" NOT NULL DEFAULT 'UNPAID';
