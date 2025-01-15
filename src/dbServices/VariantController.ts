import { BaseController} from "./BaseController";

export class VariantController extends BaseController {

    constructor() {
        super();
    }

    public async create(variantId: string, variantName: string, productId: string, salesIn30Days: number, salesIn45Days: number, salesIn90Days: number, price: number, revenueIn30Days: number, revenueIn45Days: number, revenueIn90Days: number, inventoryQuantity: number, options: string): Promise<void> {
        await this.prisma.variantSalesInfo.create({
            data: {
                variantId,
                variantName,
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
        });
    }
}

