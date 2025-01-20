import { BaseController} from "./BaseController";
import {MyProductPayload} from "../utils/types";

export class VariantController extends BaseController {

    constructor() {
        super();
    }

    public async create(variantId: string, title: string, productId: string, sales: string, price: number, revenue: string, inventoryQuantity: number, options: string): Promise<void> {
        await this.prisma.variantSalesInfo.create({
            data: {
                variantId,
                title,
                productId,
                sales,
                price,
                revenue,
                inventoryQuantity,
                options
            }
        });
    }

    public async findVariants(variantId: string): Promise<MyProductPayload> {
        const result: MyProductPayload = await this.prisma.orderData.findMany({
            where: {
                variantId
            }
        })
        return result;
    }

    public async upsert(variantId: string, title: string, productId: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number, revenueIn30Days: number, revenueIn45Days: number, revenueIn90Days: number, inventoryQuantity: number, options: string): Promise<void> {
        await this.prisma.variantSalesInfo.upsert({
            where: {
                variantId: variantId
            },
            update: {
                salesIn30Days: {
                    increment: salesIn30Days
                },
                salesIn45Days: {
                    increment: salesIn45Days
                },
                salesIn90Days: {
                    increment: salesIn90Days
                },
                revenueIn30Days: {
                    increment: revenueIn30Days
                },
                revenueIn45Days: {
                    increment: revenueIn45Days
                },
                revenueIn90Days: {
                    increment: revenueIn90Days
                }
            },
            create: {
                variantId,
                title,
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
    }
}

