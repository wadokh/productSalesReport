/*
  Warnings:

  - You are about to drop the column `price` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn30Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn45Days` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `revenueIn90Days` on the `ProductSales` table. All the data in the column will be lost.
  - Added the required column `maxprice` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxrevenueIn30Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxrevenueIn45Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxrevenueIn90Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minprice` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minrevenueIn30Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minrevenueIn45Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minrevenueIn90Days` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" DROP COLUMN "price",
DROP COLUMN "revenueIn30Days",
DROP COLUMN "revenueIn45Days",
DROP COLUMN "revenueIn90Days",
ADD COLUMN     "maxprice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxrevenueIn30Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxrevenueIn45Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxrevenueIn90Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minprice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minrevenueIn30Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minrevenueIn45Days" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minrevenueIn90Days" DOUBLE PRECISION NOT NULL;
