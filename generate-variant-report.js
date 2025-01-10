import 'dotenv/config';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN } = process.env;
const graphqlEndpoint = `https://${SHOPIFY_STORE_URL}/admin/api/2025-01/graphql.json`;

const startDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 90);
    return date.toISOString();
})();

let cursor = null;
let hasNextPage = true;

const productVariantSales = {};

while (hasNextPage) {
    const query = `
query {
    orders(first: 250, after: ${cursor ? `"${cursor}"` : null}, query: "created_at:>=${startDate}") {
        edges {
            node {
                createdAt
                lineItems(first: 100) {
                    edges {
                        node {
                            quantity
                            product {
                                id
                                title
                            }
                            variant{
                              id
                              displayName
                              price
                              title
                            }
                        }
                    }
                }
            }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
    }
}
`;

    try {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        console.log(data)
        const orders = data.data.orders.edges;

        for (const order of orders) {
            const orderDate = new Date(order.node.createdAt);
            const now = new Date();

            for (const item of order.node.lineItems.edges) {
                const productId = item.node.product.id;
                const quantity = item.node.quantity;
                const variantId = item.node.variant.id;
                const variantName = item.node.variant.displayName;
                const price = parseFloat(item.node.variant.price)
                if (!productVariantSales[variantId]) {
                    productVariantSales[variantId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, productId: productId, variantName: variantName};
                }

                const timeDiffInDays = (now - orderDate) / (1000 * 60 * 60 * 24);

                if (timeDiffInDays <= 30) {
                    productVariantSales[variantId].salesIn30Days += quantity;
                }
                if (timeDiffInDays <= 45) {
                    productVariantSales[variantId].salesIn45Days += quantity;
                }
                if (timeDiffInDays <= 90) {
                    productVariantSales[variantId].salesIn90Days += quantity;
                }
                console.log(
                    `Variant ID: ${variantId} Product ID: ${productId}, Quantity: ${quantity}, Days Since Order: ${timeDiffInDays}, Price: ${price}`
                );
                // for (const productVar of item.node.product.variants.edges){
                //     const variantId = productVar.node.id;
                //     const variantName = productVar.node.displayName;
                //     const price = parseFloat(productVar.node.price);
                //
                //     if (!productVariantSales[variantId]) {
                //         productVariantSales[variantId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, productId: productId, variantName: variantName};
                //     }
                //
                //     const timeDiffInDays = (now - orderDate) / (1000 * 60 * 60 * 24);
                //
                //     if (timeDiffInDays <= 30) {
                //         productVariantSales[variantId].salesIn30Days += quantity;
                //     }
                //     if (timeDiffInDays <= 45) {
                //         productVariantSales[variantId].salesIn45Days += quantity;
                //     }
                //     if (timeDiffInDays <= 90) {
                //         productVariantSales[variantId].salesIn90Days += quantity;
                //     }
                //     console.log(
                //         `Variant ID: ${variantId} Product ID: ${productId}, Quantity: ${quantity}, Days Since Order: ${timeDiffInDays}`
                //     );
                // }


            }
        }

        hasNextPage = data.data.orders.pageInfo.hasNextPage;
        cursor = data.data.orders.pageInfo.endCursor;
    } catch (error) {
        console.error('Error fetching data:', error);
        break;
    }
}

for (const variantId in productVariantSales) {
    const { salesIn30Days, salesIn45Days, salesIn90Days, price,productId, variantName } = productVariantSales[variantId];
    const revenueIn30Days = salesIn30Days * price;
    const revenueIn45Days = salesIn45Days * price;
    const revenueIn90Days = salesIn90Days * price;
    await prisma.revenueSales.upsert({
        where: { variantId },
        update: { salesIn30Days, salesIn45Days, salesIn90Days },
        create: { variantId, variantName, productId, salesIn30Days, salesIn45Days, salesIn90Days, price, revenueIn30Days, revenueIn45Days, revenueIn90Days },
    });
    console.log('Sales data successfully stored in the database!');
}

await prisma.$disconnect();