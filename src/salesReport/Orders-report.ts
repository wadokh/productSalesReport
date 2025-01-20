import {lineItemsQuery, OrderQuery} from "../shopifyServices/queries";
import {startDate} from "../utils/startDate";
import {LineItemNode, OrderNode, PageInfo, ShopifyResponse} from "../utils/types";
import {shopifyService} from "../shopifyServices/shopifyService";
import {OrderController} from "../dbServices/OrderController";
import {oneLimit} from "../utils/constants";
import {handlePageInfo} from "../utils/helperFunctions";


export class OrdersReport {

    public async processSalesData(): Promise<void> {
        await this.fetchOrdersData();
    }

    private async fetchOrdersData(): Promise<void> {
        let hasNextPage: boolean = true;
        let cursor: string | null = null;
        let itemCursor: string | null = null;
        try {
            while (hasNextPage){
                console.log("fetching an order batch");
                const query: string = OrderQuery(cursor, startDate);
                const data: ShopifyResponse = await shopifyService(query);
                const orders: OrderNode[] = data.data.orders.nodes || [];
                for (const order of orders) {
                    const orderId: string = order.id;
                    const orderTime: string = order.createdAt;
                    let itemNextPage: boolean = true;
                    while (itemNextPage){
                        const itemQuery: string = lineItemsQuery(cursor, startDate, itemCursor, oneLimit);
                        const itemData: ShopifyResponse = await shopifyService(itemQuery);
                        const lineItemNodes: LineItemNode[] = itemData.data.orders.nodes[0].lineItems.nodes;
                        for (const lineItem of lineItemNodes){
                            const productId: string = lineItem.product.id;
                            const variantId: string = lineItem.variant.id;
                            const price: number = parseFloat(lineItem.originalUnitPriceSet.presentmentMoney.amount);
                            const quantity: number = lineItem.quantity;
                            await this.insertOrderData(orderId, orderTime, productId, variantId, price, quantity);
                        }
                        const itemPageInfo: PageInfo = itemData.data.orders.nodes[0].lineItems.pageInfo;
                        [itemNextPage, itemCursor] = handlePageInfo(itemPageInfo);
                    }
                }
                const pageInfo: PageInfo = data.data.orders.pageInfo;
                [hasNextPage, cursor] = handlePageInfo(pageInfo);
                console.log("inserted order item data");
            }
        }
        catch (error) {
            throw error;
        }
    }

    private async insertOrderData(orderId: string, orderTime: string, productId: string, variantId: string, price: number, quantity: number): Promise<void> {
        try{
            const orderController = new OrderController();
            await orderController.create(orderId, orderTime, productId, variantId, price, quantity);
        } catch (e) {
            throw e;
        }
    };
}