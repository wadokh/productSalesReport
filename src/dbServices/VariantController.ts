import { BaseController} from "./BaseController";
import {MyProductPayload, VariantData} from "../utils/types";

export class VariantController extends BaseController {

    constructor() {
        super();
    }

    public async create(variantData: VariantData): Promise<void> {
        await this.prisma.variantSalesInfo.create({
            data: {
                variantId: variantData.variantId,
                title: variantData.title,
                productId: variantData.productId,
                sales: variantData.sales,
                price: variantData.price,
                revenue:variantData.revenue,
                inventoryQuantity: variantData.inventoryQuantity,
                options: variantData.options
            }
        });
    }

    public async findVariants(variantId: string): Promise<MyProductPayload> {
        const result: MyProductPayload = await this.prisma.orderItemData.findMany({
            where: {
                variantId
            }
        })
        return result;
    }
}

