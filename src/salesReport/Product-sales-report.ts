import 'dotenv/config';
import { productsQuery } from "../shopifyServices/queries";
import { startDate } from "../utils/startDate";
import { ProductController } from "../dbServices/ProductController";
import { shopifyService } from "../shopifyServices/shopifyService";
import { daysIn3Month, daysInMonth, daysInOneAndHalfMonth, numberOfMillis } from "../utils/constants";
import { OrderEdge, ShopifyResponse, ProductSales } from "../utils/types";

export class ProductSalesReport {

    public async processSalesData(): Promise<void> {
        await this.fetchSalesData();
    }

    private async fetchSalesData(): Promise<void> {
        let hasNextPage: boolean = true;
        let cursor: string | null = null;
        try {
            while (hasNextPage) {
                const productSales = {} as ProductSales;
                const query: string = productsQuery(cursor, startDate);

                    const data: ShopifyResponse = await shopifyService(query);
                    const orders: OrderEdge[] = data.data.orders.edges;

                    for (const order of orders) {
                        const orderDate: Date = new Date(order.node.createdAt);
                        const now: Date = new Date();

                        for (const item of order.node.lineItems.edges) {
                            const productId: string = item.node.product.id;
                            const title: string = item.node.product.title
                            const quantity: number = item.node.quantity;
                            const price: number = parseFloat(item.node.originalUnitPriceSet.presentmentMoney.amount);
                            if (!productSales[productId]) {
                                productSales[productId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, title: title };
                            }

                            const timeDiffInDays: number = (now.getTime() - orderDate.getTime()) / numberOfMillis;

                            if (timeDiffInDays <= daysInMonth) {
                                productSales[productId].salesIn30Days += quantity;
                            }
                            if (timeDiffInDays <= daysInOneAndHalfMonth) {
                                productSales[productId].salesIn45Days += quantity;
                            }
                            if (timeDiffInDays <= daysIn3Month) {
                                productSales[productId].salesIn90Days += quantity;
                            }
                        }
                    }
                    this.calculateRevenue(productSales);
                    await this.insertSalesData(productSales);
                    hasNextPage = data.data.orders.pageInfo.hasNextPage;
                    cursor = data.data.orders.pageInfo.endCursor;

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        console.log("Fetched product sales data");
    }


    private calculateRevenue(productSales: ProductSales): void {
        for (const productId in productSales) {
            const { salesIn30Days, salesIn45Days, salesIn90Days, price } = productSales[productId];

            productSales[productId] = {
                ...productSales[productId],
                revenueIn30Days: salesIn30Days * price,
                revenueIn45Days: salesIn45Days * price,
                revenueIn90Days: salesIn90Days * price,
            };
        }
    }

    private async insertSalesData(productSales: ProductSales): Promise<void> {
        for (const productId in productSales) {
            const {
                salesIn30Days, salesIn45Days, salesIn90Days,
                price, title,
                revenueIn30Days, revenueIn45Days, revenueIn90Days
            } = productSales[productId];

            try {
                const prismaOperations = new ProductController();
                await prismaOperations.upsert(
                    productId, title,
                    salesIn30Days, salesIn45Days, salesIn90Days,
                    price,
                    revenueIn30Days, revenueIn45Days, revenueIn90Days,
                );
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        }
        console.log("Inserted product sales data");
    }
}
