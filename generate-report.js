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

const productSales = {};

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
                    product {
                      id
                    }
                    quantity
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
        const orders = data.data.orders.edges;

        for (const order of orders) {
            const orderDate = new Date(order.node.createdAt);
            const now = new Date();

            for (const item of order.node.lineItems.edges) {
                const productId = item.node.product.id;
                const quantity = item.node.quantity;

                if (!productSales[productId]) {
                    productSales[productId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0 };
                }

                const timeDiffInDays = (now - orderDate) / (1000 * 60 * 60 * 24);

                if (timeDiffInDays <= 30) {
                    productSales[productId].salesIn30Days += quantity;
                }
                if (timeDiffInDays <= 45) {
                    productSales[productId].salesIn45Days += quantity;
                }
                if (timeDiffInDays <= 90) {
                    productSales[productId].salesIn90Days += quantity;
                }

                console.log(
                    `Product ID: ${productId}, Quantity: ${quantity}, Days Since Order: ${timeDiffInDays}`
                );
            }
        }

        hasNextPage = data.data.orders.pageInfo.hasNextPage;
        cursor = data.data.orders.pageInfo.endCursor;
    } catch (error) {
        console.error('Error fetching data:', error);
        break;
    }
}

for (const productId in productSales) {
    const { salesIn30Days, salesIn45Days, salesIn90Days } = productSales[productId];

    await prisma.productSales.upsert({
        where: { productId },
        update: { salesIn30Days, salesIn45Days, salesIn90Days },
        create: { productId, salesIn30Days, salesIn45Days, salesIn90Days },
    });
}

console.log('Sales data successfully stored in the database!');
await prisma.$disconnect();
