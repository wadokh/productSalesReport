/*
  Warnings:

  - You are about to drop the column `revenueIn30Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn45Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn90Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `salesIn30Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `salesIn45Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `salesIn90Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn30Days` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn45Days` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn90Days` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - You are about to drop the column `salesIn30Days` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - You are about to drop the column `salesIn45Days` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - You are about to drop the column `salesIn90Days` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - Added the required column `revenue` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `VariantSalesInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales` to the `VariantSalesInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" DROP COLUMN "revenueIn30Days",
DROP COLUMN "revenueIn45Days",
DROP COLUMN "revenueIn90Days",
DROP COLUMN "salesIn30Days",
DROP COLUMN "salesIn45Days",
DROP COLUMN "salesIn90Days",
ADD COLUMN     "revenue" JSONB NOT NULL,
ADD COLUMN     "sales" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "VariantSalesInfo" DROP COLUMN "revenueIn30Days",
DROP COLUMN "revenueIn45Days",
DROP COLUMN "revenueIn90Days",
DROP COLUMN "salesIn30Days",
DROP COLUMN "salesIn45Days",
DROP COLUMN "salesIn90Days",
ADD COLUMN     "revenue" JSONB NOT NULL,
ADD COLUMN     "sales" JSONB NOT NULL;
