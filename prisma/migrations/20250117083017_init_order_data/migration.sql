/*
  Warnings:

  - A unique constraint covering the columns `[variantId]` on the table `OrderData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderData_variantId_key" ON "OrderData"("variantId");
