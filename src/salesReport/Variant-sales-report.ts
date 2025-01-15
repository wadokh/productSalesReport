import 'dotenv/config';
import {variantsQuery} from "../shopifyServices/queries";
import {startDate} from "../utils/startDate";
import {VariantController} from "../dbServices/VariantController";
import {shopifyService} from "../shopifyServices/shopifyService";
import {daysIn3Month, daysInMonth, daysInOneAndHalfMonth, numberOfMillis} from "../utils/constants";
import {OrderEdge, ShopifyResponse, VariantSales, Options} from "../utils/types";

export class VariantSalesReport {
    private cursor: string | null = null;
    private hasNextPage: boolean = true;
    private productVariantSales = {} as VariantSales;

    public async processSalesData(): Promise<void> {
        await this.fetchSalesData();
        this.calculateRevenue();
        await this.insertSalesData();
    }

    private async fetchSalesData(): Promise<void> {
        while (this.hasNextPage) {
            const query: string = variantsQuery(this.cursor, startDate);

            try {
                const data: ShopifyResponse = await shopifyService(query);
                const orders: OrderEdge[] = data.data.orders.edges;

                for (const order of orders) {
                    const orderDate: Date = new Date(order.node.createdAt);
                    const now: Date = new Date();

                    for (const item of order.node.lineItems.edges) {
                        const productId: string = item.node.product.id;
                        const quantity: number = item.node.quantity;
                        const variantId: string = item.node.variant.id;
                        const variantName:string = item.node.variant.displayName;
                        const productOptions:Options = (item.node.product.options);
                        const variantStock:number = parseInt(item.node.variant.inventoryQuantity);
                        const price: number = parseFloat(item.node.variant.price)

                        if (!this.productVariantSales[variantId]) {
                            this.productVariantSales[variantId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, productId: productId, variantName: variantName, inventoryQuantity: variantStock, options: productOptions };
                        }

                        const timeDiffInDays: number = (now.getTime() - orderDate.getTime()) / numberOfMillis;

                        if (timeDiffInDays <= daysInMonth) {
                            this.productVariantSales[variantId].salesIn30Days += quantity;
                        }
                        if (timeDiffInDays <= daysInOneAndHalfMonth) {
                            this.productVariantSales[variantId].salesIn45Days += quantity;
                        }
                        if (timeDiffInDays <= daysIn3Month) {
                            this.productVariantSales[variantId].salesIn90Days += quantity;
                        }
                    }
                }

                this.hasNextPage = data.data.orders.pageInfo.hasNextPage;
                this.cursor = data.data.orders.pageInfo.endCursor;

            } catch (error) {
                console.error('Error fetching data:', error);
                break;
            }
        }
        console.log("Fetched variants sales data");
    }


    private calculateRevenue(): void {
        for (const variantId in this.productVariantSales) {
            const { salesIn30Days, salesIn45Days, salesIn90Days, price,}: {variantName: string, productId: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number,  inventoryQuantity: number, options: Options} = this.productVariantSales[variantId];

            this.productVariantSales[variantId] = {
                ...this.productVariantSales[variantId],
                revenueIn30Days: salesIn30Days * price,
                revenueIn45Days: salesIn45Days * price,
                revenueIn90Days: salesIn90Days * price,
            };
        }
    }

    private async insertSalesData(): Promise<void> {
        for (const variantId in this.productVariantSales) {
            const {
                salesIn30Days, salesIn45Days, salesIn90Days,
                price, variantName, inventoryQuantity, productId, options,
                revenueIn30Days, revenueIn45Days, revenueIn90Days,
            } = this.productVariantSales[variantId];

            try {
                const variantController = new VariantController();
                await variantController.create(variantId, variantName, productId, salesIn30Days, salesIn45Days, salesIn90Days, price, revenueIn30Days, revenueIn45Days, revenueIn90Days, inventoryQuantity, options);
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        }
        console.log("Inserted variants sales data");
    }
}