-- CreateTable
CREATE TABLE "ProductSales" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "salesIn30Days" INTEGER NOT NULL,
    "salesIn45Days" INTEGER NOT NULL,
    "salesIn90Days" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSales_productId_key" ON "ProductSales"("productId");
