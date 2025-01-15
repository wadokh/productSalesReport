import { BaseController} from "./baseController";

export class ProductController extends BaseController {

    constructor() {
        super();
    }

    public async create(productId: string, productName: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number, revenueIn30Days: number, revenueIn45Days: number, revenueIn90Days: number): Promise<void> {
        await this.prisma.productSales.create({
            data: {
                productId,
                productName,
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
}

