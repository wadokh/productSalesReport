-- AlterTable
ALTER TABLE "ProductSales" ALTER COLUMN "revenueIn30Days" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "revenueIn45Days" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "revenueIn90Days" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RevenueSales" ALTER COLUMN "revenueIn30Days" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "revenueIn45Days" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "revenueIn90Days" SET DATA TYPE DOUBLE PRECISION;
