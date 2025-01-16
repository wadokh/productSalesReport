/*
  Warnings:

  - You are about to drop the column `revenue` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `sales` on the `ProductSales` table. All the data in the column will be lost.
  - Added the required column `revenueIn30Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn45Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn90Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesIn30Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesIn45Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesIn90Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" DROP COLUMN "revenue",
DROP COLUMN "sales",
ADD COLUMN     "revenueIn30Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenueIn45Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenueIn90Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "salesIn30Days" INTEGER NOT NULL,
ADD COLUMN     "salesIn45Days" INTEGER NOT NULL,
ADD COLUMN     "salesIn90Days" INTEGER NOT NULL;
