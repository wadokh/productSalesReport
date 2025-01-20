import { BaseServices} from "./BaseServices";
import {OrderData} from "../utils/types";

export class OrderServices extends BaseServices {

    constructor() {
        super();
    }

    public async create(orderData: OrderData): Promise<void> {
        await this.prisma.orderItemData.create({
            data: {
                orderId: orderData.orderId,
                orderTime: orderData.orderTime,
                productId: orderData.productId,
                variantId: orderData.variantId,
                price: orderData.price,
                quantity: orderData.quantity,
            }
        });
    }
}



