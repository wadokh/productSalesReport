/*
  Warnings:

  - A unique constraint covering the columns `[orderId,variantId]` on the table `OrderItemData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderItemData_orderId_variantId_key" ON "OrderItemData"("orderId", "variantId");
