import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const prismaUpsert = async (productId, salesIn30Days, salesIn45Days, salesIn90Days, minprice, maxprice, minrevenueIn30Days, minrevenueIn45Days, maxrevenueIn90Days, minrevenueIn90Days, maxrevenueIn30Days, maxrevenueIn45Days) => {
    await prisma.productSales.upsert({
        where: {productId},
        update: {salesIn30Days, salesIn45Days, salesIn90Days},
        create: {
            productId,
            salesIn30Days,
            salesIn45Days,
            salesIn90Days,
            minprice,
            maxprice,
            minrevenueIn30Days,
            minrevenueIn45Days,
            maxrevenueIn90Days,
            minrevenueIn90Days,
            maxrevenueIn30Days,
            maxrevenueIn45Days
        },
    });
    await prisma.$disconnect();
}

export const prismaCreate = async (variantId, variantName, productId, salesIn30Days, salesIn45Days, salesIn90Days, price, revenueIn30Days, revenueIn45Days, revenueIn90Days, inventoryQuantity, options) => {
    await prisma.variantSalesInfo.create({
        data: {
            variantId,
            variantName,
            productId,
            salesIn30Days,
            salesIn45Days,
            salesIn90Days,
            price,
            revenueIn30Days,
            revenueIn45Days,
            revenueIn90Days,
            inventoryQuantity,
            options
        }
    })
    await prisma.$disconnect();
}

