/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,month,year]` on the table `Salary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Salary_employeeId_month_year_key" ON "Salary"("employeeId", "month", "year");
