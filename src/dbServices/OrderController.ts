import { BaseController} from "./BaseController";

export class OrderController extends BaseController {

    constructor() {
        super();
    }

    public async create(orderId: string, orderTime: string, productId: string, variantId: string, price: number, quantity: number): Promise<void> {
        await this.prisma.orderData.create({
            data: {
                orderId,
                orderTime,
                productId,
                variantId,
                price,
                quantity,
            }
        });
    }
}



