/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `OrderData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderData_orderId_key" ON "OrderData"("orderId");
