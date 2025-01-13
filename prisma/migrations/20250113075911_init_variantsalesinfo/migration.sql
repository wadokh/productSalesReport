/*
  Warnings:

  - You are about to drop the `RevenueSales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inStockVariantSales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RevenueSales";

-- DropTable
DROP TABLE "inStockVariantSales";

-- CreateTable
CREATE TABLE "VariantSalesInfo" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "inventoryQuantity" INTEGER NOT NULL,
    "salesIn30Days" INTEGER NOT NULL,
    "salesIn45Days" INTEGER NOT NULL,
    "salesIn90Days" INTEGER NOT NULL,
    "revenueIn30Days" DOUBLE PRECISION NOT NULL,
    "revenueIn45Days" DOUBLE PRECISION NOT NULL,
    "revenueIn90Days" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VariantSalesInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VariantSalesInfo_variantId_key" ON "VariantSalesInfo"("variantId");
