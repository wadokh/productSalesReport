/*
  Warnings:

  - Added the required column `productName` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" ADD COLUMN     "productName" TEXT NOT NULL;
