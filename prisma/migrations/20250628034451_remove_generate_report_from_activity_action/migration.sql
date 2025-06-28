/*
  Warnings:

  - The values [GENERATE_REPORT] on the enum `ActivityAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityAction_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'LOGIN', 'LOGOUT', 'RESET_PASSWORD', 'ASSIGN', 'UNASSIGN', 'APPROVE', 'REJECT', 'EXPORT');
ALTER TABLE "Activity" ALTER COLUMN "action" TYPE "ActivityAction_new" USING ("action"::text::"ActivityAction_new");
ALTER TYPE "ActivityAction" RENAME TO "ActivityAction_old";
ALTER TYPE "ActivityAction_new" RENAME TO "ActivityAction";
DROP TYPE "ActivityAction_old";
COMMIT;
