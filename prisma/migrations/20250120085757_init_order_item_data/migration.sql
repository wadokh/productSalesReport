/*
  Warnings:

  - You are about to drop the `OrderData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OrderData";

-- CreateTable
CREATE TABLE "OrderItemData" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderTime" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItemData_pkey" PRIMARY KEY ("id")
);
