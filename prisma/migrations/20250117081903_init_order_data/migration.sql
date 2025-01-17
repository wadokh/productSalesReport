-- CreateTable
CREATE TABLE "OrderData" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderTime" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderData_pkey" PRIMARY KEY ("id")
);
