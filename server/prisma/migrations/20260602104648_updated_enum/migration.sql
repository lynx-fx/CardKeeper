/*
  Warnings:

  - The values [BRAND,STORE,EXTENDED,OHTER] on the enum `WarrantyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WarrantyType_new" AS ENUM ('Limited', 'Store', 'Extended', 'Manufacturer');
ALTER TABLE "Card" ALTER COLUMN "warrantyType" TYPE "WarrantyType_new" USING ("warrantyType"::text::"WarrantyType_new");
ALTER TYPE "WarrantyType" RENAME TO "WarrantyType_old";
ALTER TYPE "WarrantyType_new" RENAME TO "WarrantyType";
DROP TYPE "public"."WarrantyType_old";
COMMIT;
