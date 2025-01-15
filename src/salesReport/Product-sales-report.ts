import 'dotenv/config';
import { productsQuery } from "../shopifyServices/queries";
import { startDate } from "../utils/startDate";
import { ProductController } from "../dbServices/ProductController";
import { shopifyService } from "../shopifyServices/shopifyService";
import { daysIn3Month, daysInMonth, daysInOneAndHalfMonth, numberOfMillis } from "../utils/constants";
import { OrderEdge, ShopifyResponse, ProductSales } from "../utils/types";

export class ProductSalesReport {
    private cursor: string | null = null;
    private hasNextPage: boolean = true;
    private productSales = {} as ProductSales;

    public async processSalesData(): Promise<void> {
        await this.fetchSalesData();
        this.calculateRevenue();
        await this.insertSalesData();
    }

    private async fetchSalesData(): Promise<void> {
        while (this.hasNextPage) {
            const query: string = productsQuery(this.cursor, startDate);

            try {
                const data: ShopifyResponse = await shopifyService(query);
                const orders: OrderEdge[] = data.data.orders.edges;

                for (const order of orders) {
                    const orderDate: Date = new Date(order.node.createdAt);
                    const now: Date = new Date();

                    for (const item of order.node.lineItems.edges) {
                        const productId: string = item.node.product.id;
                        const productName: string = item.node.product.title
                        const quantity: number = item.node.quantity;
                        const price: number = parseFloat(item.node.originalUnitPriceSet.presentmentMoney.amount);
                        if (!this.productSales[productId]) {
                            this.productSales[productId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, price: price, productName: productName };
                        }

                        const timeDiffInDays: number = (now.getTime() - orderDate.getTime()) / numberOfMillis;

                        if (timeDiffInDays <= daysInMonth) {
                            this.productSales[productId].salesIn30Days += quantity;
                        }
                        if (timeDiffInDays <= daysInOneAndHalfMonth) {
                            this.productSales[productId].salesIn45Days += quantity;
                        }
                        if (timeDiffInDays <= daysIn3Month) {
                            this.productSales[productId].salesIn90Days += quantity;
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
        console.log("Fetched product sales data");
    }


    private calculateRevenue(): void {
        for (const productId in this.productSales) {
            const { salesIn30Days, salesIn45Days, salesIn90Days, price, productName } = this.productSales[productId];

            this.productSales[productId] = {
                ...this.productSales[productId],
                revenueIn30Days: salesIn30Days * price,
                revenueIn45Days: salesIn45Days * price,
                revenueIn90Days: salesIn90Days * price,
            };
        }
    }

    private async insertSalesData(): Promise<void> {
        for (const productId in this.productSales) {
            const {
                salesIn30Days, salesIn45Days, salesIn90Days,
                price, productName,
                revenueIn30Days, revenueIn45Days, revenueIn90Days
            } = this.productSales[productId];

            try {
                const prismaOperations = new ProductController();
                await prismaOperations.create(
                    productId, productName,
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
