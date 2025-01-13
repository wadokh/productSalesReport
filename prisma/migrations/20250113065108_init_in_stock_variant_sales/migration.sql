-- CreateTable
CREATE TABLE "inStockVariantSales" (
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

    CONSTRAINT "inStockVariantSales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inStockVariantSales_variantId_key" ON "inStockVariantSales"("variantId");
