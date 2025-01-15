/*
  Warnings:

  - You are about to drop the column `maxprice` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `maxrevenueIn30Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `maxrevenueIn45Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `maxrevenueIn90Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `minprice` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `minrevenueIn30Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `minrevenueIn45Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `minrevenueIn90Days` on the `ProductSales` table. All the data in the column will be lost.
  - Added the required column `price` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn30Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn45Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenueIn90Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" DROP COLUMN "maxprice",
DROP COLUMN "maxrevenueIn30Days",
DROP COLUMN "maxrevenueIn45Days",
DROP COLUMN "maxrevenueIn90Days",
DROP COLUMN "minprice",
DROP COLUMN "minrevenueIn30Days",
DROP COLUMN "minrevenueIn45Days",
DROP COLUMN "minrevenueIn90Days",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenueIn30Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenueIn45Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenueIn90Days" DOUBLE PRECISION NOT NULL;
