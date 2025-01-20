import {allProductsQuery, allVariantsQuery} from "../shopifyServices/queries";
import {
    MyProductPayload,
    Options,
    PageInfo, ProductData,
    ProductNode,
    ProductResponse, salesRev,
    Variant, VariantData,
    VariantResponse
} from "../utils/types";
import { ShopifyService } from "../shopifyServices/ShopifyService";
import {ProductServices} from "../dbServices/ProductServices";
import {daysIn3Month, daysInMonth, daysInOneAndHalfMonth} from "../utils/constants";
import {VariantServices} from "../dbServices/VariantServices";
import {handlePageInfo, handleSalesRev} from "../utils/helperFunctions";


export class ProductVariantReport {

    public async processSalesData(): Promise<void> {
        await this.fetchProductsData();
    }

    private async fetchProductsData(): Promise<void> {
        let hasNextPage: boolean = true;
        let cursor: string | null = null;
        const now: Date = new Date();
        const productController = new ProductServices();
        const variantController = new VariantServices();
        try{
            let count: number = 1;
            while(hasNextPage){
                const shopifyService = new ShopifyService();
                const query: string = allProductsQuery(cursor);
                const data: ProductResponse = await shopifyService.fetchProducts(query);
                console.log(`Fetching batch number ${count}`);
                const products: ProductNode[] = data.data.products.nodes;
                const pageInfo: PageInfo = data.data.products.pageInfo;
                [hasNextPage, cursor] = handlePageInfo(pageInfo);

                for (const product of products){
                    const productId: string = product.id;
                    const options: Options = product.options;
                    const title: string = product.title;
                    const ordersLen: number = await this.insertProductData(productId, title, productController, now);

                    if (ordersLen > 0){
                        const varQuery: string = allVariantsQuery(productId);
                        const varData: VariantResponse = await shopifyService.fetchVariants(varQuery);
                        const variants: Variant[] = varData.data.product.variants.nodes;

                        for (const variant of variants){
                            const variantId: string = variant.id;
                            const title: string = variant.displayName;
                            const inventoryQuantity: number = parseInt(variant.inventoryQuantity);
                            await this.insertVariantData(variantId, productId, title, inventoryQuantity, options, now, variantController)
                        }
                    }
                }
                console.log(`Batch number ${count} inserted`);
                count += 1;
            }
        } catch (e) {
            throw e;
        }
    }

    private async insertProductData(productId: string, title: string, productController: ProductServices, now: Date): Promise<number> {
        const orders: MyProductPayload[] = await productController.findProducts(productId);
        if (orders.length > 0){
            const sales: salesRev = {
                [daysInMonth]: 0,
                [daysInOneAndHalfMonth]: 0,
                [daysIn3Month]: 0,
            }
            const revenue: salesRev = {
                [daysInMonth]: 0,
                [daysInOneAndHalfMonth]: 0,
                [daysIn3Month]: 0,
            }
            let price: number = 0;
            for (const order of orders){
                const orderDate: Date = new Date(order.orderTime);
                const quantity: number = order.quantity;
                price = order.price;
                handleSalesRev(now, sales, revenue, orderDate, price, quantity);
            }
            const productData: ProductData = {
                productId: productId,
                title: title,
                sales: JSON.parse(JSON.stringify(sales)),
                revenue: JSON.parse(JSON.stringify(revenue)),
                price: price,
            }
            await productController.create(productData);
        }
        return orders.length;
    }

    private async insertVariantData(variantId: string,productId: string, title: string, inventoryQuantity: number, options: Options, now: Date, variantController: VariantServices): Promise<void> {
        const orders: MyProductPayload[] = await variantController.findVariants(variantId);
        if (orders.length > 0){
            const sales = {
                [daysInMonth]: 0,
                [daysInOneAndHalfMonth]: 0,
                [daysIn3Month]: 0,
            }
            const revenue = {
                [daysInMonth]: 0,
                [daysInOneAndHalfMonth]: 0,
                [daysIn3Month]: 0,
            }
            let price: number = 0;
            for (const order of orders){
                const orderDate: Date = new Date(order.orderTime);
                const quantity: number = order.quantity;
                price = order.price;
                handleSalesRev(now, sales, revenue, orderDate, price, quantity);
            }
            const variantData: VariantData = {
                variantId: variantId,
                productId: productId,
                price: price,
                title: title,
                sales: JSON.parse(JSON.stringify(sales)),
                revenue: JSON.parse(JSON.stringify(revenue)),
                options: JSON.stringify(options),
                inventoryQuantity: inventoryQuantity,

            }
            await variantController.create(variantData);
        }
    }

}