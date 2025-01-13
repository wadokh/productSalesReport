/*
  Warnings:

  - Added the required column `options` to the `VariantSalesInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VariantSalesInfo" ADD COLUMN     "options" JSONB NOT NULL;
