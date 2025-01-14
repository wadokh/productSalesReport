export interface ShopifyResponse {
    data: {
        orders: {
            edges: OrderEdge[];
            pageInfo: PageInfo;
        };
    };
}

export interface OrderEdge {
    node: {
        createdAt: string;
        lineItems: {
            edges: LineItemEdge[];
        };
    };
}

export interface LineItemEdge {
    node: {
        product: Product;
        quantity: number;
        variant: Variant;
        originalUnitPriceSet:{
            presentmentMoney:{
                amount:  string
            }
        }
    };
}

export interface Product {
    id: string;
    title: string;
    options: Options;
}

export interface Options {
    id: string;
    name: string;
}

export interface Variant {
    id: string;
    displayName: string;
    price: string;
    title: string,
    inventoryQuantity: string;
}

export interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

export interface ProductSales{
    productName: string;
    salesIn30Days: number,
    salesIn45Days:number,
    salesIn90Days: number,
    price: number,
    revenueIn30Days: number,
    revenueIn45Days: number,
    revenueIn90Days: number,
}

export interface VariantSales{
    variantName: string,
    productId: string,
    salesIn30Days: number,
    salesIn45Days: number,
    salesIn90Days: number,
    price: number,
    revenueIn30Days: number,
    revenueIn45Days: number,
    revenueIn90Days: number,
    inventoryQuantity: number,
    options: Options
}