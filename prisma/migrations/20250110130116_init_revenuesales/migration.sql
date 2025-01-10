/*
  Warnings:

  - Added the required column `variantName` to the `RevenueSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RevenueSales" ADD COLUMN     "variantName" TEXT NOT NULL;
