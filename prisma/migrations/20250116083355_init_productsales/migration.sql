/*
  Warnings:

  - You are about to drop the column `productName` on the `ProductSales` table. All the data in the column will be lost.
  - You are about to drop the column `variantName` on the `VariantSalesInfo` table. All the data in the column will be lost.
  - Added the required column `title` to the `ProductSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `VariantSalesInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSales" DROP COLUMN "productName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VariantSalesInfo" DROP COLUMN "variantName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL;
