import { BaseController} from "./BaseController";

export class ProductController extends BaseController {

    constructor() {
        super();
    }

    public async create(productId: string, title: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number, revenueIn30Days: number, revenueIn45Days: number, revenueIn90Days: number): Promise<void> {
        await this.prisma.productSales.create({
            data: {
                productId,
                title,
                salesIn30Days,
                salesIn45Days,
                salesIn90Days,
                price,
                revenueIn30Days,
                revenueIn45Days,
                revenueIn90Days
            }
        });
    }

    public async upsert(productId: string, title: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number, revenueIn30Days: number, revenueIn45Days: number, revenueIn90Days: number): Promise<void> {
        await this.prisma.productSales.upsert({
            where: {
                productId: productId
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
                productId,
                title,
                salesIn30Days,
                salesIn45Days,
                salesIn90Days,
                price,
                revenueIn30Days,
                revenueIn45Days,
                revenueIn90Days
            }
        })
    }
}



