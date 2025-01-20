import {Prisma} from "@prisma/client";
import {daysIn3Month, daysInMonth, daysInOneAndHalfMonth} from "./constants";

export interface ShopifyResponse {
    data: {
        orders: {
            edges: OrderEdge[];
            pageInfo: PageInfo;
            nodes: OrderNode[];
        };
    };
}

export interface ProductResponse {
    data: {
        products: {
            nodes: ProductNode[];
            pageInfo: PageInfo;
        };
    };
}
export interface VariantResponse {
    data: {
        product: ProductNode;
    }
}
export interface ProductNode {
    id: string;
    title: string;
    options: Options;
    variants: {
        nodes: Variant[];
    };
}

const productSelect = {
    orderId: true,
    orderTime: true,
    productId: true,
    variantId: true,
    price: true,
    quantity: true,
}

export interface salesRev{
    [daysInMonth]: number;
    [daysInOneAndHalfMonth]: number;
    [daysIn3Month]: number;
}

export interface ProductData {
    productId: string,
    title: string,
    sales: JSON,
    price: number,
    revenue: JSON,
}

export interface OrderData {
    orderId: string,
    orderTime: string,
    productId: string,
    variantId: string,
    price: number,
    quantity: number
}

export interface VariantData {
    variantId: string,
    title: string,
    productId: string,
    sales: JSON,
    price: number,
    revenue: JSON,
    inventoryQuantity: number,
    options: string
}
export type MyProductPayload = Prisma.ProductGetPayload<{ select: typeof productSelect }>

export interface OrderNode {
    id: string;
    createdAt: string;
    lineItems: {
        nodes: LineItemNode[];
        pageInfo: PageInfo;
    };
}

export const errorOptions = {
    retries: 3,
    retryDelay: 1000,
    retryOn: [429, 500, 503, 540, 530, 504],
};

export interface LineItemNode {
    quantity: number;
    originalUnitPriceSet: {
        presentmentMoney: {
            amount: string;
        };
    };
    product: {
        id: string;
        title: string;
    };
    variant: {
        id: string;
        title: string;
    };
}

export interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}


export interface OrderEdge {
    node: {
        createdAt: string;
        lineItems: {
            edges: LineItemEdge[];
            pageInfo: PageInfo;
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