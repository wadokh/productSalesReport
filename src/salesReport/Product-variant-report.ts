import {allProductsQuery, allVariantsQuery} from "../shopifyServices/queries";
import {MyProductPayload, Options, ProductNode, ProductResponse, Variant, VariantResponse} from "../utils/types";
import {ProductService, VariantService} from "../shopifyServices/shopifyService";
import {ProductController} from "../dbServices/ProductController";
import {daysIn3Month, daysInMonth, daysInOneAndHalfMonth, numberOfMillis} from "../utils/constants";
import {VariantController} from "../dbServices/VariantController";


export class ProductVariantReport {

    private now: Date = new Date();
    public async processSalesData(): Promise<void> {
        await this.fetchProductsData();
    }

    private async fetchProductsData(){
        let hasNextPage: boolean = true;
        let cursor: string | null = null;
        const productController = new ProductController();
        const variantController = new VariantController();
        try{
            while(hasNextPage){
                const query: string = allProductsQuery(cursor);
                const data: ProductResponse = await ProductService(query);
                console.log(data.data.products.pageInfo);
                const products: ProductNode[] = data.data.products.nodes;
                hasNextPage = data.data.products.pageInfo.hasNextPage;
                cursor = data.data.products.pageInfo.endCursor;
                for (const product of products){
                    const productId: string = product.id;
                    const options: Options = product.options;
                    const title: string = product.title;
                    const ordersLen: number = await this.insertProductData(productId, title, productController);
                    if (ordersLen > 0){
                        const varQuery: string = allVariantsQuery(productId);
                        const varData: VariantResponse = await VariantService(varQuery);
                        const variants: Variant[] = varData.data.product.variants.nodes;
                        for (const variant of variants){
                            const variantId: string = variant.id;
                            const title: string = variant.displayName;
                            const price: number = parseInt(variant.price);
                            const inventoryQuantity: number = parseInt(variant.inventoryQuantity);
                            await this.insertVariantData(variantId, productId, title, price, inventoryQuantity, options, variantController)
                        }
                    }
                }
            }
        } catch (e) {
            throw e;
        }
    }

    private async insertProductData(productId: string,title: string, productController: ProductController){
        const orders: MyProductPayload[] = await productController.findProducts(productId);
        console.log(orders.length);
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
                const timeDiffInDays: number = (this.now.getTime() - orderDate.getTime()) / numberOfMillis;
                if (timeDiffInDays <= daysInMonth) {
                    sales[daysInMonth] += quantity;
                    revenue[daysInMonth] += quantity*price;
                }
                if (timeDiffInDays <= daysInOneAndHalfMonth) {
                    sales[daysInOneAndHalfMonth] += quantity;
                    revenue[daysInOneAndHalfMonth] += quantity*price;
                }
                if (timeDiffInDays <= daysIn3Month) {
                    sales[daysIn3Month] += quantity;
                    revenue[daysIn3Month] += quantity*price;
                }
            }
            await productController.create(productId, title, JSON.parse(JSON.stringify(sales)), price, JSON.parse(JSON.stringify(revenue)));
        }
        return orders.length;
    }

    private async insertVariantData(variantId: string,productId: string, title: string, price: number, inventoryQuantity: number, options: Options, variantController: VariantController){
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
            for (const order of orders){
                const orderDate: Date = new Date(order.orderTime);
                const quantity: number = order.quantity;
                const timeDiffInDays: number = (this.now.getTime() - orderDate.getTime()) / numberOfMillis;
                if (timeDiffInDays <= daysInMonth) {
                    sales[daysInMonth] += quantity;
                    revenue[daysInMonth] += quantity*price;
                }
                if (timeDiffInDays <= daysInOneAndHalfMonth) {
                    sales[daysInOneAndHalfMonth] += quantity;
                    revenue[daysInOneAndHalfMonth] += quantity*price;
                }
                if (timeDiffInDays <= daysIn3Month) {
                    sales[daysIn3Month] += quantity;
                    revenue[daysIn3Month] += quantity*price;
                }
            }
            await variantController.create(variantId, title, productId, JSON.stringify(sales), price, JSON.stringify(revenue), inventoryQuantity, JSON.stringify(options));
        }
    }

}