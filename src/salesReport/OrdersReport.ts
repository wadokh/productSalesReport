import {lineItemsQuery, OrderQuery} from "../shopifyServices/queries";
import {startDate} from "../utils/startDate";
import {LineItemNode, OrderData, OrderNode, PageInfo, OrderResponse, OrderNodeResponse} from "../utils/types";
import {ShopifyService} from "../shopifyServices/ShopifyService";
import {OrderServices} from "../dbServices/OrderServices";
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
            let count: number = 1;
            while (hasNextPage){
                console.log(`Fetching order batch number ${count}`);
                const query: string = OrderQuery(cursor, startDate);
                const shopifyService = new ShopifyService();
                const data: OrderResponse = await shopifyService.fetchOrders(query);
                const orders: OrderNode[] = data.data.orders.nodes || [];
                for (const order of orders) {
                    const orderId: string = order.id;
                    const orderTime: string = order.createdAt;
                    let itemNextPage: boolean = true;
                    while (itemNextPage){
                        const itemQuery: string = lineItemsQuery(orderId, itemCursor);
                        const itemData: OrderNodeResponse = await shopifyService.fetchLineItems(itemQuery);
                        const lineItemNodes: LineItemNode[] = itemData.data.order.lineItems.nodes;
                        for (const lineItem of lineItemNodes){
                            const productId: string = lineItem.product.id;
                            const variantId: string = lineItem.variant.id;
                            const price: number = parseFloat(lineItem.originalUnitPriceSet.presentmentMoney.amount);
                            const quantity: number = lineItem.quantity;
                            await this.insertOrderData(orderId, orderTime, productId, variantId, price, quantity);
                        }
                        const itemPageInfo: PageInfo = itemData.data.order.lineItems.pageInfo;
                        [itemNextPage, itemCursor] = handlePageInfo(itemPageInfo);
                    }
                }
                const pageInfo: PageInfo = data.data.orders.pageInfo;
                [hasNextPage, cursor] = handlePageInfo(pageInfo);
                console.log(`inserted order item data from batch number ${count}`);
                count += 1;
            }
        }
        catch (error) {
            throw error;
        }
    }

    private async insertOrderData(orderId: string, orderTime: string, productId: string, variantId: string, price: number, quantity: number): Promise<void> {
        try{
            const orderController = new OrderServices();
            const orderData: OrderData = {
                orderId: orderId,
                orderTime: orderTime,
                productId: productId,
                variantId: variantId,
                price: price,
                quantity: quantity
            }
            await orderController.create(orderData);
        } catch (e) {
            throw e;
        }
    };
}