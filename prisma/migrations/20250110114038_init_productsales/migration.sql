/*
  Warnings:

  - Added the required column `revenueIn30Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn45Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn90Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" ADD COLUMN     "revenueIn30Days" INTEGER NOT NULL,
ADD COLUMN     "revenueIn45Days" INTEGER NOT NULL,
ADD COLUMN     "revenueIn90Days" INTEGER NOT NULL;
