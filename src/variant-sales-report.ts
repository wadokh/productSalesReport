import 'dotenv/config';
import {graphqlquery} from "./shopifyServices/variantsQuery";
import {startDate} from "./utils/startDate";
import {prismaCreate} from "./dbServices/prismaOperations";
import {postRequest} from "./shopifyServices/postRequest";
import {timeValues} from "./utils/timeValues";

let cursor:string|null = null;
let hasNextPage:boolean = true;

const productVariantSales = {};

while (hasNextPage) {
    const query:string = graphqlquery(cursor, startDate);

    try {
        const data:unknown = await postRequest(query);
        console.log( typeof data)
        const orders:any = data.data.orders.edges;

        for (const order of orders) {
            const orderDate = new Date(order.node.createdAt);
            const now = new Date();

            for (const item of order.node.lineItems.edges) {
                const productId = item.node.product.id;
                const quantity = item.node.quantity;
                const variantId = item.node.variant.id;
                const variantName = item.node.variant.displayName;
                const productOptions = (item.node.product.options);
                const variantStock = parseInt(item.node.variant.inventoryQuantity);
                const price = parseFloat(item.node.variant.price)
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
                console.log(
                    `Variant ID: ${variantId} Product ID: ${productId}, Quantity: ${quantity}, Days Since Order: ${timeDiffInDays}, Price: ${price}`
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

for (const variantId in productVariantSales) {
    const { salesIn30Days, salesIn45Days, salesIn90Days, price,productId, variantName, inventoryQuantity, options } = productVariantSales[variantId];
    const revenueIn30Days = salesIn30Days * price;
    const revenueIn45Days = salesIn45Days * price;
    const revenueIn90Days = salesIn90Days * price;
    try{
        prismaCreate(variantId, variantName, productId, salesIn30Days, salesIn45Days, salesIn90Days, price, revenueIn30Days, revenueIn45Days, revenueIn90Days, inventoryQuantity, options).
            then(() => {
            console.log('Sales data successfully stored in the database!');
        })
    } catch (e) {
        console.error('Error inserting data:', e);
    }
}

