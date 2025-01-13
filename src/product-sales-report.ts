import 'dotenv/config';
import {graphqlquery} from "./shopifyServices/productsQuery";
import {startDate} from "./utils/startDate";
import {prismaUpsert} from "./dbServices/prismaOperations";
import {postRequest} from "./shopifyServices/postRequest";
import {timeValues} from "./utils/timeValues";

let cursor: string|null = null;
let hasNextPage: boolean = true;

const productSales = {};

while (hasNextPage) {
    const query: String = graphqlquery(cursor, startDate);

    try {
        const data: unknown = await postRequest(query);
        const orders = data.data.orders.edges;

        for (const order of orders) {
            const orderDate: Date = new Date(order.node.createdAt);
            const now: Date = new Date();

            for (const item of order.node.lineItems.edges) {
                const productId: string = item.node.product.id;
                const quantity: number = item.node.quantity;
                const minprice: number = parseFloat(item.node.product.priceRangeV2.minVariantPrice.amount)
                const maxprice: number = parseFloat(item.node.product.priceRangeV2.maxVariantPrice.amount)
                if (!productSales[productId]) {
                    productSales[productId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, minprice: minprice, maxprice: maxprice };
                }

                const timeDiffInDays: number = (now - orderDate) / (timeValues.numberOfMillis);

                if (timeDiffInDays <= timeValues.daysInMonth) {
                    productSales[productId].salesIn30Days += quantity;
                }
                if (timeDiffInDays <= timeValues.daysInOneAndHalfMonth) {
                    productSales[productId].salesIn45Days += quantity;
                }
                if (timeDiffInDays <= timeValues.daysIn3Month) {
                    productSales[productId].salesIn90Days += quantity;
                }
            }
        }

        hasNextPage = data.data.orders.pageInfo.hasNextPage;
        cursor = data.data.orders.pageInfo.endCursor;
    } catch (error) {
        console.error('Error fetching data:', error);
        break;
    }
}

console.log("Fetched product sales data");

for (const productId in productSales) {
    const { salesIn30Days, salesIn45Days, salesIn90Days, minprice, maxprice } = productSales[productId];
    const minrevenueIn30Days = salesIn30Days * minprice;
    const minrevenueIn45Days = salesIn45Days * minprice;
    const minrevenueIn90Days = salesIn90Days * minprice;
    const maxrevenueIn30Days = salesIn30Days * maxprice;
    const maxrevenueIn45Days = salesIn45Days * maxprice;
    const maxrevenueIn90Days = salesIn90Days * maxprice;
    try {
        prismaUpsert(productId, salesIn30Days, salesIn45Days, salesIn90Days, minprice, maxprice, minrevenueIn30Days, minrevenueIn45Days, maxrevenueIn90Days, minrevenueIn90Days, maxrevenueIn30Days, maxrevenueIn45Days);
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

console.log("Inserted product sales data");
