import { BaseServices} from "./BaseServices";
import {MyProductPayload, ProductData} from "../utils/types";
export class ProductServices extends BaseServices {

    constructor() {
        super();
    }

    public async create(productData: ProductData): Promise<void> {
        await this.prisma.productSales.create({
            data: {
                productId: productData.productId,
                title: productData.title,
                sales: productData.sales,
                price: productData.price,
                revenue: productData.revenue
            }
        });
    }

    public async findProducts(productId: string): Promise<MyProductPayload> {
        const result: MyProductPayload = await this.prisma.orderItemData.findMany({
            where: {
                productId
            }
        })
        return result;
    }
}



