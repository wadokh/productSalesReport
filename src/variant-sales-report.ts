import 'dotenv/config';
import {graphqlquery} from "./shopifyServices/variantsQuery";
import {startDate} from "./utils/startDate";
import {prismaCreate} from "./dbServices/prismaOperations";
import {postRequest} from "./shopifyServices/postRequest";
import {timeValues} from "./utils/timeValues";
import {OrderEdge, ShopifyResponse, Options} from "./types";

let cursor:string|null = null;
let hasNextPage:boolean = true;

const productVariantSales:{variantName: string, productId: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number, revenueIn30Days: number, revenueIn45Days: number, revenueIn90Days: number, inventoryQuantity: number, options: Options} = {};

while (hasNextPage) {
    const query:string = graphqlquery(cursor, startDate);

    try {
        const data:ShopifyResponse = await postRequest(query);
        const orders:OrderEdge[]  = data.data.orders.edges;

        for (const order of orders) {
            const orderDate: Date = new Date(order.node.createdAt);
            const now: Date = new Date();

            for (const item of order.node.lineItems.edges) {
                const productId: string = item.node.product.id;
                const quantity: number = item.node.quantity;
                const variantId: string = item.node.variant.id;
                const variantName:string = item.node.variant.displayName;
                const productOptions:object = (item.node.product.options);
                const variantStock:number = parseInt(item.node.variant.inventoryQuantity);
                const price: number = parseFloat(item.node.variant.price)
                if (!productVariantSales[variantId]) {
                    productVariantSales[variantId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, productId: productId, variantName: variantName, inventoryQuantity: variantStock, options: productOptions};
                }

                const timeDiffInDays:number = (now - orderDate) / (timeValues.numberOfMillis);

                if (timeDiffInDays <= timeValues.daysInMonth) {
                    productVariantSales[variantId].salesIn30Days += quantity;
                }
                if (timeDiffInDays <= timeValues.daysInOneAndHalfMonth) {
                    productVariantSales[variantId].salesIn45Days += quantity;
                }
                if (timeDiffInDays <= timeValues.daysIn3Month) {
                    productVariantSales[variantId].salesIn90Days += quantity;
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

console.log("Fetched variant sales data");

for (const variantId in productVariantSales) {
    const { salesIn30Days, salesIn45Days, salesIn90Days, price,productId, variantName, inventoryQuantity, options }: {variantName: string, productId: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number,  inventoryQuantity: number, options: Options} = productVariantSales[variantId];
    const revenueIn30Days = salesIn30Days * price;
    const revenueIn45Days = salesIn45Days * price;
    const revenueIn90Days = salesIn90Days * price;
    try{
        prismaCreate(variantId, variantName, productId, salesIn30Days, salesIn45Days, salesIn90Days, price, revenueIn30Days, revenueIn45Days, revenueIn90Days, inventoryQuantity, options);
    } catch (e) {
        console.error('Error inserting data:', e);
    }
}

console.log("Inserted variant sales data");

