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
    };
}

export interface Product {
    id: string;
    title: string;
    options: Options;
    priceRangeV2: {
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        };
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
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

