/*
  Warnings:

  - Added the required column `price` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "RevenueSales" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "salesIn30Days" INTEGER NOT NULL,
    "salesIn45Days" INTEGER NOT NULL,
    "salesIn90Days" INTEGER NOT NULL,
    "revenueIn30Days" INTEGER NOT NULL,
    "revenueIn45Days" INTEGER NOT NULL,
    "revenueIn90Days" INTEGER NOT NULL,
    "options" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueSales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevenueSales_variantId_key" ON "RevenueSales"("variantId");
