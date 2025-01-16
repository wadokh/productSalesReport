import 'dotenv/config';
import {variantsQuery} from "../shopifyServices/queries";
import {startDate} from "../utils/startDate";
import {VariantController} from "../dbServices/VariantController";
import {shopifyService} from "../shopifyServices/shopifyService";
import {daysIn3Month, daysInMonth, daysInOneAndHalfMonth, numberOfMillis} from "../utils/constants";
import {OrderEdge, ShopifyResponse, VariantSales, Options, Variant} from "../utils/types";

export class VariantSalesReport {

    public async processSalesData(): Promise<void> {
        await this.fetchSalesData();
    }

    private async fetchSalesData(): Promise<void> {
        let hasNextPage: boolean = true;
        let cursor: string | null = null;
        try {
            while (hasNextPage) {
                const productVariantSales = {} as VariantSales;
                const query: string = variantsQuery(cursor, startDate);

                    const data: ShopifyResponse = await shopifyService(query);
                    const orders: OrderEdge[] = data.data.orders.edges;

                    for (const order of orders) {
                        const orderDate: Date = new Date(order.node.createdAt);
                        const now: Date = new Date();

                        for (const item of order.node.lineItems.edges) {
                            const productId: string = item.node.product.id;
                            const quantity: number = item.node.quantity;
                            const variantId: string = item.node.variant.id;
                            const title:string = item.node.variant.displayName;
                            const productOptions:Options = (item.node.product.options);
                            const variantStock:number = parseInt(item.node.variant.inventoryQuantity);
                            const price: number = parseFloat(item.node.variant.price)

                            if (!productVariantSales[variantId]) {
                                productVariantSales[variantId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, productId: productId, title: title, inventoryQuantity: variantStock, options: productOptions };
                            }

                            const timeDiffInDays: number = (now.getTime() - orderDate.getTime()) / numberOfMillis;

                            if (timeDiffInDays <= daysInMonth) {
                                productVariantSales[variantId].salesIn30Days += quantity;
                            }
                            if (timeDiffInDays <= daysInOneAndHalfMonth) {
                                productVariantSales[variantId].salesIn45Days += quantity;
                            }
                            if (timeDiffInDays <= daysIn3Month) {
                                productVariantSales[variantId].salesIn90Days += quantity;
                            }
                        }
                    }

                    this.calculateRevenue(productVariantSales);
                    await this.insertSalesData(productVariantSales);
                    hasNextPage = data.data.orders.pageInfo.hasNextPage;
                    cursor = data.data.orders.pageInfo.endCursor;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        console.log("Fetched variants sales data");
    }


    private calculateRevenue(productVariantSales: VariantSales): void {
        for (const variantId in productVariantSales) {
            const { salesIn30Days, salesIn45Days, salesIn90Days, price,}: {title: string, productId: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number,  inventoryQuantity: number, options: Options} = productVariantSales[variantId];

            productVariantSales[variantId] = {
                ...productVariantSales[variantId],
                revenueIn30Days: salesIn30Days * price,
                revenueIn45Days: salesIn45Days * price,
                revenueIn90Days: salesIn90Days * price,
            };
        }
    }

    private async insertSalesData(productVariantSales: VariantSales): Promise<void> {
        for (const variantId in productVariantSales) {
            const {
                salesIn30Days, salesIn45Days, salesIn90Days,
                price, title, inventoryQuantity, productId, options,
                revenueIn30Days, revenueIn45Days, revenueIn90Days,
            } = productVariantSales[variantId];

            try {
                const variantController = new VariantController();
                await variantController.upsert(variantId, title, productId, salesIn30Days, salesIn45Days, salesIn90Days, price, revenueIn30Days, revenueIn45Days, revenueIn90Days, inventoryQuantity, options);
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        }
        console.log("Inserted variants sales data");
    }
}